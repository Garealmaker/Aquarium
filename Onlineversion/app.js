import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const STORAGE_KEY = "aquariow-legacy-save";
const content = window.GAME_CONTENT || { species: [], plants: [], shopItems: [] };

const fishCatalog = new Map((content.species || []).map((entry) => [entry.id, entry]));
const plantCatalog = new Map((content.plants || []).map((entry) => [entry.id, entry]));
const utilityShopItems = (content.shopItems || []).filter((item) =>
  ["food", "ph-up", "ph-down"].includes(item.type),
);
const equipmentShopItems = (content.shopItems || []).filter((item) =>
  ["lamp", "co2", "filter"].includes(item.type),
);
const plantShopCosts = new Map(
  (content.shopItems || [])
    .filter((item) => item.type === "plant" && item.plantType)
    .map((item) => [item.plantType, item.cost]),
);

const utilityLabels = {
  food: "Nourriture",
  "ph-up": "Pastilles pH+",
  "ph-down": "Pastilles pH-",
};

const diffuserOutputs = { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12 };

const els = {
  authBadge: document.getElementById("auth-badge"),
  authStatus: document.getElementById("auth-status"),
  userEmail: document.getElementById("user-email"),
  lastSync: document.getElementById("last-sync"),
  localSaveStatus: document.getElementById("local-save-status"),
  remoteSaveStatus: document.getElementById("remote-save-status"),
  launcherCloudActions: document.getElementById("launcher-cloud-actions"),
  devServerBlock: document.getElementById("dev-server-block"),
  devLegacyBlock: document.getElementById("dev-legacy-block"),
  signupPlayerNameInput: document.getElementById("signup-player-name-input"),
  signupEmailInput: document.getElementById("signup-email-input"),
  signupBirthdayInput: document.getElementById("signup-birthday-input"),
  signupPasswordInput: document.getElementById("signup-password-input"),
  loginPlayerNameInput: document.getElementById("login-player-name-input"),
  loginPasswordInput: document.getElementById("login-password-input"),
  authInlineNote: document.getElementById("auth-inline-note"),
  signupBtn: document.getElementById("signup-btn"),
  loginBtn: document.getElementById("login-btn"),
  openGameBtn: document.getElementById("open-game-btn"),
  logoutBtn: document.getElementById("logout-btn"),
  pullCloudBtn: document.getElementById("pull-cloud-btn"),
  pushLocalBtn: document.getElementById("push-local-btn"),
  writeBrowserBtn: document.getElementById("write-browser-btn"),
  createDemoBtn: document.getElementById("create-demo-btn"),
  saveSummary: document.getElementById("save-summary"),
  coreBadge: document.getElementById("core-badge"),
  bootstrapCoreBtn: document.getElementById("bootstrap-core-btn"),
  reloadCoreBtn: document.getElementById("reload-core-btn"),
  advanceCoreCycleBtn: document.getElementById("advance-core-cycle-btn"),
  coreAquariumSelect: document.getElementById("core-aquarium-select"),
  coreSummary: document.getElementById("core-summary"),
  coreStatus: document.getElementById("core-status"),
  serverShopCategory: document.getElementById("server-shop-category"),
  serverShopSelect: document.getElementById("server-shop-select"),
  serverBuyBtn: document.getElementById("server-buy-btn"),
  serverTemperatureInput: document.getElementById("server-temperature-input"),
  serverLightInput: document.getElementById("server-light-input"),
  applyTemperatureBtn: document.getElementById("server-apply-temperature-btn"),
  applyLightBtn: document.getElementById("server-apply-light-btn"),
  serverUtilitySelect: document.getElementById("server-utility-select"),
  serverUseUtilityBtn: document.getElementById("server-use-utility-btn"),
  serverUtilityList: document.getElementById("server-utility-list"),
  serverFishSelect: document.getElementById("server-fish-select"),
  serverToggleFishBtn: document.getElementById("server-toggle-fish-btn"),
  serverPlantSelect: document.getElementById("server-plant-select"),
  serverPlantDepthSelect: document.getElementById("server-plant-depth-select"),
  serverTogglePlantBtn: document.getElementById("server-toggle-plant-btn"),
  serverFishList: document.getElementById("server-fish-list"),
  serverPlantList: document.getElementById("server-plant-list"),
  saveJson: document.getElementById("save-json"),
  formatJsonBtn: document.getElementById("format-json-btn"),
  jsonStatus: document.getElementById("json-status"),
};

let supabase = null;
let currentSession = null;
let currentRemoteSave = null;
let currentCoreState = null;
let selectedAquariumId = "";
let authBusy = false;
let autoOpenScheduled = false;

function isDevMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("dev") === "1";
}

function getSupabaseConfig() {
  return window.AQUARIOW_SUPABASE || {};
}

function toast(message) {
  const existing = document.querySelector(".toast");
  if (existing) {
    existing.remove();
  }
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  window.setTimeout(() => node.remove(), 3200);
}

function isConfigured() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePlayerName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 26);
}

function isValidBirthday(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return false;
  }
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date <= new Date();
}

function setAuthBusy(busy, message = "") {
  authBusy = busy;
  if (message && els.authStatus) {
    els.authStatus.textContent = message;
  }
  els.signupBtn.disabled = busy || !isConfigured();
  els.loginBtn.disabled = busy || !isConfigured();
}

function getFriendlyAuthError(error) {
  const rawMessage = String(error?.message || "").toLowerCase();
  if (rawMessage.includes("pseudo inconnu")) {
    return "Pseudo inconnu.";
  }
  if (rawMessage.includes("invalid login credentials")) {
    return "Pseudo ou mot de passe incorrect.";
  }
  if (rawMessage.includes("email not confirmed")) {
    return "Confirme d'abord ton email avant de te connecter.";
  }
  if (rawMessage.includes("profiles_player_name_unique_idx") || rawMessage.includes("ce pseudo est deja utilise")) {
    return "Ce pseudo est deja utilise.";
  }
  if (rawMessage.includes("user already registered")) {
    return "Ce compte existe deja. Essaie plutot de te connecter.";
  }
  if (rawMessage.includes("password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caracteres.";
  }
  return error?.message || "Une erreur d'authentification est survenue.";
}

function shouldAutoOpenGame() {
  const params = new URLSearchParams(window.location.search);
  return params.get("stay") !== "1";
}

function getGameLaunchUrl() {
  const pathname = window.location.pathname || "";
  if (pathname.includes("/online")) {
    return new URL("./game", window.location.href).toString();
  }
  return new URL("./game.html", window.location.href).toString();
}

function scheduleAutoOpen(message = "Session detectee. Ouverture du jeu...") {
  if (autoOpenScheduled || !shouldAutoOpenGame()) {
    return;
  }
  autoOpenScheduled = true;
  if (els.authStatus) {
    els.authStatus.textContent = message;
  }
  window.setTimeout(() => {
    autoOpenScheduled = false;
    if (currentSession?.user) {
      openGame();
    }
  }, 550);
}

function openGameSoon(message = "Connexion reussie. Ouverture du jeu...") {
  if (!shouldAutoOpenGame()) {
    return;
  }
  if (els.authStatus) {
    els.authStatus.textContent = message;
  }
  window.setTimeout(() => {
    openGame();
  }, 180);
}

function formatDateTime(value) {
  if (!value) {
    return "Jamais";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Inconnue";
  }
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function setJsonEditor(value) {
  els.saveJson.value = JSON.stringify(value || {}, null, 2);
}

function getJsonEditorValue() {
  const raw = els.saveJson.value.trim();
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
}

function getLocalSave() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function createDemoSave() {
  return {
    saveVersion: 1,
    profile: {
      playerName: "Capitaine des lagons",
      level: 2,
      xp: 36,
      coins: 280,
      pearls: 16,
    },
    aquariums: [
      {
        id: "aquarium-1",
        name: "Lagon de test",
        fish: [],
        plantsPlaced: [],
        aquarium: {
          waterQuality: 82,
          temperature: 24,
          oxygenLevel: 64,
        },
      },
    ],
  };
}

function getSaveSummary(save) {
  if (!save) {
    return {
      player: "-",
      aquariums: "-",
      fish: "-",
      plants: "-",
      coins: "-",
      pearls: "-",
    };
  }

  const aquariums = Array.isArray(save.aquariums) ? save.aquariums : [];
  const fish = aquariums.reduce((sum, aquarium) => sum + ((aquarium.fish || []).length || 0), 0);
  const plants = aquariums.reduce((sum, aquarium) => sum + ((aquarium.plantsPlaced || []).length || 0), 0);
  return {
    player: save?.profile?.playerName || "-",
    aquariums: aquariums.length,
    fish,
    plants,
    coins: save?.profile?.coins ?? "-",
    pearls: save?.profile?.pearls ?? "-",
  };
}

function renderSaveSummary(save) {
  const summary = getSaveSummary(save);
  els.saveSummary.innerHTML = `
    <div><span>Joueur</span><strong>${summary.player}</strong></div>
    <div><span>Aquariums</span><strong>${summary.aquariums}</strong></div>
    <div><span>Poissons</span><strong>${summary.fish}</strong></div>
    <div><span>Plantes</span><strong>${summary.plants}</strong></div>
    <div><span>Coquillages</span><strong>${summary.coins}</strong></div>
    <div><span>Perles</span><strong>${summary.pearls}</strong></div>
  `;
}

function getSelectedAquarium() {
  const aquariums = Array.isArray(currentCoreState?.aquariums) ? currentCoreState.aquariums : [];
  if (!aquariums.length) {
    return null;
  }
  return aquariums.find((aquarium) => aquarium.id === selectedAquariumId) || aquariums[0];
}

function getPlacedFish(aquarium) {
  return Array.isArray(aquarium?.fish) ? aquarium.fish : [];
}

function getPlacedPlants(aquarium) {
  return Array.isArray(aquarium?.plants) ? aquarium.plants : [];
}

function getInventoryUtilities() {
  return Array.isArray(currentCoreState?.inventory?.utilities) ? currentCoreState.inventory.utilities : [];
}

function getInventoryFish() {
  return Array.isArray(currentCoreState?.inventory?.fish) ? currentCoreState.inventory.fish : [];
}

function getInventoryPlants() {
  return Array.isArray(currentCoreState?.inventory?.plants) ? currentCoreState.inventory.plants : [];
}

function clampRatio(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function computeAquariumMetrics(aquarium) {
  const fish = getPlacedFish(aquarium);
  const plants = getPlacedPlants(aquarium);
  const diffuserLevel = aquarium?.diffuser_level || 1;
  const co2Produced = Number(aquarium?.co2_level ?? diffuserOutputs[diffuserLevel] ?? 4);
  const totalCo2Need = plants.reduce((sum, plant) => {
    const meta = plantCatalog.get(plant.species_id);
    return sum + Number(meta?.co2Need || 0);
  }, 0);
  const co2Coverage = totalCo2Need > 0 ? Math.min(1, co2Produced / totalCo2Need) : 1;

  const o2Produced = plants.reduce((sum, plant) => {
    const meta = plantCatalog.get(plant.species_id);
    if (!meta || Number(aquarium?.light_hours || 0) <= 0) {
      return sum;
    }
    const tempOk = aquarium.temperature_target >= meta.temperatureMin && aquarium.temperature_target <= meta.temperatureMax;
    const phOk = aquarium.ph_level >= meta.phMin && aquarium.ph_level <= meta.phMax;
    const lightOk = aquarium.light_hours >= meta.lightMin && aquarium.light_hours <= meta.lightMax;
    const ratio = ((tempOk ? 1 : 0) + (phOk ? 1 : 0) + (lightOk ? 1 : 0) + co2Coverage) / 4;
    return sum + Number(meta.oxygenGeneration || 0) * clampRatio(ratio);
  }, 0);

  const o2Consumed = fish.reduce((sum, entry) => {
    const meta = fishCatalog.get(entry.species_id);
    return sum + Number(meta?.oxygenMin ? Math.max(0.5, meta.oxygenMin / 40) : 1);
  }, 0);
  const oxygenCoverage = o2Consumed > 0 ? Math.min(1, o2Produced / o2Consumed) : 1;

  const preferredPlants = new Set(plants.map((plant) => plant.species_id));
  const comfortAverage = fish.length
    ? fish.reduce((sum, entry) => {
        const meta = fishCatalog.get(entry.species_id);
        if (!meta) {
          return sum + 50;
        }
        const tempOk = aquarium.temperature_target >= meta.temperatureMin && aquarium.temperature_target <= meta.temperatureMax;
        const phOk = aquarium.ph_level >= meta.phMin && aquarium.ph_level <= meta.phMax;
        const hungerOk = Number(entry.hunger || 0) > 0;
        const preferredPlant = preferredPlants.has(meta.preferredPlantId);
        let comfort = ((tempOk ? 1 : 0) + (phOk ? 1 : 0) + (hungerOk ? 1 : 0) + oxygenCoverage) / 4;
        comfort = comfort * 100;
        if (preferredPlant) {
          comfort += 8;
        }
        if (Number(aquarium.water_quality || 0) < 50) {
          comfort -= 12;
        }
        if (fish.length > 12) {
          comfort -= Math.min(20, (fish.length - 12) * 2);
        }
        return sum + Math.max(0, Math.min(100, comfort));
      }, 0) / fish.length
    : 100;

  return {
    fishCount: fish.length,
    plantCount: plants.length,
    co2Produced,
    co2Consumed: Math.min(co2Produced, totalCo2Need),
    o2Produced,
    o2Consumed,
    comfortAverage,
  };
}

function setSelectOptions(select, options, fallbackLabel) {
  const safeOptions = Array.isArray(options) ? options : [];
  if (!safeOptions.length) {
    select.innerHTML = `<option value="">${fallbackLabel}</option>`;
    select.value = "";
    return;
  }

  select.innerHTML = safeOptions
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");
}

function renderServerList(container, items, emptyMessage) {
  if (!items.length) {
    container.innerHTML = `<div class="server-item"><strong>Vide</strong><p>${emptyMessage}</p></div>`;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <div class="server-item">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </div>
      `,
    )
    .join("");
}

function getFishOptionPool(aquarium) {
  return [
    ...getInventoryFish().map((fish) => ({
      value: fish.id,
      label: `${fish.nickname} - ${fish.species_name} [Inventaire]`,
    })),
    ...getPlacedFish(aquarium).map((fish) => ({
      value: fish.id,
      label: `${fish.nickname} - ${fish.species_name} [Dans le bac]`,
    })),
  ];
}

function getPlantOptionPool(aquarium) {
  return [
    ...getInventoryPlants().map((plant) => ({
      value: plant.id,
      label: `${plant.nickname} - ${plant.species_name} [Inventaire]`,
    })),
    ...getPlacedPlants(aquarium).map((plant) => ({
      value: plant.id,
      label: `${plant.nickname} - ${plant.species_name} [Dans le bac]`,
    })),
  ];
}

function getUtilityOptionPool() {
  return getInventoryUtilities().map((entry) => ({
    value: entry.item_key,
    label: `${utilityLabels[entry.item_key] || entry.item_key} x${entry.quantity}`,
  }));
}

function getShopOptions(category, aquarium) {
  if (category === "fish") {
    return (content.species || []).map((entry) => ({
      value: entry.id,
      label: `${entry.species} - ${entry.cost} coquillage`,
    }));
  }

  if (category === "plant") {
    return (content.plants || []).map((entry) => ({
      value: entry.id,
      label: `${entry.species} - ${plantShopCosts.get(entry.id) || 0} coquillage`,
    }));
  }

  if (category === "utility") {
    return utilityShopItems.map((entry) => ({
      value: entry.id,
      label: `${entry.name} - ${entry.cost} coquillage`,
    }));
  }

  if (category === "equipment") {
    const lampLevel = aquarium?.lamp_level || 1;
    const diffuserLevel = aquarium?.diffuser_level || 1;
    const filterLevel = aquarium?.filter_level || 1;
    return equipmentShopItems
      .filter((entry) => {
        if (entry.type === "lamp") {
          return entry.level === lampLevel + 1;
        }
        if (entry.type === "co2") {
          return entry.level === diffuserLevel + 1;
        }
        if (entry.type === "filter") {
          return entry.level === filterLevel + 1;
        }
        return false;
      })
      .map((entry) => ({
        value: entry.id,
        label: `${entry.name} - ${entry.cost} coquillage`,
      }));
  }

  return [];
}

function updateShopOptions() {
  const aquarium = getSelectedAquarium();
  const category = els.serverShopCategory.value || "fish";
  setSelectOptions(els.serverShopSelect, getShopOptions(category, aquarium), "Aucun article disponible");
}

function renderCoreState(coreState) {
  currentCoreState = coreState || null;

  const profile = currentCoreState?.profile || {};
  const aquariums = Array.isArray(currentCoreState?.aquariums) ? currentCoreState.aquariums : [];
  if (!selectedAquariumId || !aquariums.some((aquarium) => aquarium.id === selectedAquariumId)) {
    selectedAquariumId = aquariums[0]?.id || "";
  }

  setSelectOptions(
    els.coreAquariumSelect,
    aquariums.map((aquarium) => ({
      value: aquarium.id,
      label: `${aquarium.name} - cycle ${aquarium.cycle_number}`,
    })),
    "Aucun aquarium",
  );
  els.coreAquariumSelect.value = selectedAquariumId;

  const aquarium = getSelectedAquarium();
  const metrics = computeAquariumMetrics(aquarium);

  if (aquarium) {
    els.serverTemperatureInput.value = Math.round(Number(aquarium.temperature_target || 24));
    els.serverLightInput.max = String(aquarium.lamp_max_hours || 6);
    els.serverLightInput.value = Math.round(Number(aquarium.light_hours || 0));
  } else {
    els.serverTemperatureInput.value = "24";
    els.serverLightInput.max = "6";
    els.serverLightInput.value = "0";
  }

  els.coreSummary.innerHTML = `
    <div><span>Joueur</span><strong>${profile.player_name || "-"}</strong></div>
    <div><span>Coquillages</span><strong>${profile.coins ?? "-"}</strong></div>
    <div><span>Perles</span><strong>${profile.pearls ?? "-"}</strong></div>
    <div><span>Aquarium</span><strong>${aquarium?.name || "-"}</strong></div>
    <div><span>Cycle</span><strong>${aquarium?.cycle_number ?? "-"}</strong></div>
    <div><span>Temps restant</span><strong>${aquarium?.minutes_remaining ?? "-"} min</strong></div>
    <div><span>Eau</span><strong>${aquarium ? `${Math.round(Number(aquarium.water_quality || 0))}%` : "-"}</strong></div>
    <div><span>Confort moyen</span><strong>${aquarium ? `${Math.round(metrics.comfortAverage)}%` : "-"}</strong></div>
    <div><span>CO2 cons./prod.</span><strong>${aquarium ? `${metrics.co2Consumed.toFixed(1)} / ${metrics.co2Produced.toFixed(1)}` : "-"}</strong></div>
    <div><span>O2 cons./prod.</span><strong>${aquarium ? `${metrics.o2Consumed.toFixed(1)} / ${metrics.o2Produced.toFixed(1)}` : "-"}</strong></div>
    <div><span>Temperature</span><strong>${aquarium ? `${Math.round(Number(aquarium.temperature_target || 0))} C` : "-"}</strong></div>
    <div><span>pH</span><strong>${aquarium ? Number(aquarium.ph_level || 7).toFixed(1) : "-"}</strong></div>
  `;

  renderServerList(
    els.serverUtilityList,
    getInventoryUtilities().map((entry) => ({
      title: utilityLabels[entry.item_key] || entry.item_key,
      body: `Stock serveur: ${entry.quantity}`,
    })),
    "Aucun utilitaire en stock sur le serveur.",
  );

  renderServerList(
    els.serverFishList,
    getPlacedFish(aquarium).map((fish) => ({
      title: `${fish.nickname} - ${fish.species_name}`,
      body: `Faim ${Math.round(Number(fish.hunger || 0))}% | PDV ${fish.vitality_points}/10 | Long. ${fish.longevity_cycles_left} cycles`,
    })),
    "Aucun poisson place dans cet aquarium.",
  );

  renderServerList(
    els.serverPlantList,
    getPlacedPlants(aquarium).map((plant) => ({
      title: `${plant.nickname} - ${plant.species_name}`,
      body: `Profondeur P${plant.depth} | PDV ${plant.vitality_points}/10 | Long. ${plant.longevity_cycles_left} cycles`,
    })),
    "Aucune plante placee dans cet aquarium.",
  );

  setSelectOptions(els.serverUtilitySelect, getUtilityOptionPool(), "Aucun utilitaire");
  setSelectOptions(els.serverFishSelect, getFishOptionPool(aquarium), "Aucun poisson");
  setSelectOptions(els.serverPlantSelect, getPlantOptionPool(aquarium), "Aucune plante");
  updateShopOptions();

  els.coreStatus.textContent = aquarium
    ? `Le serveur calcule maintenant les cycles hors ligne depuis ${formatDateTime(aquarium.last_auto_cycle_at)} et garde la verite pour le bac actif.`
    : "Initialise le noyau serveur pour commencer.";

  updateUi();
}

function updateUi() {
  const authenticated = Boolean(currentSession?.user);
  const localSave = getLocalSave();
  const hasCore = Boolean(currentCoreState?.profile);
  const aquarium = getSelectedAquarium();
  const displayName = currentCoreState?.profile?.player_name || currentSession?.user?.email || "Aucun";
  const devMode = isDevMode();

  if (els.launcherCloudActions) {
    els.launcherCloudActions.hidden = !devMode;
  }
  if (els.devServerBlock) {
    els.devServerBlock.hidden = !devMode;
  }
  if (els.devLegacyBlock) {
    els.devLegacyBlock.hidden = !devMode;
  }

  els.authBadge.textContent = authenticated ? "Connecte" : "Hors ligne";
  els.authBadge.className = `badge ${authenticated ? "online" : "offline"}`;
  els.userEmail.textContent = displayName;
  els.localSaveStatus.textContent = localSave ? "Presente" : "Absente";
  els.remoteSaveStatus.textContent = devMode
    ? currentRemoteSave?.updated_at ? "Disponible" : "Inconnue"
    : hasCore ? "Actif" : "Serveur";
  els.lastSync.textContent = devMode
    ? currentRemoteSave?.updated_at ? formatDateTime(currentRemoteSave.updated_at) : "Jamais"
    : hasCore ? "Session active" : "En attente";
  els.signupBtn.disabled = authBusy || !isConfigured() || authenticated;
  els.loginBtn.disabled = authBusy || !isConfigured() || authenticated;
  els.openGameBtn.disabled = !authenticated;
  els.logoutBtn.disabled = !authenticated;
  els.pullCloudBtn.disabled = !authenticated;
  els.pushLocalBtn.disabled = !authenticated;
  els.writeBrowserBtn.disabled = !authenticated || !currentRemoteSave?.state;
  els.createDemoBtn.disabled = !authenticated;

  els.bootstrapCoreBtn.disabled = !authenticated;
  els.reloadCoreBtn.disabled = !authenticated;
  els.advanceCoreCycleBtn.disabled = !authenticated || !aquarium;
  els.coreAquariumSelect.disabled = !authenticated || !hasCore || !aquarium;
  els.serverShopCategory.disabled = !authenticated || !hasCore;
  els.serverShopSelect.disabled = !authenticated || !hasCore;
  els.serverBuyBtn.disabled = !authenticated || !hasCore || !els.serverShopSelect.value;
  els.serverTemperatureInput.disabled = !authenticated || !hasCore || !aquarium;
  els.serverLightInput.disabled = !authenticated || !hasCore || !aquarium;
  els.applyTemperatureBtn.disabled = !authenticated || !hasCore || !aquarium;
  els.applyLightBtn.disabled = !authenticated || !hasCore || !aquarium;
  els.serverUtilitySelect.disabled = !authenticated || !hasCore || !aquarium;
  els.serverUseUtilityBtn.disabled = !authenticated || !hasCore || !aquarium || !els.serverUtilitySelect.value;
  els.serverFishSelect.disabled = !authenticated || !hasCore || !aquarium;
  els.serverToggleFishBtn.disabled = !authenticated || !hasCore || !aquarium || !els.serverFishSelect.value;
  els.serverPlantSelect.disabled = !authenticated || !hasCore || !aquarium;
  els.serverPlantDepthSelect.disabled = !authenticated || !hasCore || !aquarium;
  els.serverTogglePlantBtn.disabled = !authenticated || !hasCore || !aquarium || !els.serverPlantSelect.value;

  if (!isConfigured()) {
    els.authStatus.textContent = "";
    els.coreBadge.textContent = "A configurer";
  } else if (authBusy) {
    els.coreBadge.textContent = "Authentification";
  } else if (!authenticated) {
    els.authStatus.textContent = "";
    els.coreBadge.textContent = "Hors ligne";
  } else if (hasCore) {
    els.authStatus.textContent = "";
    els.coreBadge.textContent = "Serveur actif";
  } else {
    els.authStatus.textContent = "";
    els.coreBadge.textContent = "Pret";
  }

  if (els.authInlineNote) {
    els.authInlineNote.textContent =
      "Inscription: mail, pseudo, anniversaire et mot de passe. Connexion: pseudo et mot de passe.";
  }
}

function openGame() {
  window.location.href = getGameLaunchUrl();
}

async function loadRemoteSave() {
  if (!currentSession?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("game_saves")
    .select("user_id, save_version, state, updated_at")
    .eq("user_id", currentSession.user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  currentRemoteSave = data || null;
  if (data?.state) {
    setJsonEditor(data.state);
    renderSaveSummary(data.state);
    els.jsonStatus.textContent = "Sauvegarde cloud chargee dans l'editeur.";
  }
  updateUi();
  return data;
}

async function pushSaveToCloud(save) {
  if (!currentSession?.user) {
    throw new Error("Tu dois etre connecte.");
  }

  const payload = {
    user_id: currentSession.user.id,
    save_version: Number(save?.saveVersion || 1),
    state: save,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("game_saves").upsert(payload, { onConflict: "user_id" });
  if (error) {
    throw error;
  }

  await loadRemoteSave();
}

function writeCloudSaveToBrowser() {
  if (!currentRemoteSave?.state) {
    toast("Aucune sauvegarde cloud a ecrire dans le navigateur.");
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentRemoteSave.state));
  setJsonEditor(currentRemoteSave.state);
  renderSaveSummary(currentRemoteSave.state);
  updateUi();
  toast("La sauvegarde cloud a ete ecrite dans localStorage.");
}

async function bootstrapCoreState() {
  const { data, error } = await supabase.rpc("bootstrap_player_core_state");
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function reloadCoreState() {
  const { data, error } = await supabase.rpc("get_player_core_state");
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function advanceCoreCycle() {
  const aquarium = getSelectedAquarium();
  if (!aquarium?.id) {
    throw new Error("Aucun aquarium serveur disponible.");
  }
  const { data, error } = await supabase.rpc("advance_cycle_server", {
    target_aquarium_id: aquarium.id,
  });
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function buyServerItem() {
  const aquarium = getSelectedAquarium();
  const itemCategory = els.serverShopCategory.value;
  const itemKey = els.serverShopSelect.value;
  if (!itemCategory || !itemKey) {
    throw new Error("Choisis un article a acheter.");
  }

  const { data, error } = await supabase.rpc("buy_server_item", {
    target_item_category: itemCategory,
    target_item_key: itemKey,
    target_aquarium_id: aquarium?.id || null,
  });
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function useServerUtility() {
  const aquarium = getSelectedAquarium();
  const itemKey = els.serverUtilitySelect.value;
  if (!aquarium?.id || !itemKey) {
    throw new Error("Choisis un aquarium et un utilitaire.");
  }

  const { data, error } = await supabase.rpc("use_inventory_utility_server", {
    target_item_key: itemKey,
    target_aquarium_id: aquarium.id,
  });
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function applyAquariumSetting(settingKey, rawValue) {
  const aquarium = getSelectedAquarium();
  if (!aquarium?.id) {
    throw new Error("Aucun aquarium serveur disponible.");
  }

  const { data, error } = await supabase.rpc("update_aquarium_setting_server", {
    target_aquarium_id: aquarium.id,
    setting_key: settingKey,
    setting_value: Number(rawValue),
  });
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function toggleServerFish() {
  const aquarium = getSelectedAquarium();
  const fishId = els.serverFishSelect.value;
  if (!fishId) {
    throw new Error("Choisis un poisson.");
  }

  const { data, error } = await supabase.rpc("toggle_fish_placement_server", {
    target_fish_id: fishId,
    target_aquarium_id: aquarium?.id || null,
  });
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function toggleServerPlant() {
  const aquarium = getSelectedAquarium();
  const plantId = els.serverPlantSelect.value;
  if (!plantId) {
    throw new Error("Choisis une plante.");
  }

  const { data, error } = await supabase.rpc("toggle_plant_placement_server", {
    target_plant_id: plantId,
    target_aquarium_id: aquarium?.id || null,
    target_depth: Number(els.serverPlantDepthSelect.value || 2),
  });
  if (error) {
    throw error;
  }
  renderCoreState(data);
  return data;
}

async function handleSignup() {
  const playerName = normalizePlayerName(els.signupPlayerNameInput.value);
  const email = els.signupEmailInput.value.trim();
  const birthDate = String(els.signupBirthdayInput.value || "").trim();
  const password = els.signupPasswordInput.value.trim();
  if (!playerName || !email || !birthDate || !password) {
    toast("Renseigne le pseudo, le mail, la date d'anniversaire et le mot de passe.");
    return;
  }
  if (playerName.length < 3) {
    toast("Le pseudo doit contenir au moins 3 caracteres.");
    return;
  }
  if (!isValidEmail(email)) {
    toast("Entre une adresse email valide.");
    return;
  }
  if (!isValidBirthday(birthDate)) {
    toast("Entre une date d'anniversaire valide.");
    return;
  }
  if (password.length < 6) {
    toast("Le mot de passe doit contenir au moins 6 caracteres.");
    return;
  }
  setAuthBusy(true, "Creation du compte en cours...");
  updateUi();
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: new URL("./index.html", window.location.href).toString(),
        data: {
          player_name: playerName,
          birth_date: birthDate,
        },
      },
    });
    if (error) {
      throw error;
    }
    if (data?.session) {
      currentSession = data.session;
      toast("Compte cree et session ouverte.");
      updateUi();
      openGameSoon("Compte cree. Ouverture du jeu...");
      return;
    }
    toast("Compte cree. Verifie ton email si la confirmation est active dans Supabase.");
  } catch (error) {
    toast(getFriendlyAuthError(error));
  } finally {
    setAuthBusy(false);
    updateUi();
  }
}

async function handleLogin() {
  const playerName = normalizePlayerName(els.loginPlayerNameInput.value);
  const password = els.loginPasswordInput.value.trim();
  if (!playerName || !password) {
    toast("Renseigne ton pseudo et ton mot de passe.");
    return;
  }
  setAuthBusy(true, "Connexion en cours...");
  updateUi();
  try {
    const { data: resolvedEmail, error: lookupError } = await supabase.rpc("get_login_email_for_player_name", {
      target_player_name: playerName,
    });
    if (lookupError) {
      throw lookupError;
    }
    if (!resolvedEmail) {
      throw new Error("Pseudo inconnu");
    }

    const email = String(resolvedEmail).trim();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    if (data?.session) {
      currentSession = data.session;
    }
    toast("Connexion reussie.");
    updateUi();
    openGameSoon("Connexion reussie. Ouverture du jeu...");
  } catch (error) {
    toast(getFriendlyAuthError(error));
  } finally {
    setAuthBusy(false);
    updateUi();
  }
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast(error.message);
    return;
  }
  currentRemoteSave = null;
  currentCoreState = null;
  renderCoreState(null);
  toast("Session fermee.");
}

function bindEvents() {
  els.signupBtn.addEventListener("click", () => handleSignup());
  els.loginBtn.addEventListener("click", () => handleLogin());
  els.openGameBtn.addEventListener("click", () => openGame());
  els.logoutBtn.addEventListener("click", () => handleLogout());

  els.bootstrapCoreBtn.addEventListener("click", async () => {
    try {
      await bootstrapCoreState();
      toast("Noyau serveur initialise.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.reloadCoreBtn.addEventListener("click", async () => {
    try {
      await reloadCoreState();
      toast("Etat serveur recharge.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.advanceCoreCycleBtn.addEventListener("click", async () => {
    try {
      await advanceCoreCycle();
      toast("Cycle execute cote serveur.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.coreAquariumSelect.addEventListener("change", () => {
    selectedAquariumId = els.coreAquariumSelect.value;
    renderCoreState(currentCoreState);
  });

  els.serverShopCategory.addEventListener("change", () => {
    updateShopOptions();
    updateUi();
  });

  els.serverBuyBtn.addEventListener("click", async () => {
    try {
      await buyServerItem();
      toast("Achat execute cote serveur.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.applyTemperatureBtn.addEventListener("click", async () => {
    try {
      await applyAquariumSetting("temperature", els.serverTemperatureInput.value);
      toast("Temperature mise a jour cote serveur.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.applyLightBtn.addEventListener("click", async () => {
    try {
      await applyAquariumSetting("light", els.serverLightInput.value);
      toast("Lumiere mise a jour cote serveur.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.serverUseUtilityBtn.addEventListener("click", async () => {
    try {
      await useServerUtility();
      toast("Utilitaire applique cote serveur.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.serverToggleFishBtn.addEventListener("click", async () => {
    try {
      await toggleServerFish();
      toast("Placement poisson mis a jour cote serveur.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.serverTogglePlantBtn.addEventListener("click", async () => {
    try {
      await toggleServerPlant();
      toast("Placement plante mis a jour cote serveur.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.pullCloudBtn?.addEventListener("click", async () => {
    try {
      await loadRemoteSave();
      toast(currentRemoteSave ? "Sauvegarde cloud chargee." : "Aucune sauvegarde cloud pour ce compte.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.pushLocalBtn?.addEventListener("click", async () => {
    try {
      const localSave = getLocalSave();
      if (!localSave) {
        toast("Aucune sauvegarde locale detectee.");
        return;
      }
      await pushSaveToCloud(localSave);
      toast("Sauvegarde locale envoyee vers Supabase.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.writeBrowserBtn?.addEventListener("click", () => writeCloudSaveToBrowser());

  els.createDemoBtn?.addEventListener("click", async () => {
    try {
      const demoSave = createDemoSave();
      setJsonEditor(demoSave);
      renderSaveSummary(demoSave);
      await pushSaveToCloud(demoSave);
      toast("Sauvegarde demo creee dans le cloud.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.formatJsonBtn?.addEventListener("click", () => {
    try {
      const parsed = getJsonEditorValue();
      setJsonEditor(parsed);
      renderSaveSummary(parsed);
      toast("JSON formate.");
    } catch (error) {
      toast(`JSON invalide: ${error.message}`);
    }
  });

  els.saveJson?.addEventListener("change", async () => {
    try {
      const parsed = getJsonEditorValue();
      renderSaveSummary(parsed);
      await pushSaveToCloud(parsed);
      els.jsonStatus.textContent = "Le JSON a ete envoye vers Supabase.";
      toast("Sauvegarde cloud mise a jour.");
    } catch (error) {
      toast(error.message);
    }
  });

  [
    els.signupPlayerNameInput,
    els.signupEmailInput,
    els.signupBirthdayInput,
    els.signupPasswordInput,
    els.loginPlayerNameInput,
    els.loginPasswordInput,
  ].forEach((input) => {
    input?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }
      event.preventDefault();
      if (authBusy) {
        return;
      }
      handleLogin();
    });
  });
}

async function init() {
  renderSaveSummary(null);
  if (els.saveJson) {
    setJsonEditor({});
  }
  bindEvents();

  if (!isConfigured()) {
    updateUi();
    return;
  }

  const config = getSupabaseConfig();
  supabase = createClient(config.url, config.anonKey);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  currentSession = session;

  if (currentSession?.user) {
    if (isDevMode()) {
      await loadRemoteSave().catch(() => null);
    }
    await reloadCoreState().catch(() => bootstrapCoreState());
    scheduleAutoOpen();
  }

  updateUi();

  supabase.auth.onAuthStateChange(async (_event, session) => {
    currentSession = session;
    if (session?.user) {
      if (isDevMode()) {
        await loadRemoteSave().catch(() => null);
      }
      await reloadCoreState().catch(() => bootstrapCoreState());
      scheduleAutoOpen();
    } else {
      currentRemoteSave = null;
      currentCoreState = null;
      selectedAquariumId = "";
      renderSaveSummary(null);
      renderCoreState(null);
    }
    updateUi();
  });
}

init();
