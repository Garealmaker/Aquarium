const STORAGE_KEY = "aquariow-legacy-save";
const ONLINE_UI_CACHE_KEY = "aquariow-online-ui-cache";
const SAVE_SCHEMA_VERSION = 7;
const SAVE_RESET_NONCE = 1;
const MAX_OFFLINE_HOURS = 48;
const GAME_CONTENT = window.GAME_CONTENT || {};
const SPECIES = GAME_CONTENT.species || [];
const PLANT_SPECIES = GAME_CONTENT.plants || [];
const SHOP_ITEMS = GAME_CONTENT.shopItems || [];
const COMMUNITY_PLAYERS = GAME_CONTENT.communityPlayers || [];
const EVENTS = GAME_CONTENT.events || [];
const MISSION_POOL = GAME_CONTENT.missionPool || [];
const MISSION_TRACKERS = GAME_CONTENT.missionTrackers || [];
const FISH_NAME_PARTS = GAME_CONTENT.fishNames || { prefixes: [], suffixes: [], babies: [] };
const DEFAULT_FISH_SPRITE = {
  file: "./assets/fish/coral-clown.png",
  w: 175,
  h: 111,
  tailSplit: 73,
  tailJoint: 68,
  displayHeight: 32,
  direction: -1,
};
const DEFAULT_PLANT_SPRITE = {
  file: "./assets/plants/anubia-bronze.png",
  w: 97,
  h: 181,
  displayHeight: 82,
  rootCut: 20,
  swayAngle: 3,
  swayDuration: 6.5,
};
const DEPTH_FRONT = 1;
const DEPTH_MID = 2;
const DEPTH_BACK = 3;
const ALLOWED_PLANT_DEPTHS = [DEPTH_FRONT, DEPTH_MID];
const MAX_AQUARIUMS = 4;
const CYCLE_MINUTES = 120;
const CYCLE_REFRESH_MS = 4 * 60 * 60 * 1000;
const CYCLE_ADVANCE_PEARL_COST = 3;
const CYCLE_STEP_HOURS = 24;
const ONBOARDING_REWARD_COINS = 200;
const ONBOARDING_REWARD_PEARLS = 10;
const ONBOARDING_FINAL_STEP = 13;
const HIDDEN_VITALITY_POINTS = 10;
const HIDDEN_VITALITY_STEP = 100 / HIDDEN_VITALITY_POINTS;
const HIDDEN_VITALITY_RECOVERY_PER_HOUR = 100 / (CYCLE_STEP_HOURS * 2);
const CYCLE_COSTS = {
  cleanLight: 16,
  cleanDeep: 24,
  oxygenate: 6,
  temperatureStep: 5,
  lightStep: 5,
  co2Step: 5,
  phStep: 5,
  serviceFilter: 14,
  upgradeFilter: 20,
  placePlant: 10,
  movePlant: 5,
  returnPlant: 10,
  breedAttempt: 25,
  speedCompetition: 40,
  reflexCompetition: 20,
  beautyContest: 10,
};
const DEFAULT_AQUARIUM_STATS = {
  waterQuality: 84,
  pollution: 16,
  temperature: 24,
  temperatureTarget: 24,
  lightHours: 2,
  lampLevel: 1,
  co2Level: 2,
  co2DeviceLevel: 1,
  phLevel: 7,
  oxygenLevel: 76,
  stability: 72,
  filterLevel: 1,
  filterCondition: 82,
  foodResidue: 0,
  diseasePressure: 8,
  visitors: 0,
};
const els = {
  playerName: document.getElementById("player-name"),
  coinsValue: document.getElementById("coins-value"),
  pearlsValue: document.getElementById("pearls-value"),
  levelValue: document.getElementById("level-value"),
  waterValue: document.getElementById("water-value"),
  comfortValue: document.getElementById("comfort-value"),
  temperatureValue: document.getElementById("temperature-value"),
  co2BalanceValue: document.getElementById("co2-balance-value"),
  oxygenBalanceValue: document.getElementById("oxygen-balance-value"),
  phValue: document.getElementById("ph-value"),
  xpLabel: document.getElementById("xp-label"),
  xpBar: document.getElementById("xp-bar"),
  cycleNumberValue: document.getElementById("cycle-number-value"),
  cycleMinutesValue: document.getElementById("cycle-minutes-value"),
  cycleTimerValue: document.getElementById("cycle-timer-value"),
  advanceCycleBtn: document.getElementById("advance-cycle-btn"),
  dailyRewardBtn: document.getElementById("daily-reward-btn"),
  aquariumName: document.getElementById("aquarium-name"),
  aquariumSwitcher: document.getElementById("aquarium-switcher"),
  missionList: document.getElementById("mission-list"),
  fishList: document.getElementById("fish-list"),
  plantList: document.getElementById("plant-list"),
  inventoryFishList: document.getElementById("inventory-fish-list"),
  inventoryPlantList: document.getElementById("inventory-plant-list"),
  inventoryUtilityList: document.getElementById("inventory-utility-list"),
  inventoryDecorList: document.getElementById("inventory-decor-list"),
  fishLayer: document.getElementById("fish-layer"),
  aquariumStage: document.getElementById("aquarium-stage"),
  aquariumCapacityLabel: document.getElementById("aquarium-capacity-label"),
  decorBackLayer: document.getElementById("decor-back-layer"),
  decorMidLayer: document.getElementById("decor-mid-layer"),
  decorFrontLayer: document.getElementById("decor-front-layer"),
  foodLayer: document.getElementById("food-layer"),
  bubbleBackLayer: document.getElementById("bubble-back-layer"),
  bubbleMidLayer: document.getElementById("bubble-mid-layer"),
  bubbleFrontLayer: document.getElementById("bubble-front-layer"),
  placementPanel: document.getElementById("placement-panel"),
  placementList: document.getElementById("placement-list"),
  placementDepths: Array.from(document.querySelectorAll("[data-depth]")),
  placementCursor: document.getElementById("placement-cursor"),
  placementCancelBtn: document.getElementById("placement-cancel-btn"),
  sceneHint: document.getElementById("scene-hint"),
  tankStateTag: document.getElementById("tank-state-tag"),
  shopFishList: document.getElementById("shop-fish-list"),
  shopPlantList: document.getElementById("shop-plant-list"),
  shopUtilityList: document.getElementById("shop-utility-list"),
  shopDecorList: document.getElementById("shop-decor-list"),
  feedAllBtn: document.getElementById("feed-all-btn"),
  cleanBtn: document.getElementById("clean-btn"),
  tempSlider: document.getElementById("temp-slider"),
  tempSliderValue: document.getElementById("temp-slider-value"),
  tempSliderMin: document.getElementById("temp-slider-min"),
  tempSliderMax: document.getElementById("temp-slider-max"),
  lightSlider: document.getElementById("light-slider"),
  lightSliderValue: document.getElementById("light-slider-value"),
  lightSliderMin: document.getElementById("light-slider-min"),
  lightSliderMax: document.getElementById("light-slider-max"),
  decorateBtn: document.getElementById("decorate-btn"),
  breedBtn: document.getElementById("breed-btn"),
  renameBtn: document.getElementById("rename-btn"),
  renameAquariumBtn: document.getElementById("rename-aquarium-btn"),
  onlineLogoutBtn: document.getElementById("online-logout-btn"),
  onboardingOverlay: document.getElementById("onboarding-overlay"),
  onboardingCard: document.getElementById("onboarding-card"),
  onboardingProgress: document.getElementById("onboarding-progress"),
  onboardingTitle: document.getElementById("onboarding-title"),
  onboardingText: document.getElementById("onboarding-text"),
  onboardingStartBtn: document.getElementById("onboarding-start-btn"),
  onboardingCloseBtn: document.getElementById("onboarding-close-btn"),
  tabs: Array.from(document.querySelectorAll(".tab")),
  panels: Array.from(document.querySelectorAll(".tab-panel")),
  tankTabs: Array.from(document.querySelectorAll(".tank-tab")),
  tankPanels: Array.from(document.querySelectorAll(".tank-subpanel")),
  inventoryTabs: Array.from(document.querySelectorAll(".inventory-tab")),
  inventoryPanels: Array.from(document.querySelectorAll(".inventory-subpanel")),
  shopTabs: Array.from(document.querySelectorAll(".shop-tab")),
  shopPanels: Array.from(document.querySelectorAll(".shop-subpanel")),
  fishTemplate: document.getElementById("fish-card-template"),
};

let state = loadState();
syncSelectedAquariumState(state);
const initialOnlineUiCache = isOnlineAuthoritativeMode() ? loadOnlineUiCache() : {};
const runtime = {
  placementMode: false,
  selectedPlacementKey: null,
  movingPlantId: null,
  selectedDepth: DEPTH_MID,
  fishActors: new Map(),
  foodParticles: [],
  bubbleActors: [],
  bubbleSceneKey: "",
  animationFrameId: 0,
  lastTick: 0,
  cursorX: Math.round(window.innerWidth * 0.68),
  cursorY: Math.round(window.innerHeight * 0.22),
  tankTab: initialOnlineUiCache.tankTab || "overview",
  inventoryTab: initialOnlineUiCache.inventoryTab || "fish",
  shopTab: initialOnlineUiCache.shopTab || "fish",
  lastServerActionSucceeded: false,
  onlineCoreReady: !isOnlineAuthoritativeMode(),
};

function getOnlineBridge() {
  try {
    if (window.parent && window.parent !== window && window.parent.AQUARIOW_ONLINE_BRIDGE?.isEnabled) {
      return window.parent.AQUARIOW_ONLINE_BRIDGE;
    }
  } catch (_error) {
    return null;
  }
  return null;
}

function isOnlineAuthoritativeMode() {
  return Boolean(getOnlineBridge());
}

function renderOnlineSessionButton() {
  if (!els.onlineLogoutBtn) {
    return;
  }
  els.onlineLogoutBtn.hidden = !isOnlineAuthoritativeMode();
}

function isOnlineCoreReady() {
  return !isOnlineAuthoritativeMode() || runtime.onlineCoreReady;
}

function restoreOnlineUiCache() {
  if (!isOnlineAuthoritativeMode()) {
    return;
  }

  const primaryTab = initialOnlineUiCache.primaryTab;
  if (typeof primaryTab === "string" && primaryTab) {
    setActivePrimaryTab(primaryTab);
  }
}

function getOnboardingState() {
  return state.onboardingState || {
    step: ONBOARDING_FINAL_STEP,
    completed: true,
    rewardClaimed: true,
  };
}

function getOnboardingDefinition(step = getOnboardingState().step) {
  const definitions = {
    0: {
      progress: "Tutoriel",
      title: "Bienvenue dans ton premier aquarium",
      text: "On va lancer ton bac ensemble. Commence par installer un meilleur diffuseur CO2, puis suis chaque etape pour equilibrer ton premier ecosysteme.",
      actionLabel: "Commencer",
    },
    1: {
      progress: "Etape 1 / 10",
      title: "Ameliore le diffuseur CO2",
      text: "Ouvre Boutique > Utilitaires et achete le Diffuseur CO2 II. Cet achat est offert pour ton tutoriel.",
      tab: "shop",
      shopTab: "utility",
    },
    2: {
      progress: "Etape 2 / 11",
      title: "Achete tes 2 premieres plantes",
      text: "Passe dans Boutique > Plantes et prends 2 plantes. Les deux premieres sont offertes pendant le tutoriel.",
      tab: "shop",
      shopTab: "plants",
    },
    3: {
      progress: "Etape 3 / 11",
      title: "Plante tes nouvelles pousses",
      text: "Passe en mode plantation dans l'aquarium et place tes 2 plantes dans le bac.",
      tab: "aquarium",
      tankTab: "overview",
    },
    4: {
      progress: "Etape 4 / 11",
      title: "Regle la luminosite",
      text: "Reviens sur Aquarium et regle l'eclairage a 4 h pour aider tes plantes a bien demarrer.",
      tab: "aquarium",
      tankTab: "overview",
    },
    5: {
      progress: "Etape 5 / 11",
      title: "Adopte ton premier poisson",
      text: "Va dans Boutique > Poissons et adopte ton premier compagnon.",
      tab: "shop",
      shopTab: "fish",
    },
    6: {
      progress: "Etape 6 / 11",
      title: "Achete de la nourriture",
      text: "Passe dans Boutique > Utilitaires et prends un pack de Granules marines. Ce premier achat est offert.",
      tab: "shop",
      shopTab: "utility",
    },
    7: {
      progress: "Etape 7 / 11",
      title: "Premier nourrissage",
      text: "Retourne sur Aquarium et nourris ton poisson depuis Gestion du bac.",
      tab: "aquarium",
      tankTab: "overview",
    },
    8: {
      progress: "Etape 8 / 11",
      title: "Passe le premier cycle",
      text: "Lance ton premier cycle. Il est gratuit exceptionnellement, et le pH du bac baissera de 1 pour te montrer l'effet du cycle.",
      tab: "aquarium",
      tankTab: "overview",
    },
    9: {
      progress: "Etape 9 / 11",
      title: "Nettoie le bac",
      text: "Utilise maintenant Nettoyer pour remettre ton aquarium au propre apres ce premier cycle.",
      tab: "aquarium",
      tankTab: "overview",
    },
    10: {
      progress: "Etape 10 / 11",
      title: "Achete les pastilles pH",
      text: "Retourne dans Boutique > Utilitaires et achete un pack de pH+ puis un pack de pH-. Ces deux achats sont offerts pendant le tutoriel.",
      tab: "shop",
      shopTab: "utility",
    },
    11: {
      progress: "Etape 11 / 11",
      title: "Remonte le pH",
      text: "Va dans Inventaire > Utilitaires et utilise une pastille pH+. Exceptionnellement, elle fixera le pH a 7,1 exactement.",
      tab: "aquarium",
      tankTab: "inventory",
      inventoryTab: "utility",
    },
    12: {
      progress: "Tutoriel termine",
      title: "Ton pack de lancement est pret",
      text: `200 coquillages et 10 perles viennent d'etre ajoutes a ton compte. Clique sur la petite croix pour fermer cette fenetre et commencer librement.`,
      closeOnly: true,
    },
  };

  return definitions[step] || null;
}

function setActivePrimaryTab(tabName) {
  if (!tabName) {
    return;
  }
  const targetTab = els.tabs.find((tab) => tab.dataset.tab === tabName);
  const targetPanel = els.panels.find((panel) => panel.dataset.panel === tabName);
  if (!targetTab || !targetPanel) {
    return;
  }
  els.tabs.forEach((item) => item.classList.remove("active"));
  els.panels.forEach((panel) => panel.classList.remove("active"));
  targetTab.classList.add("active");
  targetPanel.classList.add("active");
}

function focusOnboardingStep(definition) {
  if (!definition) {
    return;
  }
  setActivePrimaryTab(definition.tab || "aquarium");
  if (definition.tankTab) {
    runtime.tankTab = definition.tankTab;
    renderTankTabs();
  }
  if (definition.inventoryTab) {
    runtime.inventoryTab = definition.inventoryTab;
    renderInventoryTabs();
  }
  if (definition.shopTab) {
    runtime.shopTab = definition.shopTab;
    renderShopTabs();
  }
}

function updateOnboardingPosition() {
  if (!els.onboardingCard || !els.onboardingOverlay || els.onboardingOverlay.hidden) {
    return;
  }

  const rect = els.onboardingCard.getBoundingClientRect();
  const cardWidth = Math.min(520, Math.max(320, rect.width || window.innerWidth - 32));
  const cardHeight = Math.max(180, rect.height || 240);
  const offsetX = 26;
  const offsetY = 20;
  const maxLeft = Math.max(16, window.innerWidth - cardWidth - 16);
  const maxTop = Math.max(16, window.innerHeight - cardHeight - 16);
  const preferredLeft = runtime.cursorX + offsetX;
  const fallbackLeft = runtime.cursorX - cardWidth - offsetX;
  const left = preferredLeft <= maxLeft ? preferredLeft : Math.max(16, fallbackLeft);
  const top = clamp(runtime.cursorY + offsetY, 16, maxTop);

  els.onboardingCard.style.left = `${left}px`;
  els.onboardingCard.style.top = `${top}px`;
}

function getOwnedPlantTotalForOnboarding() {
  if (isOnlineAuthoritativeMode()) {
    return (Array.isArray(state.serverInventoryPlants) ? state.serverInventoryPlants.length : 0) + state.plantsPlaced.length;
  }
  return getGroupedInventoryPlants().reduce((sum, entry) => sum + entry.count, 0) + state.plantsPlaced.length;
}

function getOwnedFishTotalForOnboarding() {
  if (isOnlineAuthoritativeMode()) {
    return (Array.isArray(state.serverInventoryFish) ? state.serverInventoryFish.length : 0) + state.fish.length;
  }
  return state.fish.length;
}

async function syncOnboardingState(step, options = {}) {
  const normalizedStep = Math.max(0, Math.min(ONBOARDING_FINAL_STEP, Math.round(numericOr(step, 0))));
  const bridge = getOnlineBridge();
  if (bridge?.updateOnboardingState) {
    try {
      const coreState = await bridge.updateOnboardingState(
        normalizedStep,
        options.completed ?? null,
        options.rewardClaimed ?? null
      );
      if (applyServerCoreState(coreState)) {
        saveState();
        render();
      }
      return true;
    } catch (error) {
      console.error("Mise a jour du tutoriel impossible", error);
      toast(error.message || "Impossible de mettre a jour le tutoriel.");
      return false;
    }
  }

  state.onboardingState = {
    step: Math.max(getOnboardingState().step, normalizedStep),
    completed: options.completed ?? getOnboardingState().completed,
    rewardClaimed: options.rewardClaimed ?? getOnboardingState().rewardClaimed,
  };
  saveState();
  render();
  return true;
}

async function advanceOnboardingTo(nextStep) {
  const tutorial = getOnboardingState();
  if (tutorial.completed || nextStep <= tutorial.step) {
    return false;
  }
  return syncOnboardingState(nextStep);
}

async function grantOnboardingReward() {
  const tutorial = getOnboardingState();
  if (tutorial.rewardClaimed) {
    return false;
  }
  const bridge = getOnlineBridge();
  if (bridge?.claimOnboardingReward) {
    try {
      const coreState = await bridge.claimOnboardingReward();
      if (applyServerCoreState(coreState)) {
        saveState();
        render();
      }
      return true;
    } catch (error) {
      console.error("Recompense tutoriel impossible", error);
      toast(error.message || "Impossible de recuperer la recompense du tutoriel.");
      return false;
    }
  }

  state.coins += ONBOARDING_REWARD_COINS;
  state.pearls += ONBOARDING_REWARD_PEARLS;
  state.onboardingState = {
    step: 12,
    completed: false,
    rewardClaimed: true,
  };
  saveState();
  render();
  return true;
}

async function closeOnboardingReward() {
  const tutorial = getOnboardingState();
  if (!tutorial.rewardClaimed) {
    return;
  }
  await syncOnboardingState(ONBOARDING_FINAL_STEP, {
    completed: true,
    rewardClaimed: true,
  });
}

function renderOnboarding() {
  if (!els.onboardingOverlay || !els.onboardingTitle || !els.onboardingText || !els.onboardingProgress) {
    return;
  }

  const tutorial = getOnboardingState();
  const definition = getOnboardingDefinition(tutorial.step);
  const visible =
    isOnlineAuthoritativeMode() &&
    isOnlineCoreReady() &&
    !tutorial.completed &&
    tutorial.step < ONBOARDING_FINAL_STEP &&
    Boolean(definition);

  els.onboardingOverlay.hidden = !visible;
  if (!visible || !definition) {
    return;
  }

  focusOnboardingStep(definition);
  els.onboardingProgress.textContent = definition.progress;
  els.onboardingTitle.textContent = definition.title;
  els.onboardingText.textContent = definition.text;
  if (els.onboardingStartBtn) {
    els.onboardingStartBtn.hidden = !definition.actionLabel;
    els.onboardingStartBtn.textContent = definition.actionLabel || "Continuer";
  }
  if (els.onboardingCloseBtn) {
    els.onboardingCloseBtn.hidden = !definition.closeOnly;
  }
  updateOnboardingPosition();
}

function isOnboardingShopItemFree(item) {
  const tutorial = getOnboardingState();
  if (tutorial.completed || !item) {
    return false;
  }
  if (tutorial.step === 1 && item.id === "co2-upgrade-2") {
    return true;
  }
  if (tutorial.step === 2 && item.type === "plant" && getOwnedPlantTotalForOnboarding() < 2) {
    return true;
  }
  if (tutorial.step === 6 && item.id === "food-pack") {
    return state.inventory.food <= 0;
  }
  if (tutorial.step === 10 && item.id === "ph-up-tabs" && state.inventory.phUpTablets <= 0) {
    return true;
  }
  if (tutorial.step === 10 && item.id === "ph-down-tabs" && state.inventory.phDownTablets <= 0) {
    return true;
  }
  return false;
}

async function handleOnboardingAfterShopItem(item) {
  const tutorial = getOnboardingState();
  if (tutorial.completed || !item) {
    return;
  }

  if (tutorial.step === 1 && item.type === "co2" && numericOr(state.aquarium.co2DeviceLevel, 1) >= 2) {
    await advanceOnboardingTo(2);
    return;
  }

  if (tutorial.step === 2 && item.type === "plant" && getOwnedPlantTotalForOnboarding() >= 2) {
    await advanceOnboardingTo(3);
    return;
  }

  if (tutorial.step === 6 && item.type === "food" && state.inventory.food > 0) {
    await advanceOnboardingTo(7);
    return;
  }

  if (tutorial.step === 10 && state.inventory.phUpTablets > 0 && state.inventory.phDownTablets > 0) {
    await advanceOnboardingTo(11);
  }
}

function getServerUtilityQuantity(coreState, itemKey) {
  const utilities = Array.isArray(coreState?.inventory?.utilities) ? coreState.inventory.utilities : [];
  const entry = utilities.find((utility) => utility.item_key === itemKey);
  return Math.max(0, Math.round(numericOr(entry?.quantity, 0)));
}

function getServerInventoryFish(coreState) {
  return Array.isArray(coreState?.inventory?.fish) ? coreState.inventory.fish : [];
}

function getServerInventoryPlants(coreState) {
  return Array.isArray(coreState?.inventory?.plants) ? coreState.inventory.plants : [];
}

function getServerLongevityPercent(cyclesLeft, maxCycles) {
  const totalCycles = Math.max(1, numericOr(maxCycles, 30));
  return clamp((numericOr(cyclesLeft, totalCycles) / totalCycles) * 100, 0, 100);
}

function applyServerCoreState(coreState) {
  if (!coreState?.profile) {
    return false;
  }

  const previousState = state;
  const previousBundles = new Map((previousState.aquariums || []).map((bundle) => [bundle.id, bundle]));
  const nextAquariums = (Array.isArray(coreState.aquariums) ? coreState.aquariums : []).map((serverAquarium) => {
    const previousBundle = previousBundles.get(serverAquarium.id);
    const previousFishMap = new Map((previousBundle?.fish || []).map((entry) => [entry.id, entry]));
    const previousPlantMap = new Map((previousBundle?.plantsPlaced || []).map((entry) => [entry.id, entry]));

    const nextFish = (serverAquarium.fish || []).map((serverFish) => {
      const existing = previousFishMap.get(serverFish.id);
      return createFish(serverFish.species_id, {
        ...existing,
        id: serverFish.id,
        nickname: serverFish.nickname,
        hunger: numericOr(serverFish.hunger, existing?.hunger ?? 82),
        vitality: clamp(numericOr(serverFish.vitality_points, 10) * HIDDEN_VITALITY_STEP, 0, 100),
        goodCycleStreak: Math.max(0, Math.round(numericOr(serverFish.good_cycle_streak, existing?.goodCycleStreak ?? 0))),
        longevity: getServerLongevityPercent(
          serverFish.longevity_cycles_left,
          getFishLifespanCycles({ speciesId: serverFish.species_id })
        ),
        comfort: numericOr(existing?.comfort, 72),
        growth: numericOr(existing?.growth, 0),
        speedSkill: numericOr(existing?.speedSkill, 18),
        reflexSkill: numericOr(existing?.reflexSkill, 56),
        addedAt: numericOr(existing?.addedAt, Date.now()),
      });
    });

    const nextPlantsPlaced = (serverAquarium.plants || []).map((serverPlant, index) => {
      const existing = previousPlantMap.get(serverPlant.id);
      const depth = normalizePlantDepth(serverPlant.depth);
      return {
        ...(existing || createPlacedPlant(serverPlant.species_id, 18 + (index % 4) * 18, getPlantSoilY(depth), depth)),
        id: serverPlant.id,
        speciesId: serverPlant.species_id,
        nickname: serverPlant.nickname,
        x: clamp(numericOr(serverPlant.x_percent, existing?.x ?? 18 + (index % 4) * 18), 6, 94),
        y: getPlantSoilY(depth),
        depth,
        vitality: clamp(numericOr(serverPlant.vitality_points, 10) * HIDDEN_VITALITY_STEP, 0, 100),
        goodCycleStreak: Math.max(0, Math.round(numericOr(serverPlant.good_cycle_streak, existing?.goodCycleStreak ?? 0))),
        longevity: getServerLongevityPercent(
          serverPlant.longevity_cycles_left,
          getPlantLifespanCycles({ speciesId: serverPlant.species_id })
        ),
        placedAt: numericOr(existing?.placedAt, Date.now()),
      };
    });

    const nextFryBatches = normalizeFryBatches(
      Array.isArray(serverAquarium.fry_batches)
        ? serverAquarium.fry_batches.map((batch) => ({
            id: batch.id,
            speciesId: batch.species_id,
            count: Math.max(1, Math.round(numericOr(batch.count, 1))),
            cyclesRemaining: Math.max(1, Math.round(numericOr(batch.cycles_remaining, 1))),
            createdAt: numericOr(Date.parse(batch.created_at || ""), Date.now()),
          }))
        : previousBundle?.fryBatches || []
    );

    return createAquariumBundle({
      id: serverAquarium.id,
      slotIndex: serverAquarium.slot_index,
      name: serverAquarium.name,
      aquarium: {
        ...(previousBundle?.aquarium || DEFAULT_AQUARIUM_STATS),
        waterQuality: numericOr(serverAquarium.water_quality, 84),
        pollution: clamp(100 - numericOr(serverAquarium.water_quality, 84), 0, 100),
        temperature: numericOr(serverAquarium.temperature_target, 24),
        temperatureTarget: numericOr(serverAquarium.temperature_target, 24),
        lightHours: Math.round(numericOr(serverAquarium.light_hours, 2)),
        lampLevel: Math.round(numericOr(serverAquarium.lamp_level, 1)),
        co2Level: numericOr(serverAquarium.co2_level, 4),
        co2DeviceLevel: Math.round(numericOr(serverAquarium.diffuser_level, 1)),
        phLevel: numericOr(serverAquarium.ph_level, 7),
        filterLevel: Math.round(numericOr(serverAquarium.filter_level, 1)),
        feedUsesThisCycle: Math.round(numericOr(serverAquarium.feed_uses_this_cycle, 0)),
      },
      fish: nextFish,
      plantsPlaced: nextPlantsPlaced,
      fryBatches: nextFryBatches,
      lastUpdatedAt: Date.now(),
    });
  });

  const selectedServerAquarium =
    (Array.isArray(coreState.aquariums) ? coreState.aquariums : []).find(
      (entry) => entry.id === previousState.selectedAquariumId
    ) || coreState.aquariums?.[0];
  const sharedCycleAquarium = coreState.aquariums?.[0] || selectedServerAquarium;

  state = {
    ...previousState,
    playerName: coreState.profile.player_name || previousState.playerName,
    coins: numericOr(coreState.profile.coins, previousState.coins),
    pearls: numericOr(coreState.profile.pearls, previousState.pearls),
    level: Math.max(1, Math.round(numericOr(coreState.profile.level, previousState.level))),
    xp: Math.max(0, Math.round(numericOr(coreState.profile.xp, previousState.xp))),
    inventory: {
      ...previousState.inventory,
      food: getServerUtilityQuantity(coreState, "food"),
      waterKits: getServerUtilityQuantity(coreState, "water"),
      phUpTablets: getServerUtilityQuantity(coreState, "ph-up"),
      phDownTablets: getServerUtilityQuantity(coreState, "ph-down"),
      plantsOwned: getServerInventoryPlants(coreState).map((plant) => plant.species_id),
    },
    serverInventoryFish: getServerInventoryFish(coreState),
    serverInventoryPlants: getServerInventoryPlants(coreState),
    aquariums: nextAquariums.length ? nextAquariums : previousState.aquariums,
    selectedAquariumId: selectedServerAquarium?.id || previousState.selectedAquariumId,
    cycleState: {
      ...previousState.cycleState,
      cycleNumber: Math.max(1, Math.round(numericOr(sharedCycleAquarium?.cycle_number, previousState.cycleState.cycleNumber))),
      minutesRemaining: clamp(
        Math.round(numericOr(sharedCycleAquarium?.minutes_remaining, previousState.cycleState.minutesRemaining)),
        0,
        CYCLE_MINUTES
      ),
      lastAutoCycleAt: numericOr(
        Date.parse(sharedCycleAquarium?.last_auto_cycle_at || ""),
        previousState.cycleState.lastAutoCycleAt
      ),
    },
    missionState: coreState.mission_state
      ? {
          ...previousState.missionState,
          dateKey: coreState.mission_state.dateKey || previousState.missionState.dateKey,
          selectedIds: Array.isArray(coreState.mission_state.selectedIds)
            ? coreState.mission_state.selectedIds
            : previousState.missionState.selectedIds,
          entries: Array.isArray(coreState.mission_state.entries)
            ? coreState.mission_state.entries
            : previousState.missionState.entries,
          trackers: coreState.mission_state.trackers || previousState.missionState.trackers,
        }
      : previousState.missionState,
    competitionState: coreState.competition_state
      ? {
          ...previousState.competitionState,
          weeklyContestEntries: coreState.competition_state.weeklyContestEntries || previousState.competitionState.weeklyContestEntries,
          history: Array.isArray(coreState.competition_state.history)
            ? coreState.competition_state.history
            : previousState.competitionState.history,
        }
      : previousState.competitionState,
    communityFeed: Array.isArray(coreState.community_feed)
      ? coreState.community_feed.map((entry) => ({
          author: entry.author || "Port communautaire",
          message: entry.message || "",
          when: entry.when || "Maintenant",
        }))
      : previousState.communityFeed,
    logs: Array.isArray(coreState.logs)
      ? coreState.logs.map((entry) => ({
          message: entry.message || "",
          when: entry.when || "Maintenant",
        }))
      : previousState.logs,
    lastRewardAt: coreState.profile.last_reward_at
      ? Date.parse(`${coreState.profile.last_reward_at}T00:00:00`)
      : previousState.lastRewardAt,
    onboardingState: {
      ...previousState.onboardingState,
      step: Math.max(0, Math.round(numericOr(coreState.profile.onboarding_step, previousState.onboardingState?.step ?? ONBOARDING_FINAL_STEP))),
      completed: Boolean(
        coreState.profile.onboarding_completed ?? previousState.onboardingState?.completed ?? true
      ),
      rewardClaimed: Boolean(
        coreState.profile.onboarding_reward_claimed ?? previousState.onboardingState?.rewardClaimed ?? true
      ),
    },
  };

  syncSelectedAquariumState(state);
  state.lastUpdatedAt = Date.now();
  runtime.onlineCoreReady = true;
  return true;
}

let profileSyncPromise = Promise.resolve();

function queueOnlineProfileSnapshotSync() {
  const bridge = getOnlineBridge();
  if (!bridge) {
    return Promise.resolve();
  }

  const snapshot = {
    playerName: state.playerName,
    coins: state.coins,
    pearls: state.pearls,
    level: state.level,
    xp: state.xp,
    aquariumId: state.selectedAquariumId,
    aquariumName: state.aquariumName,
  };

  profileSyncPromise = profileSyncPromise
    .catch(() => {})
    .then(() =>
      bridge.syncProfileSnapshot({
        playerName: snapshot.playerName,
        coins: snapshot.coins,
        pearls: snapshot.pearls,
        level: snapshot.level,
        xp: snapshot.xp,
        aquariumId: snapshot.aquariumId,
        aquariumName: snapshot.aquariumName,
      })
    )
    .catch((error) => {
      console.error("Echec de sync profil serveur", error);
    });

  return profileSyncPromise;
}

async function flushOnlineProfileSnapshotSync() {
  if (!isOnlineAuthoritativeMode()) {
    return;
  }
  try {
    await profileSyncPromise;
  } catch (_error) {
    // The error is already logged where the sync is scheduled.
  }
}

async function refreshOnlineAuthoritativeState(options = {}) {
  const bridge = getOnlineBridge();
  if (!bridge) {
    return false;
  }

  try {
    const coreState = await bridge.getCoreState();
    if (!applyServerCoreState(coreState)) {
      return false;
    }
    clearFoodParticles();
    createBubbleLayers();
    saveState();
    return true;
  } catch (error) {
    runtime.onlineCoreReady = false;
    console.error("Echec de rechargement serveur", error);
    if (!options.silent) {
      toast(error.message || "Synchronisation serveur impossible.");
    }
    return false;
  }
}

async function runServerBridgeAction(executor, successMessage, options = {}) {
  const bridge = getOnlineBridge();
  runtime.lastServerActionSucceeded = false;
  if (!bridge) {
    return false;
  }

  try {
    await flushOnlineProfileSnapshotSync();
    const coreState = await executor(bridge);
    if (!applyServerCoreState(coreState)) {
      return false;
    }
    clearFoodParticles();
    createBubbleLayers();
    saveState();
    render();
    if (options.spawnFood) {
      spawnFoodParticles(options.spawnFood);
    }
    if (successMessage) {
      toast(successMessage);
    }
    runtime.lastServerActionSucceeded = true;
    return true;
  } catch (error) {
    console.error("Action serveur impossible", error);
    toast(error.message || "Action serveur impossible.");
    runtime.lastServerActionSucceeded = false;
    return true;
  }
}

function createFish(speciesId, overrides = {}) {
  const species = SPECIES.find((entry) => entry.id === speciesId) || SPECIES[0];
  const now = overrides.addedAt || Date.now();
  const adultSizeCm = numericOr(species?.adultSizeCm, 8);
  return {
    id: overrides.id || `fish-${now}-${Math.random().toString(16).slice(2, 8)}`,
    speciesId,
    nickname: overrides.nickname || generateFishName(),
    ageHours: overrides.ageHours ?? 0,
    hunger: overrides.hunger ?? 82,
    comfort: overrides.comfort ?? 72,
    vitality: overrides.vitality ?? 100,
    goodCycleStreak: Math.max(0, Math.round(numericOr(overrides.goodCycleStreak, 0))),
    newcomerHours: overrides.newcomerHours ?? 18,
    badConditionHours: overrides.badConditionHours ?? 0,
    growth: overrides.growth ?? 0,
    speedSkill: overrides.speedSkill ?? clamp(Math.round(18 + adultSizeCm * 2), 5, 95),
    reflexSkill: overrides.reflexSkill ?? clamp(Math.round(56 - adultSizeCm * 1.4), 5, 95),
    longevity: overrides.longevity ?? 100,
    lastCompetitionDateKey: overrides.lastCompetitionDateKey || "",
    addedAt: now,
  };
}

function createPlacedPlant(speciesId, x, y, depth = DEPTH_MID) {
  const placementDepth = normalizePlantDepth(depth);
  return {
    id: `plant-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    speciesId,
    nickname: getPlantSpecies(speciesId)?.species || speciesId,
    x,
    y: getPlantSoilY(placementDepth),
    depth: placementDepth,
    vitality: 100,
    goodCycleStreak: 0,
    longevity: 100,
    badConditionHours: 0,
    lastCompetitionDateKey: "",
    placedAt: Date.now(),
  };
}

function normalizeFryBatches(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry) => ({
      id: entry.id || `fry-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      speciesId: entry.speciesId,
      count: Math.max(1, Math.round(numericOr(entry.count, 1))),
      cyclesRemaining: Math.max(1, Math.round(numericOr(entry.cyclesRemaining, 2))),
      createdAt: numericOr(entry.createdAt, Date.now()),
    }))
    .filter((entry) => SPECIES.some((species) => species.id === entry.speciesId));
}

function normalizeSceneDepth(depth, sourceVersion = SAVE_SCHEMA_VERSION) {
  const numericDepth = Number(depth);
  if (!Number.isFinite(numericDepth)) {
    return DEPTH_MID;
  }
  if (sourceVersion < 3) {
    return clamp(3 - Math.round(numericDepth), DEPTH_FRONT, DEPTH_BACK);
  }
  return clamp(Math.round(numericDepth), DEPTH_FRONT, DEPTH_BACK);
}

function normalizePlacedPlants(raw, sourceVersion = SAVE_SCHEMA_VERSION) {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry, index) => {
      if (!entry || typeof entry !== "object" || !entry.speciesId) {
        return null;
      }
      const placementDepth = normalizePlantDepth(normalizeSceneDepth(entry.depth, sourceVersion));
      return {
        id: entry.id || `plant-${index}-${entry.speciesId}`,
        speciesId: entry.speciesId,
        nickname: entry.nickname || getPlantSpecies(entry.speciesId)?.species || entry.speciesId,
        x: clamp(numericOr(entry.x, 50), 6, 94),
        depth: placementDepth,
        y: getPlantSoilY(placementDepth),
        vitality: clamp(numericOr(entry.vitality, 100), 0, 100),
        goodCycleStreak: Math.max(0, Math.round(numericOr(entry.goodCycleStreak, 0))),
        longevity: clamp(numericOr(entry.longevity, 100), 0, 100),
        badConditionHours: Math.max(numericOr(entry.badConditionHours, 0), 0),
        lastCompetitionDateKey: entry.lastCompetitionDateKey || "",
        placedAt: entry.placedAt || Date.now(),
      };
    })
    .filter(Boolean);
}

function normalizeFishState(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object" || !entry.speciesId) {
        return null;
      }
      const species = SPECIES.find((candidate) => candidate.id === entry.speciesId) || SPECIES[0];
      const adultSizeCm = numericOr(species?.adultSizeCm, 8);

      return createFish(entry.speciesId, {
        id: entry.id,
        nickname: entry.nickname,
        ageHours: numericOr(entry.ageHours, 0),
        hunger: clamp(numericOr(entry.hunger, 82), 0, 100),
        comfort: clamp(
          numericOr(
            entry.comfort,
            entry.stress !== undefined && entry.stress !== null ? 100 - numericOr(entry.stress, 18) : 72
        ),
        0,
        100
      ),
      vitality: clamp(numericOr(entry.vitality, 100), 0, 100),
        goodCycleStreak: Math.max(0, Math.round(numericOr(entry.goodCycleStreak, 0))),
        newcomerHours: Math.max(numericOr(entry.newcomerHours, 0), 0),
        badConditionHours: Math.max(numericOr(entry.badConditionHours, 0), 0),
        growth: clamp(numericOr(entry.growth, 0), 0, 1),
        speedSkill: clamp(numericOr(entry.speedSkill, 18 + adultSizeCm * 2), 0, 100),
        reflexSkill: clamp(numericOr(entry.reflexSkill, 56 - adultSizeCm * 1.4), 0, 100),
        longevity: clamp(numericOr(entry.longevity, 100), 0, 100),
        lastCompetitionDateKey: entry.lastCompetitionDateKey || "",
        addedAt: entry.addedAt || Date.now(),
      });
    })
    .filter(Boolean);
}

function normalizeAquariumStats(raw = {}) {
  const lampLevel = clamp(numericOr(raw.lampLevel, 1), 1, 5);
  const co2DeviceLevel = clamp(numericOr(raw.co2DeviceLevel, 1), 1, 5);
  const filterLevel = clamp(numericOr(raw.filterLevel, 1), 1, 5);
  return {
    waterQuality: clamp(numericOr(raw.waterQuality, 84), 0, 100),
    pollution: clamp(numericOr(raw.pollution, 16), 0, 100),
    temperature: clamp(numericOr(raw.temperature, 24), 20, 30),
    temperatureTarget: clamp(numericOr(raw.temperatureTarget, numericOr(raw.temperature, 24)), 20, 30),
    lightHours: clamp(numericOr(raw.lightHours, 2), 0, getLampMaxHours(lampLevel)),
    lampLevel,
    co2Level: clamp(numericOr(raw.co2Level, 2), 0, getCo2MaxLevel(co2DeviceLevel)),
    co2DeviceLevel,
    phLevel: clamp(numericOr(raw.phLevel, 7), 5.5, 8.5),
    oxygenLevel: clamp(numericOr(raw.oxygenLevel, 76), 0, 100),
    stability: clamp(numericOr(raw.stability, 72), 0, 100),
    filterLevel,
    filterCondition: clamp(numericOr(raw.filterCondition, 82), 0, 100),
    foodResidue: clamp(numericOr(raw.foodResidue, 0), 0, 100),
    diseasePressure: clamp(numericOr(raw.diseasePressure, 8), 0, 100),
    visitors: Math.max(numericOr(raw.visitors, 0), 0),
    feedUsesThisCycle: Math.max(0, Math.round(numericOr(raw.feedUsesThisCycle, 0))),
  };
}

function createAquariumBundle(overrides = {}) {
  const now = overrides.lastUpdatedAt || Date.now();
  const slotIndex = overrides.slotIndex || 1;
  return {
    id: overrides.id || `aquarium-${now}-${Math.random().toString(16).slice(2, 7)}`,
    slotIndex,
    name: overrides.name || `Aquarium ${slotIndex}`,
    aquarium: normalizeAquariumStats(overrides.aquarium || DEFAULT_AQUARIUM_STATS),
    fish: normalizeFishState(overrides.fish || []),
    plantsPlaced: normalizePlacedPlants(overrides.plantsPlaced || []),
    fryBatches: normalizeFryBatches(overrides.fryBatches || []),
    lastCycleSummary: overrides.lastCycleSummary || null,
    lastUpdatedAt: now,
    createdAt: overrides.createdAt || now,
  };
}

function getSelectedAquariumBundle(targetState = state) {
  if (!Array.isArray(targetState.aquariums) || targetState.aquariums.length === 0) {
    return null;
  }
  return (
    targetState.aquariums.find((entry) => entry.id === targetState.selectedAquariumId) ||
    targetState.aquariums[0]
  );
}

function persistSelectedAquariumState(targetState = state) {
  if (!Array.isArray(targetState.aquariums) || targetState.aquariums.length === 0) {
    return;
  }

  const activeBundle = getSelectedAquariumBundle(targetState);
  if (!activeBundle) {
    return;
  }

  const bundleIndex = targetState.aquariums.findIndex((entry) => entry.id === activeBundle.id);
  if (bundleIndex === -1) {
    return;
  }

  targetState.aquariums[bundleIndex] = {
    ...targetState.aquariums[bundleIndex],
    name: targetState.aquariumName,
    aquarium: normalizeAquariumStats(targetState.aquarium),
    fish: normalizeFishState(targetState.fish),
    plantsPlaced: normalizePlacedPlants(targetState.plantsPlaced),
    fryBatches: normalizeFryBatches(targetState.fryBatches),
    lastCycleSummary: targetState.lastCycleSummary || targetState.aquariums[bundleIndex].lastCycleSummary || null,
    lastUpdatedAt: numericOr(targetState.lastUpdatedAt, Date.now()),
  };
}

function syncSelectedAquariumState(targetState = state) {
  const activeBundle = getSelectedAquariumBundle(targetState);
  if (!activeBundle) {
    return;
  }

  targetState.selectedAquariumId = activeBundle.id;
  targetState.aquariumName = activeBundle.name;
  targetState.aquarium = normalizeAquariumStats(activeBundle.aquarium);
  targetState.fish = normalizeFishState(activeBundle.fish);
  targetState.plantsPlaced = normalizePlacedPlants(activeBundle.plantsPlaced);
  targetState.fryBatches = normalizeFryBatches(activeBundle.fryBatches);
  targetState.lastCycleSummary = activeBundle.lastCycleSummary || null;
  targetState.lastUpdatedAt = numericOr(activeBundle.lastUpdatedAt, Date.now());
}

function getNextAquariumCost(targetState = state) {
  const slotCosts = [0, 18, 28, 40];
  const nextIndex = Math.min(targetState.aquariums.length, slotCosts.length - 1);
  return slotCosts[nextIndex] || 40;
}

function createFishActor(fish) {
  const species = getSpecies(fish.speciesId);
  const profile = getBehaviorProfile(species);
  const sprite = getFishSpriteConfig(species);
  const zone = getLaneBounds(profile.lane);
  const initialDepthLevel = profile.preferredDepthLevel;
  const actor = {
    id: fish.id,
    speciesId: fish.speciesId,
    x: zone.minX + Math.random() * (zone.maxX - zone.minX),
    y: zone.minY + Math.random() * (zone.maxY - zone.minY),
    vx: (profile.baseSpeed * 0.55 + Math.random() * profile.baseSpeed * 0.35) * (Math.random() > 0.5 ? 1 : -1),
    vy: (Math.random() - 0.5) * profile.verticalRange * 0.12,
    targetX: zone.minX + Math.random() * (zone.maxX - zone.minX),
    targetY: zone.minY + Math.random() * (zone.maxY - zone.minY),
    depth: initialDepthLevel,
    depthLevel: initialDepthLevel,
    targetDepth: initialDepthLevel,
    targetCooldown: 4 + Math.random() * 5,
    depthChangeCooldown: 2.1 + Math.random() * 2.5,
    phase: Math.random() * Math.PI * 2,
    behavior: "glide",
    behaviorTimer: 0,
    preferredSpeed: profile.baseSpeed,
    anchorX: (zone.minX + zone.maxX) / 2,
    anchorY: (zone.minY + zone.maxY) / 2,
    facing: Math.random() > 0.5 ? 1 : -1,
    spriteDirection: sprite.direction,
    swimEffort: 0.34,
    foodFocusTimer: 0,
    behaviorProfile: profile,
    zone,
  };
  chooseFishBehavior(actor, true);
  return actor;
}

function getDecorInterestPoint() {
  if (!state.plantsPlaced.length) {
    return null;
  }
  const decor = state.plantsPlaced[Math.floor(Math.random() * state.plantsPlaced.length)];
  return {
    x: clamp(decor.x + (Math.random() - 0.5) * 12, 12, 88),
    y: clamp(decor.y - 10 - Math.random() * 12, 16, 80),
    depth: clamp(decor.depth + (Math.random() - 0.5) * 0.45, DEPTH_FRONT, DEPTH_BACK),
  };
}

function getBehaviorProfile(species) {
  const profile = species.behaviorProfile || {};
  const pace = profile.pace || "balanced";
  const speedByPace = {
    slow: 0.02,
    light: 0.027,
    balanced: 0.034,
    swift: 0.048,
  };
  const verticalByLane = {
    bottom: 5,
    "mid-low": 8,
    mid: 10,
    "mid-high": 9,
    "upper-mid": 8,
    upper: 6,
  };
  const depthByLane = {
    bottom: 2.55,
    "mid-low": 2.25,
    mid: 2,
    "mid-high": 1.8,
    "upper-mid": 1.6,
    upper: 1.4,
  };

  return {
    lane: profile.lane || "mid",
    sociability: profile.sociability || "paired",
    pace,
    hoverChance: profile.hoverChance ?? 0.2,
    inspectChance: profile.inspectChance ?? 0.25,
    cruiseChance: profile.cruiseChance ?? 0.55,
    baseSpeed: speedByPace[pace] || speedByPace.balanced,
    verticalRange: verticalByLane[profile.lane || "mid"] || 8,
    depthPreference: depthByLane[profile.lane || "mid"] || DEPTH_MID,
    preferredDepthLevel: clamp(Math.round(depthByLane[profile.lane || "mid"] || DEPTH_MID), DEPTH_FRONT, DEPTH_BACK),
  };
}

function getLaneBounds(lane) {
  const lanes = {
    bottom: { minX: 10, maxX: 90, minY: 64, maxY: 84 },
    "mid-low": { minX: 10, maxX: 90, minY: 52, maxY: 76 },
    mid: { minX: 10, maxX: 90, minY: 34, maxY: 70 },
    "mid-high": { minX: 12, maxX: 88, minY: 26, maxY: 58 },
    "upper-mid": { minX: 12, maxX: 88, minY: 20, maxY: 50 },
    upper: { minX: 14, maxX: 86, minY: 14, maxY: 38 },
  };
  return lanes[lane] || lanes.mid;
}

function chooseFishBehavior(actor, initial = false) {
  const roll = Math.random();
  const profile = actor.behaviorProfile;
  const decorPoint = getDecorInterestPoint();
  let desiredDepth = actor.depthLevel;

  if (roll < profile.hoverChance && !initial) {
    actor.behavior = "hover";
    actor.anchorX = clamp(actor.x + (Math.random() - 0.5) * 6, actor.zone.minX, actor.zone.maxX);
    actor.anchorY = clamp(actor.y + (Math.random() - 0.5) * profile.verticalRange, actor.zone.minY, actor.zone.maxY);
    actor.targetX = actor.anchorX;
    actor.targetY = actor.anchorY;
    desiredDepth = profile.preferredDepthLevel;
    actor.behaviorTimer = 2.4 + Math.random() * 3.8;
    actor.preferredSpeed = profile.baseSpeed * 0.28;
  } else if (roll < profile.hoverChance + profile.inspectChance && decorPoint) {
    actor.behavior = "inspect";
    actor.anchorX = decorPoint.x;
    actor.anchorY = decorPoint.y;
    actor.targetX = decorPoint.x;
    actor.targetY = decorPoint.y;
    desiredDepth = decorPoint.depth;
    actor.behaviorTimer = 3.2 + Math.random() * 4.2;
    actor.preferredSpeed = profile.baseSpeed * 0.62;
  } else {
    actor.behavior = "glide";
    actor.anchorX = actor.zone.minX + Math.random() * (actor.zone.maxX - actor.zone.minX);
    actor.anchorY = actor.zone.minY + Math.random() * (actor.zone.maxY - actor.zone.minY);
    actor.targetX = actor.anchorX;
    actor.targetY = actor.anchorY;
    desiredDepth = initial
      ? actor.depthLevel
      : clamp(profile.preferredDepthLevel + (Math.random() < 0.38 ? (Math.random() > 0.5 ? 1 : -1) : 0), DEPTH_FRONT, DEPTH_BACK);
    actor.behaviorTimer = 4.8 + Math.random() * 7.2;
    actor.preferredSpeed = profile.baseSpeed * (0.9 + Math.random() * 0.3);
  }

  tryScheduleDepthShift(actor, desiredDepth, initial);
  actor.targetCooldown = actor.behaviorTimer;
}

function createBubbleActor(depth = 1) {
  return {
    depth,
    x: 50,
    y: 110,
    speed: 4.4,
    size: 8,
    sourceType: "aerator",
    emitter: null,
    plantId: null,
    respawnDelay: 0,
    opacityBase: 0.22,
    scaleBase: 0.82,
  };
}

function getBubbleLayerByDepth(depth) {
  if (depth === DEPTH_BACK) {
    return els.bubbleBackLayer;
  }
  if (depth === DEPTH_MID) {
    return els.bubbleMidLayer;
  }
  return els.bubbleFrontLayer;
}

function buildBubbleSceneKey() {
  return state.plantsPlaced
    .map((plant) => `${plant.id}:${plant.depth}:${Math.round(plant.x * 10)}:${Math.round(plant.y * 10)}`)
    .join("|");
}

function createFoodParticle(x, depth = DEPTH_MID) {
  return {
    id: `food-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    x,
    y: 6 + Math.random() * 4,
    depth,
    vy: 0.14 + Math.random() * 0.05,
    life: 6.5 + Math.random() * 2.5,
    settled: false,
    waste: 0.7 + Math.random() * 0.5,
  };
}

function removeFoodParticle(particle) {
  particle.node?.remove();
  runtime.foodParticles = runtime.foodParticles.filter((entry) => entry.id !== particle.id);
}

function clearFoodParticles() {
  runtime.foodParticles.forEach((particle) => particle.node?.remove());
  runtime.foodParticles = [];
}

function spawnFoodParticles(portions) {
  const activeFish = getActiveFish();
  if (!activeFish.length || portions <= 0) {
    return;
  }

  const particleCount = Math.min(18, Math.max(activeFish.length, portions * 3));
  for (let index = 0; index < particleCount; index += 1) {
    const fish = activeFish[index % activeFish.length];
    const actor = runtime.fishActors.get(fish.id);
    const x = actor ? clamp(actor.x + (Math.random() - 0.5) * 16, 10, 90) : 16 + Math.random() * 68;
    const depth = actor ? clamp(Math.round(actor.depth), DEPTH_FRONT, DEPTH_BACK) : DEPTH_MID;
    const particle = createFoodParticle(x, depth);
    const node = document.createElement("span");
    node.className = "food-particle";
    particle.node = node;
    els.foodLayer.appendChild(node);
    runtime.foodParticles.push(particle);
  }

  runtime.fishActors.forEach((actor) => {
    actor.foodFocusTimer = 2.8 + Math.random() * 1.8;
    actor.targetCooldown = 0;
  });
}

function findNearestFoodParticle(actor) {
  if (!runtime.foodParticles.length) {
    return null;
  }

  let nearest = null;
  let bestScore = Infinity;
  runtime.foodParticles.forEach((particle) => {
    const dx = particle.x - actor.x;
    const dy = particle.y - actor.y;
    const depthPenalty = Math.abs(particle.depth - actor.depth) * 14;
    const settledPenalty = actor.foodFocusTimer > 0 && particle.settled ? 140 : 0;
    const score = dx * dx + dy * dy + depthPenalty * depthPenalty + settledPenalty;
    if (score < bestScore) {
      bestScore = score;
      nearest = particle;
    }
  });
  const detectionRange = actor.foodFocusTimer > 0 ? 5200 : 1400;
  return bestScore < detectionRange ? nearest : null;
}

function consumeFoodParticle(actor, particle) {
  removeFoodParticle(particle);
  state.fish = state.fish.map((fish) => {
    if (fish.id !== actor.id) {
      return fish;
    }
    return {
      ...fish,
      hunger: clamp(fish.hunger + 12, 0, 100),
      comfort: clamp(getFishComfort(fish) + 3, 0, 100),
      growth: clamp(fish.growth + 0.0012, 0, 1),
    };
  });
}

function updateFoodScene(dt) {
  if (runtime.foodParticles.length === 0) {
    return;
  }

  runtime.foodParticles.slice().forEach((particle) => {
    particle.life -= dt / 60;
    if (!particle.settled) {
      particle.y += particle.vy * dt;
      if (particle.y >= 82) {
        particle.y = 82;
        particle.settled = true;
      }
    }

    if (particle.life <= 0) {
      state.aquarium.foodResidue = clamp(state.aquarium.foodResidue + particle.waste * 2.2, 0, 100);
      state.aquarium.pollution = clamp(state.aquarium.pollution + particle.waste * 1.7, 0, 100);
      removeFoodParticle(particle);
      return;
    }

    const scale = depthScale(particle.depth) * (particle.settled ? 0.72 : 0.84);
    particle.node.style.left = `${particle.x}%`;
    particle.node.style.top = `${particle.y}%`;
    particle.node.style.opacity = `${particle.settled ? 0.62 : 0.88}`;
    particle.node.style.transform = `translate(-50%, -50%) scale(${scale})`;
    particle.node.style.filter = `brightness(${depthBrightness(particle.depth).toFixed(3)})`;
  });
}

function createAeratorBubbleEmitter(x, depth, count, spread = 1.8) {
  return {
    sourceType: "aerator",
    x,
    y: 97.2,
    depth,
    count,
    spread,
    ySpread: 0.8,
    sizeMin: 4.6,
    sizeMax: 8.4,
    speedMin: 3.5,
    speedMax: 5.6,
    opacityBase: 0.18 + (DEPTH_BACK - depth) * 0.04,
    scaleBase: 0.78 + (DEPTH_BACK - depth) * 0.04,
    respawnDelayMin: 0.06,
    respawnDelayMax: 0.26,
  };
}

function getPlantBubbleEmitter(plant) {
  if (!plant || plant.vitality < 46 || !plantConditionsMet(plant)) {
    return null;
  }

  const species = getPlantSpecies(plant.speciesId);
  const { sprite, displayHeight, displayWidth } = getPlantRenderMetrics(species);
  const depthScaleFactor = depthScale(plant.depth);
  const heightPercent = clamp((displayHeight * depthScaleFactor) / 4.2, 9, 28);
  const widthPercent = clamp((displayWidth * depthScaleFactor) / 4.2, 4, 16);
  const emitterSideBias = Math.random() > 0.5 ? 0.18 : -0.18;
  const topAnchor = plant.y - heightPercent * (0.56 + Math.random() * 0.1);

  return {
    sourceType: "plant",
    plantId: plant.id,
    x: clamp(plant.x + widthPercent * emitterSideBias, 8, 92),
    y: clamp(topAnchor, 12, plant.y - 5),
    depth: plant.depth,
    spread: Math.min(0.26 + widthPercent * 0.01, 0.68),
    ySpread: 0.28,
    sizeMin: 1.2,
    sizeMax: 2.4,
    speedMin: 1.8,
    speedMax: 3,
    opacityBase: 0.08 + (DEPTH_BACK - plant.depth) * 0.02,
    scaleBase: 0.56 + (DEPTH_BACK - plant.depth) * 0.04,
    respawnDelayMin: 2.6,
    respawnDelayMax: 7.4,
  };
}

function scheduleBubbleRespawn(actor, immediate = false) {
  if (immediate) {
    actor.respawnDelay = 0;
    return;
  }

  const emitter = actor.emitter;
  const minDelay = emitter?.respawnDelayMin ?? 0.1;
  const maxDelay = emitter?.respawnDelayMax ?? 0.3;
  actor.respawnDelay = minDelay + Math.random() * Math.max(maxDelay - minDelay, 0.01);
}

function spawnBubbleActor(actor) {
  let emitter = actor.emitter;
  if (actor.sourceType === "plant") {
    const plant = state.plantsPlaced.find((entry) => entry.id === actor.plantId);
    emitter = getPlantBubbleEmitter(plant);
  }

  if (!emitter) {
    actor.node.style.opacity = "0";
    actor.y = 110;
    actor.x = -10;
    actor.respawnDelay = 2.8 + Math.random() * 4.6;
    return;
  }

  actor.emitter = emitter;
  actor.depth = emitter.depth;
  actor.x = emitter.x + (Math.random() - 0.5) * emitter.spread;
  actor.y = emitter.y + (Math.random() - 0.5) * emitter.ySpread;
  actor.speed = emitter.speedMin + Math.random() * (emitter.speedMax - emitter.speedMin);
  actor.size = emitter.sizeMin + Math.random() * (emitter.sizeMax - emitter.sizeMin);
  actor.opacityBase = emitter.opacityBase;
  actor.scaleBase = emitter.scaleBase;
  actor.node.style.width = `${actor.size.toFixed(2)}px`;
  actor.node.style.height = `${actor.size.toFixed(2)}px`;
  actor.node.className = `bubble-particle${actor.sourceType === "plant" ? " micro" : ""}`;
  actor.respawnDelay = 0;
}

function getFishSpriteConfig(species) {
  return {
    ...DEFAULT_FISH_SPRITE,
    ...(species?.sprite || {}),
  };
}

function getPlantSpecies(speciesId) {
  return PLANT_SPECIES.find((entry) => entry.id === speciesId) || PLANT_SPECIES[0];
}

function normalizePlantDepth(depth) {
  const normalizedDepth = normalizeSceneDepth(depth);
  return ALLOWED_PLANT_DEPTHS.includes(normalizedDepth) ? normalizedDepth : DEPTH_MID;
}

function getPlantSpriteConfig(species) {
  return {
    ...DEFAULT_PLANT_SPRITE,
    ...(species?.sprite || {}),
  };
}

function getPlantRenderMetrics(species, scaleFactor = 1) {
  const sprite = getPlantSpriteConfig(species);
  const sizeScale = species?.sizeScale || 1;
  const displayHeight = sprite.displayHeight * sizeScale * 2 * scaleFactor;
  const displayWidth = Math.max(displayHeight * (sprite.w / sprite.h), displayHeight * 0.38);
  return { sprite, displayHeight, displayWidth };
}

function getPlantFloorOffset(species, depth, scaleFactor = 1) {
  const { sprite, displayHeight } = getPlantRenderMetrics(species, scaleFactor);
  const rootRatio = clamp((sprite.rootCut || 20) / 100, 0.1, 0.28);
  const buryByDepth = {
    [DEPTH_FRONT]: 0.92,
    [DEPTH_MID]: 0.62,
    [DEPTH_BACK]: 0.28,
  };
  return displayHeight * rootRatio * (buryByDepth[depth] || buryByDepth[DEPTH_MID]);
}

function getPlantSoilY(depth = DEPTH_MID) {
  const soilLineByDepth = {
    [DEPTH_FRONT]: 83.4,
    [DEPTH_MID]: 82.6,
    [DEPTH_BACK]: 81.8,
  };
  return soilLineByDepth[depth] || soilLineByDepth[DEPTH_MID];
}

function applyFishSpriteNode(node, species, className) {
  const sprite = getFishSpriteConfig(species);
  const isHero = className === "hero-fish";
  const sizeScale = species?.sizeScale || 1;
  const displayHeight = sprite.displayHeight * sizeScale * (isHero ? 0.72 : 1);
  const displayWidth = Math.max(displayHeight * (sprite.w / sprite.h), displayHeight * 1.18);

  node.className = `${className} species-${species.id}`;
  node.dataset.spriteDirection = String(sprite.direction);
  node.style.width = `${displayWidth.toFixed(2)}px`;
  node.style.height = `${displayHeight.toFixed(2)}px`;
  node.style.setProperty("--sprite-image", `url("${sprite.file}")`);
  node.style.setProperty("--tail-split", `${sprite.tailSplit}%`);
  node.style.setProperty("--tail-joint", `${sprite.tailJoint}%`);
}

function applyPlantSpriteNode(node, species, scaleFactor = 1) {
  const { sprite, displayHeight, displayWidth } = getPlantRenderMetrics(species, scaleFactor);

  node.className = `plant-piece species-${species.id}`;
  if (node.childElementCount !== 2) {
    node.innerHTML = '<img class="plant-stem" alt="" aria-hidden="true" draggable="false"><img class="plant-root" alt="" aria-hidden="true" draggable="false">';
  }
  const stemNode = node.querySelector(".plant-stem");
  const rootNode = node.querySelector(".plant-root");
  node.style.width = `${displayWidth.toFixed(2)}px`;
  node.style.height = `${displayHeight.toFixed(2)}px`;
  node.style.setProperty("--plant-root-cut", `${sprite.rootCut.toFixed(2)}%`);
  node.style.setProperty("--plant-sway-angle", `${sprite.swayAngle.toFixed(2)}deg`);
  node.style.setProperty("--plant-sway-angle-neg", `${(-sprite.swayAngle).toFixed(2)}deg`);
  node.style.setProperty("--plant-sway-duration", `${sprite.swayDuration.toFixed(2)}s`);
  if (stemNode) {
    stemNode.src = sprite.file;
  }
  if (rootNode) {
    rootNode.src = sprite.file;
  }
}

function setFishMotionState(node, swimEffort, phase = 0, hovering = false) {
  const effort = clamp(swimEffort, 0, 1);
  const idleAngle = 1.2 + effort * 1.8;
  const swimAngle = 4.2 + effort * 8.4;
  const bodyRoll = 0.5 + effort * 1.5;
  const tailSpeed = Math.max(0.6, 2.3 - effort * 1.4);

  node.classList.toggle("is-swimming", effort > 0.24);
  node.classList.toggle("is-hovering", hovering && effort < 0.3);
  node.style.setProperty("--tail-idle-angle", `${idleAngle.toFixed(2)}deg`);
  node.style.setProperty("--tail-idle-angle-neg", `${(-idleAngle).toFixed(2)}deg`);
  node.style.setProperty("--tail-swim-angle", `${swimAngle.toFixed(2)}deg`);
  node.style.setProperty("--tail-swim-angle-neg", `${(-swimAngle).toFixed(2)}deg`);
  node.style.setProperty("--body-roll", `${bodyRoll.toFixed(2)}deg`);
  node.style.setProperty("--body-roll-neg", `${(-bodyRoll).toFixed(2)}deg`);
  node.style.setProperty("--tail-speed", `${tailSpeed.toFixed(2)}s`);
  node.style.setProperty("--fish-delay", `${(-phase * 0.18).toFixed(2)}s`);
}

function createMissionTrackerState() {
  return MISSION_TRACKERS.reduce((trackers, key) => {
    trackers[key] = 0;
    return trackers;
  }, {});
}

function getDateSeed(dateKey = getTodayKey()) {
  return dateKey.split("").reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
}

function getMissionDefinitionById(missionId) {
  return MISSION_POOL.find((mission) => mission.id === missionId);
}

function getDailyMissionDefinitions(dateKey = getTodayKey()) {
  const seed = getDateSeed(dateKey);
  return [...MISSION_POOL]
    .sort((left, right) => {
      const leftScore = getDateSeed(`${dateKey}-${left.id}`) + seed;
      const rightScore = getDateSeed(`${dateKey}-${right.id}`) + seed;
      return leftScore - rightScore;
    })
    .slice(0, Math.min(3, MISSION_POOL.length));
}

function buildMissionState(dateKey = getTodayKey()) {
  const missions = getDailyMissionDefinitions(dateKey);
  return {
    dateKey,
    selectedIds: missions.map((mission) => mission.id),
    entries: missions.map((mission) => ({
      id: mission.id,
      progress: 0,
      claimed: false,
    })),
    trackers: createMissionTrackerState(),
  };
}

function getActiveMissionDefinitions() {
  const selectedIds = state.missionState.selectedIds || [];
  return selectedIds
    .map((missionId) => getMissionDefinitionById(missionId))
    .filter(Boolean);
}

function buildDefaultState() {
  const todayKey = getTodayKey();
  const starterAquarium = createAquariumBundle({
    id: "aquarium-1",
    slotIndex: 1,
    name: "Lagon des lucioles",
    aquarium: DEFAULT_AQUARIUM_STATS,
    fish: [],
    plantsPlaced: [],
  });
  return {
    saveVersion: SAVE_SCHEMA_VERSION,
    resetNonce: SAVE_RESET_NONCE,
    playerName: "Gardien des recifs",
    aquariumName: starterAquarium.name,
    coins: 240,
    pearls: 12,
    level: 1,
    xp: 12,
    cycleState: {
      cycleNumber: 1,
      minutesRemaining: CYCLE_MINUTES,
      lastAutoCycleAt: Date.now(),
    },
    inventory: {
      food: 8,
      waterKits: 1,
      medicine: 0,
      phUpTablets: 0,
      phDownTablets: 0,
      plantsOwned: [],
    },
    aquariums: [starterAquarium],
    selectedAquariumId: starterAquarium.id,
    plantsPlaced: starterAquarium.plantsPlaced,
    aquarium: starterAquarium.aquarium,
    fish: starterAquarium.fish,
    fryBatches: starterAquarium.fryBatches,
    missionState: buildMissionState(todayKey),
    competitionState: {
      weeklyContestEntries: {},
      history: [],
    },
    onboardingState: {
      step: ONBOARDING_FINAL_STEP,
      completed: true,
      rewardClaimed: true,
    },
    communityFeed: generateInitialFeed(),
    logs: [
      createLog("Aquarium initialise. Le recif attend ses premiers visiteurs."),
    ],
    lastRewardAt: 0,
    lastUpdatedAt: starterAquarium.lastUpdatedAt,
  };
}

function loadOnlineUiCache() {
  const raw = localStorage.getItem(ONLINE_UI_CACHE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function saveOnlineUiCache() {
  if (!isOnlineAuthoritativeMode()) {
    return;
  }
  const payload = {
    selectedAquariumId: state.selectedAquariumId || "aquarium-1",
    primaryTab:
      els.panels.find((panel) => panel.classList.contains("active"))?.dataset.panel ||
      els.tabs.find((tab) => tab.classList.contains("active"))?.dataset.tab ||
      "aquarium",
    tankTab: runtime.tankTab,
    inventoryTab: runtime.inventoryTab,
    shopTab: runtime.shopTab,
    savedAt: Date.now(),
  };

  localStorage.setItem(ONLINE_UI_CACHE_KEY, JSON.stringify(payload));
}

function loadState() {
  if (isOnlineAuthoritativeMode()) {
    const base = buildDefaultState();
    const uiCache = loadOnlineUiCache();
    if (typeof uiCache.selectedAquariumId === "string" && uiCache.selectedAquariumId.trim()) {
      base.selectedAquariumId = uiCache.selectedAquariumId.trim();
    }
    localStorage.removeItem(STORAGE_KEY);
    return base;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return buildDefaultState();
  }

  try {
    const parsed = JSON.parse(raw);
    if (numericOr(parsed?.resetNonce, 0) !== SAVE_RESET_NONCE) {
      localStorage.removeItem(STORAGE_KEY);
      return buildDefaultState();
    }
    return migrateState(parsed);
  } catch (error) {
    console.error("Impossible de lire la sauvegarde locale.", error);
    return buildDefaultState();
  }
}

function migrateState(parsed) {
  const base = buildDefaultState();
  const sourceVersion = Number(parsed?.saveVersion || 0);
  const merged = {
    ...base,
    ...parsed,
    saveVersion: SAVE_SCHEMA_VERSION,
    resetNonce: SAVE_RESET_NONCE,
    cycleState: {
      ...base.cycleState,
      ...(parsed.cycleState || {}),
    },
    inventory: {
      ...base.inventory,
      ...(parsed.inventory || {}),
      plantsOwned: normalizePlantInventory(parsed.inventory?.plantsOwned || base.inventory.plantsOwned),
    },
    aquarium: { ...base.aquarium, ...(parsed.aquarium || {}) },
    missionState: {
      ...base.missionState,
      ...(parsed.missionState || {}),
      selectedIds: parsed.missionState?.selectedIds || base.missionState.selectedIds,
      trackers: {
        ...base.missionState.trackers,
        ...(parsed.missionState?.trackers || {}),
      },
    },
    competitionState: {
      ...base.competitionState,
      ...(parsed.competitionState || {}),
      weeklyContestEntries: {
        ...(base.competitionState?.weeklyContestEntries || {}),
        ...(parsed.competitionState?.weeklyContestEntries || {}),
      },
      history: Array.isArray(parsed.competitionState?.history)
        ? parsed.competitionState.history
        : base.competitionState.history,
    },
    onboardingState: {
      ...base.onboardingState,
      ...(parsed.onboardingState || {}),
    },
  };

  merged.fish = normalizeFishState(merged.fish);

  if (!Array.isArray(merged.logs)) {
    merged.logs = base.logs;
  }

  if (!Array.isArray(merged.communityFeed)) {
    merged.communityFeed = generateInitialFeed();
  }

  merged.onboardingState = {
    step: Math.max(0, Math.round(numericOr(merged.onboardingState?.step, base.onboardingState.step))),
    completed: Boolean(merged.onboardingState?.completed),
    rewardClaimed: Boolean(merged.onboardingState?.rewardClaimed),
  };

  merged.inventory.decorationsOwned = [];
  merged.decorationsPlaced = [];
  merged.cycleState.cycleNumber = Math.max(1, Math.round(numericOr(merged.cycleState.cycleNumber, 1)));
  merged.cycleState.minutesRemaining = clamp(Math.round(numericOr(merged.cycleState.minutesRemaining, CYCLE_MINUTES)), 0, CYCLE_MINUTES);
  merged.cycleState.lastAutoCycleAt = numericOr(
    merged.cycleState.lastAutoCycleAt,
    parsed?.cycleState?.freeAdvanceReadyAt ? parsed.cycleState.freeAdvanceReadyAt - CYCLE_REFRESH_MS : parsed?.lastUpdatedAt || Date.now()
  );

  if (!Array.isArray(merged.plantsPlaced)) {
    merged.plantsPlaced = [...base.plantsPlaced];
  } else {
    merged.plantsPlaced = normalizePlacedPlants(merged.plantsPlaced, sourceVersion);
  }
  merged.fryBatches = normalizeFryBatches(merged.fryBatches);

  const rawAquariums = Array.isArray(parsed?.aquariums) && parsed.aquariums.length
    ? parsed.aquariums
    : [
        {
          id: parsed?.selectedAquariumId || "aquarium-1",
          slotIndex: 1,
          name: merged.aquariumName || base.aquariumName,
          aquarium: merged.aquarium,
          fish: merged.fish,
          plantsPlaced: merged.plantsPlaced,
          fryBatches: merged.fryBatches,
          lastUpdatedAt: parsed?.lastUpdatedAt || Date.now(),
          createdAt: Date.now(),
        },
      ];

  merged.aquariums = rawAquariums.map((entry, index) =>
    createAquariumBundle({
      id: entry.id || `aquarium-${index + 1}`,
      slotIndex: numericOr(entry.slotIndex, index + 1),
      name: entry.name || `Aquarium ${index + 1}`,
      aquarium: entry.aquarium,
      fish: entry.fish,
      plantsPlaced: entry.plantsPlaced,
      lastUpdatedAt: entry.lastUpdatedAt || parsed?.lastUpdatedAt || Date.now(),
      createdAt: entry.createdAt || Date.now(),
    })
  );
  merged.selectedAquariumId =
    merged.aquariums.find((entry) => entry.id === parsed?.selectedAquariumId)?.id || merged.aquariums[0]?.id;

  merged.aquarium.pollution = clamp(numericOr(merged.aquarium.pollution, 100 - numericOr(merged.aquarium.waterQuality, 84)), 0, 100);
  merged.aquarium.temperature = clamp(numericOr(merged.aquarium.temperature, 24), 20, 30);
  merged.aquarium.temperatureTarget = clamp(numericOr(merged.aquarium.temperatureTarget, merged.aquarium.temperature), 20, 30);
  merged.aquarium.waterQuality = clamp(numericOr(merged.aquarium.waterQuality, 100 - merged.aquarium.pollution), 0, 100);
  merged.aquarium.oxygenLevel = clamp(numericOr(merged.aquarium.oxygenLevel, 76), 0, 100);
  merged.aquarium.stability = clamp(numericOr(merged.aquarium.stability, 72), 0, 100);
  merged.aquarium.filterLevel = clamp(numericOr(merged.aquarium.filterLevel, 1), 1, 5);
  merged.aquarium.filterCondition = clamp(numericOr(merged.aquarium.filterCondition, 82), 0, 100);
  merged.aquarium.foodResidue = clamp(numericOr(merged.aquarium.foodResidue, 0), 0, 100);
  merged.aquarium.diseasePressure = clamp(numericOr(merged.aquarium.diseasePressure, 8), 0, 100);
  syncSelectedAquariumState(merged);

  return merged;
}

function saveState() {
  state.lastUpdatedAt = Date.now();
  persistSelectedAquariumState(state);
  if (isOnlineAuthoritativeMode()) {
    localStorage.removeItem(STORAGE_KEY);
    saveOnlineUiCache();
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentEvent() {
  const index = getDateSeed(getTodayKey()) % EVENTS.length;
  return EVENTS[index];
}

function getLampMaxHours(level = state.aquarium?.lampLevel || 1) {
  return [0, 6, 8, 10, 12, 14][clamp(level, 1, 5)] || 6;
}

function getCo2MaxLevel(level = state.aquarium?.co2DeviceLevel || 1) {
  return [0, 4, 6, 8, 10, 12][clamp(level, 1, 5)] || 4;
}

function getAverageIdealPh(fishes = getActiveFish()) {
  if (!fishes.length) {
    return 7;
  }
  return (
    fishes.reduce((sum, fish) => {
      const species = getSpecies(fish.speciesId);
      return sum + (numericOr(species.phMin, 6.6) + numericOr(species.phMax, 7.6)) / 2;
    }, 0) / fishes.length
  );
}

function getFishPhPenalty(fish, aquarium = state.aquarium) {
  const species = getSpecies(fish.speciesId);
  const ph = numericOr(aquarium.phLevel, 7);
  if (ph < numericOr(species.phMin, 6.5)) {
    return numericOr(species.phMin, 6.5) - ph;
  }
  if (ph > numericOr(species.phMax, 7.5)) {
    return ph - numericOr(species.phMax, 7.5);
  }
  return 0;
}

function getFishLifespanCycles(fishOrSpecies) {
  const species =
    fishOrSpecies && typeof fishOrSpecies === "object" && "speciesId" in fishOrSpecies
      ? getSpecies(fishOrSpecies.speciesId)
      : fishOrSpecies;
  return clamp(Math.round(numericOr(species?.lifespanCycles, 30)), 27, 36);
}

function getPlantLifespanCycles(plantOrSpecies) {
  const species =
    plantOrSpecies && typeof plantOrSpecies === "object" && "speciesId" in plantOrSpecies
      ? getPlantSpecies(plantOrSpecies.speciesId)
      : plantOrSpecies;
  return clamp(Math.round(numericOr(species?.lifespanCycles, 30)), 27, 36);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function getPlantLightingMismatch(plant, aquarium = state.aquarium) {
  const species = getPlantSpecies(plant.speciesId);
  const lightHours = numericOr(aquarium.lightHours, 2);
  if (lightHours < numericOr(species.lightMin, 2)) {
    return numericOr(species.lightMin, 2) - lightHours;
  }
  if (lightHours > numericOr(species.lightMax, 4)) {
    return lightHours - numericOr(species.lightMax, 4);
  }
  return 0;
}

function getPlantPhMismatch(plant, aquarium = state.aquarium) {
  const species = getPlantSpecies(plant.speciesId);
  const ph = numericOr(aquarium.phLevel, 7);
  if (ph < numericOr(species.phMin, 6.2)) {
    return numericOr(species.phMin, 6.2) - ph;
  }
  if (ph > numericOr(species.phMax, 7.5)) {
    return ph - numericOr(species.phMax, 7.5);
  }
  return 0;
}

function getPlantCo2Need(plant) {
  const species = getPlantSpecies(plant.speciesId);
  return numericOr(species.co2Need, 3);
}

function getFishOxygenNeed(fish) {
  const species = getSpecies(fish.speciesId);
  const sizeFactor = numericOr(species.sizeScale, 1);
  const oxygenTargetFactor = clamp(numericOr(species.oxygenMin, 50) / 100, 0.2, 1);
  return 0.45 + sizeFactor * 0.5 + oxygenTargetFactor * 0.85;
}

function getPlantCo2Coverage(plant, aquarium = state.aquarium, plants = state.plantsPlaced) {
  const plantNeed = getPlantCo2Need(plant) * Math.max(0.35, numericOr(plant.vitality, 100) / 100);
  if (plantNeed <= 0) {
    return 1;
  }
  const totalNeed = plants.reduce(
    (sum, entry) => sum + getPlantCo2Need(entry) * Math.max(0.35, numericOr(entry.vitality, 100) / 100),
    0
  );
  if (totalNeed <= 0) {
    return 1;
  }
  const totalProduced = getCo2ProductionRate(aquarium);
  const allocatedShare = totalProduced * (plantNeed / totalNeed);
  return clamp(allocatedShare / plantNeed, 0, 1);
}

function getPlantCo2Deficit(plant, aquarium = state.aquarium, plants = state.plantsPlaced) {
  return 1 - getPlantCo2Coverage(plant, aquarium, plants);
}

function getPlantConditionScore(plant, aquarium = state.aquarium, plants = state.plantsPlaced) {
  const species = getPlantSpecies(plant.speciesId);
  const tempGap =
    aquarium.temperature < species.temperatureMin
      ? species.temperatureMin - aquarium.temperature
      : aquarium.temperature > species.temperatureMax
        ? aquarium.temperature - species.temperatureMax
        : 0;
  const tempScore = clamp(1 - tempGap / 4.5, 0, 1);
  const lightScore = clamp(1 - getPlantLightingMismatch(plant, aquarium) / 2.4, 0, 1);
  const phScore = clamp(1 - getPlantPhMismatch(plant, aquarium) / 0.8, 0, 1);
  const co2Score = getPlantCo2Coverage(plant, aquarium, plants);
  return clamp(tempScore * 0.25 + lightScore * 0.3 + phScore * 0.2 + co2Score * 0.25, 0, 1);
}

function getPlantOxygenOutputFactor(plant, aquarium = state.aquarium, plants = state.plantsPlaced) {
  if (numericOr(aquarium.lightHours, 0) <= 0) {
    return 0;
  }
  return clamp(getPlantConditionScore(plant, aquarium, plants) * (numericOr(plant.vitality, 100) / 100), 0, 1);
}

function getFishOxygenCoverage(fish, aquarium = state.aquarium, fishes = getActiveFish(), plants = state.plantsPlaced) {
  const fishNeed = getFishOxygenNeed(fish);
  if (fishNeed <= 0) {
    return 1;
  }
  const totalNeed = fishes.reduce((sum, entry) => sum + getFishOxygenNeed(entry), 0);
  if (totalNeed <= 0) {
    return 1;
  }
  const totalProduced = getOxygenProductionRate(aquarium, plants);
  const allocatedShare = totalProduced * (fishNeed / totalNeed);
  return clamp(allocatedShare / fishNeed, 0, 1);
}

function getFishOxygenDeficit(fish, aquarium = state.aquarium, fishes = getActiveFish(), plants = state.plantsPlaced) {
  return 1 - getFishOxygenCoverage(fish, aquarium, fishes, plants);
}

function canPlantPhotosynthesize(plant, aquarium = state.aquarium, plants = state.plantsPlaced) {
  return getPlantOxygenOutputFactor(plant, aquarium, plants) >= 0.2;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function countElapsedLocalDays(fromKey, toKey) {
  const parseKey = (key) => {
    const [year, month, day] = String(key || "").split("-").map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
  };
  const from = parseKey(fromKey);
  const to = parseKey(toKey);
  return Math.max(0, Math.round((to - from) / 86400000));
}

function getCycleState() {
  if (!state.cycleState) {
    state.cycleState = {
      cycleNumber: 1,
      minutesRemaining: CYCLE_MINUTES,
      lastAutoCycleAt: Date.now(),
    };
  }
  return state.cycleState;
}

function getCycleRemainingRefreshMs() {
  const cycleState = getCycleState();
  return Math.max(0, numericOr(cycleState.lastAutoCycleAt, Date.now()) + CYCLE_REFRESH_MS - Date.now());
}

function formatCountdown(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} h ${String(minutes).padStart(2, "0")} min`;
}

function startNewCycle(reason = "paid") {
  const cycleState = getCycleState();
  cycleState.cycleNumber += 1;
  cycleState.minutesRemaining = CYCLE_MINUTES;
  state.logs.unshift(
    createLog(
      reason === "auto"
        ? `Le cycle ${cycleState.cycleNumber} commence automatiquement apres 4 h.`
        : `Le cycle ${cycleState.cycleNumber} commence contre ${CYCLE_ADVANCE_PEARL_COST} perles.`
    )
  );
}

function spendCycleMinutes(cost, actionLabel) {
  applyPendingAutoCycles();
  const cycleState = getCycleState();
  const roundedCost = Math.max(1, Math.round(cost));
  if (cycleState.minutesRemaining < roundedCost) {
    toast(
      `Temps insuffisant pour ${actionLabel}. Il reste ${cycleState.minutesRemaining} min sur ce cycle. Passe au cycle suivant.`
    );
    return false;
  }
  cycleState.minutesRemaining = Math.max(0, cycleState.minutesRemaining - roundedCost);
  if (cycleState.minutesRemaining === 0) {
    state.logs.unshift(createLog(`Le credit temps du cycle ${cycleState.cycleNumber} est epuise.`));
  }
  return true;
}

function plantConditionsMetForTank(plant, aquarium, plants = state.plantsPlaced) {
  return (
    plantConditionsMet(plant, aquarium) &&
    getPlantConditionScore(plant, aquarium, plants) >= 0.95
  );
}

function fishConditionsMetForTank(fish, aquarium, fishes = state.fish, plants = state.plantsPlaced) {
  return fishConditionsMet(fish, aquarium, fishes, plants);
}

function applyCycleToBundle(bundle, reason = "manual") {
  const aquarium = normalizeAquariumStats(bundle.aquarium);
  let fish = normalizeFishState(bundle.fish);
  let plantsPlaced = normalizePlacedPlants(bundle.plantsPlaced);
  let fryBatches = normalizeFryBatches(bundle.fryBatches);
  const aquariumBefore = { ...aquarium };
  const fishBefore = normalizeFishState(bundle.fish);
  const plantsBefore = normalizePlacedPlants(bundle.plantsPlaced);
  aquarium.co2Level = clamp(
    aquarium.co2Level + getCo2ProductionRate(aquarium) * 0.35,
    0,
    getCo2MaxLevel(aquarium.co2DeviceLevel)
  );
  aquarium.co2Level = clamp(
    aquarium.co2Level - plantsPlaced.reduce((sum, plant) => sum + getPlantCo2Need(plant) * 0.12 * (plant.vitality / 100), 0),
    0,
    getCo2MaxLevel(aquarium.co2DeviceLevel)
  );

  const feedUsesThisCycle = Math.max(0, Math.round(numericOr(aquarium.feedUsesThisCycle, 0)));
  const hungerDrop = randomBetween(9, 20);
  const filterReduction = getFilterEfficiency();
  const waterQualityDrop = (randomBetween(5, 11) + feedUsesThisCycle) * (1 - filterReduction);
  const phDrop = plantsPlaced.reduce((sum) => sum + randomBetween(0.1, 0.2), 0);
  aquarium.foodResidue = clamp(aquarium.foodResidue + fish.length * 2.4, 0, 100);
  aquarium.waterQuality = clamp(aquarium.waterQuality - waterQualityDrop, 0, 100);
  aquarium.pollution = clamp(100 - aquarium.waterQuality, 0, 100);
  aquarium.phLevel = clamp(aquarium.phLevel - phDrop, 5.5, 8.5);
  aquarium.feedUsesThisCycle = 0;
  const oxygenProduced = getOxygenProductionRate(aquarium, plantsPlaced);
  const oxygenConsumed = getOxygenConsumptionRate(aquarium, fish);
  aquarium.oxygenLevel = clamp(oxygenConsumed <= 0 ? 100 : (oxygenProduced / oxygenConsumed) * 100, 0, 100);

  plantsPlaced = plantsPlaced.map((plant) => {
    const missingConditions = getPlantMissingConditionCount(plant, aquarium, plantsPlaced);
    const nextGoodCycleStreak = missingConditions === 0 ? numericOr(plant.goodCycleStreak, 0) + 1 : 0;
    const vitality =
      nextGoodCycleStreak >= 2
        ? 100
        : clamp(plant.vitality - missingConditions * HIDDEN_VITALITY_STEP, 0, 100);
    return {
      ...plant,
      vitality,
      goodCycleStreak: nextGoodCycleStreak,
      longevity: clamp(plant.longevity - 100 / getPlantLifespanCycles(plant), 0, 100),
      badConditionHours: missingConditions === 0 ? 0 : plant.badConditionHours + CYCLE_STEP_HOURS,
    };
  });

  fish = fish.map((entry) => {
    const nextHunger = clamp(entry.hunger - hungerDrop, 0, 100);
    const missingConditions = getFishMissingConditionCount(entry, aquarium, fish, plantsPlaced, nextHunger);
    const nextGoodCycleStreak = missingConditions === 0 ? numericOr(entry.goodCycleStreak, 0) + 1 : 0;
    const healthy = missingConditions === 0;
    const growthGain = healthy && nextHunger > 16 ? 0.03 : healthy ? 0.012 : 0.002;
    const vitality =
      nextGoodCycleStreak >= 2
        ? 100
        : clamp(entry.vitality - missingConditions * HIDDEN_VITALITY_STEP, 0, 100);
    const longevityPenalty = healthy ? 0 : 1.6 + Math.max(0, 50 - entry.comfort) * 0.035;
    return {
      ...entry,
      ageHours: entry.ageHours + CYCLE_STEP_HOURS,
      goodCycleStreak: nextGoodCycleStreak,
      newcomerHours: Math.max(entry.newcomerHours - CYCLE_STEP_HOURS, 0),
      badConditionHours: healthy ? 0 : entry.badConditionHours + CYCLE_STEP_HOURS,
      hunger: nextHunger,
      growth: clamp(entry.growth + growthGain, 0, 1),
      vitality,
      longevity: clamp(entry.longevity - (100 / getFishLifespanCycles(entry) + longevityPenalty * 0.1), 0, 100),
    };
  });

  const nextFryBatches = [];
  let hatchCount = 0;
  fryBatches.forEach((batch) => {
    const remainingCycles = batch.cyclesRemaining - 1;
    if (remainingCycles > 0) {
      nextFryBatches.push({ ...batch, cyclesRemaining: remainingCycles });
      return;
    }

    let batchHatchCount = 0;
    while (batchHatchCount < batch.count) {
      fish.push(
        createFish(batch.speciesId, {
          nickname: generateBabyName(),
          hunger: 78,
          comfort: 82,
          vitality: 88,
          ageHours: 0,
          growth: 0,
          newcomerHours: 12,
        })
      );
      batchHatchCount += 1;
    }

    hatchCount += batchHatchCount;
    const remainingCount = batch.count - batchHatchCount;
    if (batchHatchCount > 0) {
      state.logs.unshift(
        createLog(
          `${batchHatchCount} alevin${batchHatchCount > 1 ? "s" : ""} de ${getSpecies(batch.speciesId).species} eclosent dans ${bundle.name}.`
        )
      );
    }
    if (remainingCount > 0) {
      nextFryBatches.push({
        ...batch,
        count: remainingCount,
        cyclesRemaining: 1,
      });
      state.logs.unshift(createLog(`Des alevins attendent de la place pour eclore dans ${bundle.name}.`));
    }
  });

  const nextFish = fish.filter((entry) => entry.vitality > 0 && entry.longevity > 0);
  const nextPlantsPlaced = plantsPlaced.filter((plant) => plant.vitality > 0 && plant.longevity > 0);
  const cycleSummary = createCycleSummary(
    bundle.name,
    aquariumBefore,
    aquarium,
    fishBefore,
    nextFish,
    plantsBefore,
    nextPlantsPlaced,
    hatchCount,
    reason
  );

  return {
    ...bundle,
    aquarium,
    fish: nextFish,
    plantsPlaced: nextPlantsPlaced,
    fryBatches: nextFryBatches,
    lastCycleSummary: cycleSummary,
    lastUpdatedAt: Date.now(),
  };
}

function applyCycleAdvance(reason = "paid") {
  persistSelectedAquariumState(state);
  state.aquariums = state.aquariums.map((bundle) => applyCycleToBundle(bundle, reason));
  startNewCycle(reason);
  syncSelectedAquariumState(state);
}

function applyPendingAutoCycles() {
  if (isOnlineAuthoritativeMode()) {
    return false;
  }
  const cycleState = getCycleState();
  const lastAutoCycleAt = numericOr(cycleState.lastAutoCycleAt, Date.now());
  const elapsedCycles = Math.floor((Date.now() - lastAutoCycleAt) / CYCLE_REFRESH_MS);
  if (elapsedCycles <= 0) {
    return false;
  }
  for (let index = 0; index < elapsedCycles; index += 1) {
    applyCycleAdvance("auto");
  }
  cycleState.lastAutoCycleAt = lastAutoCycleAt + elapsedCycles * CYCLE_REFRESH_MS;
  saveState();
  return true;
}

function normalizePlantInventory(rawPlantsOwned) {
  if (!Array.isArray(rawPlantsOwned)) {
    return [];
  }
  return rawPlantsOwned.filter((plantId) => PLANT_SPECIES.some((species) => species.id === plantId));
}

function getOwnedPlantCount(speciesId) {
  return (state.inventory.plantsOwned || []).filter((plantId) => plantId === speciesId).length;
}

function addPlantToInventory(speciesId) {
  state.inventory.plantsOwned = [...(state.inventory.plantsOwned || []), speciesId];
}

function removePlantFromInventory(speciesId) {
  const index = (state.inventory.plantsOwned || []).findIndex((plantId) => plantId === speciesId);
  if (index === -1) {
    return false;
  }
  state.inventory.plantsOwned.splice(index, 1);
  return true;
}

function getGroupedInventoryPlants() {
  const counts = new Map();
  (state.inventory.plantsOwned || []).forEach((plantId) => {
    counts.set(plantId, (counts.get(plantId) || 0) + 1);
  });
  return [...counts.entries()].map(([speciesId, reserveCount]) => ({
    speciesId,
    reserveCount,
  }));
}

function ensureMissionsForToday() {
  const todayKey = getTodayKey();
  if (state.missionState.dateKey === todayKey) {
    return;
  }

  state.missionState = buildMissionState(todayKey);
  state.logs.unshift(createLog("Nouvelles missions quotidiennes disponibles."));
}

function getActiveFish() {
  return state.fish;
}

function getAverageIdealTemperature(fishes = getActiveFish()) {
  if (!fishes.length) {
    return 24;
  }

  return fishes.reduce((sum, fish) => {
    const species = getSpecies(fish.speciesId);
    return sum + (species.temperatureMin + species.temperatureMax) / 2;
  }, 0) / fishes.length;
}

function getFilterEfficiency() {
  return getFilterEfficiencyByLevel(state.aquarium.filterLevel || 1);
}

function getFilterEfficiencyByLevel(level) {
  const reductionByLevel = {
    1: 0.06,
    2: 0.08,
    3: 0.1,
    4: 0.12,
    5: 0.14,
  };
  const normalizedLevel = clamp(level || 1, 1, 5);
  return reductionByLevel[normalizedLevel] || reductionByLevel[1];
}

function getFilterLabel() {
  return ["", "Filtre I", "Filtre II", "Filtre III", "Filtre IV", "Filtre V"][state.aquarium.filterLevel] || "Filtre I";
}

function formatPhRange(min, max) {
  return `${min.toFixed(1).replace(".", ",")}-${max.toFixed(1).replace(".", ",")}`;
}

function renderInfoChipRow(labels) {
  if (!labels.length) {
    return "";
  }
  return `<div class="info-chip-row">${labels.map((label) => `<span class="info-chip">${label}</span>`).join("")}</div>`;
}

function getFishOxygenDemandLabel(fishOrSpecies) {
  const species = fishOrSpecies?.speciesId ? getSpecies(fishOrSpecies.speciesId) : fishOrSpecies;
  const oxygenMin = numericOr(species?.oxygenMin, 50);
  if (oxygenMin >= 62) {
    return "O2 eleve";
  }
  if (oxygenMin >= 50) {
    return "O2 soutenu";
  }
  if (oxygenMin >= 40) {
    return "O2 modere";
  }
  return "O2 tolere";
}

function getPlantCo2DemandLabel(plantOrSpecies) {
  const species = plantOrSpecies?.speciesId ? getPlantSpecies(plantOrSpecies.speciesId) : plantOrSpecies;
  const co2Need = numericOr(species?.co2Need, 3);
  if (co2Need >= 5) {
    return "CO2 eleve";
  }
  if (co2Need >= 3.5) {
    return "CO2 moyen";
  }
  return "CO2 leger";
}

function getPlantOxygenLabel(plantOrSpecies) {
  const species = plantOrSpecies?.speciesId ? getPlantSpecies(plantOrSpecies.speciesId) : plantOrSpecies;
  const oxygenGeneration = numericOr(species?.oxygenGeneration, 1);
  if (oxygenGeneration >= 1.5) {
    return "O2 fort";
  }
  if (oxygenGeneration >= 1) {
    return "O2 moyen";
  }
  return "O2 discret";
}

function getFishBehaviorLabel(species) {
  const profile = species?.behaviorProfile || {};
  const sociability = profile.sociability || "shoaling";
  if (sociability === "solitary") {
    return "solitaire";
  }
  if (sociability === "territorial") {
    return "territorial";
  }
  if (sociability === "paired") {
    return "en duo";
  }
  if (sociability === "grouped") {
    return "gregaire";
  }
  return "de banc";
}

function getFishPaceLabel(species) {
  const pace = species?.behaviorProfile?.pace || "balanced";
  if (pace === "swift") {
    return "tres vif";
  }
  if (pace === "light") {
    return "leger";
  }
  if (pace === "slow") {
    return "calme";
  }
  return "equilibre";
}

function getSpeciesToleranceLabel(species) {
  const tempSpan = numericOr(species?.temperatureMax, 26) - numericOr(species?.temperatureMin, 22);
  const phSpan = numericOr(species?.phMax, 7.5) - numericOr(species?.phMin, 6.5);
  const toleranceScore = tempSpan + phSpan * 3;
  if (toleranceScore >= 7) {
    return "robuste";
  }
  if (toleranceScore >= 5) {
    return "equilibre";
  }
  return "exigeant";
}

function getPlantProfileBadges(species) {
  return [
    getPlantOxygenLabel(species),
    getPlantCo2DemandLabel(species),
    numericOr(species.fryProtection, 0) >= 16 ? "bon refuge" : "refuge leger",
    getSpeciesToleranceLabel(species),
  ];
}

function getFishProfileBadges(species) {
  return [
    getFishBehaviorLabel(species),
    getFishPaceLabel(species),
    getFishOxygenDemandLabel(species),
    getSpeciesToleranceLabel(species),
  ];
}

function getFishCareState(fish, aquarium = state.aquarium, fishes = state.fish, plants = state.plantsPlaced) {
  const species = getSpecies(fish.speciesId);
  const oxygenCoverage = getFishOxygenCoverage(fish, aquarium, fishes, plants);
  if (fish.vitality <= 24) {
    return { label: "En danger", detail: "Ses reserves internes sont presque epuisees." };
  }
  if (fish.hunger <= 10) {
    return { label: "Affame", detail: "Le prochain cycle entamera directement sa vie cachee." };
  }
  if (oxygenCoverage < 0.72) {
    return { label: "Sous oxygene", detail: "Le bac ne couvre pas correctement son besoin en oxygene." };
  }
  if (aquarium.temperature < species.temperatureMin || aquarium.temperature > species.temperatureMax) {
    return { label: "Temperature inadaptee", detail: "La temperature du bac s'ecarte trop de sa zone ideale." };
  }
  if (getFishPhPenalty(fish, aquarium) > 0.15) {
    return { label: "pH instable", detail: "Le pH actuel sort de sa plage de confort." };
  }
  if (aquarium.waterQuality < 55) {
    return { label: "Eau fatiguee", detail: "La qualite d'eau commence a peser sur son confort." };
  }
  if (getFishComfort(fish) >= 80 && fish.vitality >= 80) {
    return { label: "Tres a l'aise", detail: "Conditions ideales pour grandir et rester stable." };
  }
  return { label: "Stable", detail: "Le poisson tient bien ses conditions pour le moment." };
}

function getPlantCareState(plant, aquarium = state.aquarium, plants = state.plantsPlaced) {
  const species = getPlantSpecies(plant.speciesId);
  const outputFactor = getPlantOxygenOutputFactor(plant, aquarium, plants);
  const co2Coverage = getPlantCo2Coverage(plant, aquarium, plants);
  if (plant.vitality <= 24) {
    return { label: "En train de deperir", detail: "Sans correction rapide, la plante peut mourir au prochain cycle." };
  }
  if (numericOr(aquarium.lightHours, 0) <= 0) {
    return { label: "Dans l'obscurite", detail: "Sans lumiere, elle ne produit plus d'oxygene." };
  }
  if (co2Coverage < 0.72) {
    return { label: "Manque de CO2", detail: "Le diffuseur ne couvre pas correctement ses besoins." };
  }
  if (aquarium.temperature < species.temperatureMin || aquarium.temperature > species.temperatureMax) {
    return { label: "Temperature inadaptee", detail: "La temperature du bac ralentit son equilibre." };
  }
  if (getPlantPhMismatch(plant, aquarium) > 0.15) {
    return { label: "pH defavorable", detail: "Le pH actuel limite sa forme et sa production." };
  }
  if (outputFactor >= 0.85 && plant.vitality >= 80) {
    return { label: "Tres oxygenante", detail: "Elle tourne presque a plein rendement pour l'oxygene." };
  }
  return { label: "Stable", detail: "La plante tient correctement ses conditions actuelles." };
}

function getFishNeedSummary(species) {
  return `Temp. ${species.temperatureMin}-${species.temperatureMax} C - pH ${formatPhRange(species.phMin, species.phMax)} - ${getFishOxygenDemandLabel(species)}`;
}

function getPlantNeedSummary(species) {
  return `Temp. ${species.temperatureMin}-${species.temperatureMax} C - pH ${formatPhRange(species.phMin, species.phMax)} - lum ${species.lightMin}-${species.lightMax} h - ${getPlantCo2DemandLabel(species)}`;
}

function getLampProgressSummary(level = state.aquarium.lampLevel) {
  const currentMax = getLampMaxHours(level);
  const nextLevel = Math.min(level + 1, 5);
  if (nextLevel === level) {
    return `Actuel: 0 a ${currentMax} h. Niveau maximal atteint.`;
  }
  return `Actuel: 0 a ${currentMax} h. Prochain palier: 0 a ${getLampMaxHours(nextLevel)} h.`;
}

function getCo2ProgressSummary(level = state.aquarium.co2DeviceLevel) {
  const currentMax = getCo2MaxLevel(level);
  const nextLevel = Math.min(level + 1, 5);
  if (nextLevel === level) {
    return `Actuel: production max ${currentMax}. Niveau maximal atteint.`;
  }
  return `Actuel: production max ${currentMax}. Prochain palier: ${getCo2MaxLevel(nextLevel)}.`;
}

function getFilterProgressSummary(level = state.aquarium.filterLevel) {
  const currentMax = Math.round(getFilterEfficiencyByLevel(level) * 100);
  const nextLevel = Math.min(level + 1, 5);
  if (nextLevel === level) {
    return `Actuel: reduction de ${currentMax}%. Niveau maximal atteint.`;
  }
  return `Actuel: reduction de ${currentMax}%. Prochain palier: ${Math.round(getFilterEfficiencyByLevel(nextLevel) * 100)}%.`;
}

function getCycleForecast(aquarium = state.aquarium, fishes = state.fish, plants = state.plantsPlaced, fryBatches = state.fryBatches) {
  const feedUses = Math.max(0, Math.round(numericOr(aquarium.feedUsesThisCycle, 0)));
  const filterReduction = getFilterEfficiencyByLevel(aquarium.filterLevel || 1);
  const waterMinDrop = (5 + feedUses) * (1 - filterReduction);
  const waterMaxDrop = (11 + feedUses) * (1 - filterReduction);
  const projectedWaterFloor = clamp(aquarium.waterQuality - waterMaxDrop, 0, 100);
  const fishAtRisk = fishes.filter((fish) => {
    const species = getSpecies(fish.speciesId);
    const oxygenCoverage = getFishOxygenCoverage(fish, aquarium, fishes, plants);
    return (
      fish.hunger <= 20 ||
      oxygenCoverage < 0.98 ||
      projectedWaterFloor < 55 ||
      aquarium.temperature < species.temperatureMin ||
      aquarium.temperature > species.temperatureMax ||
      getFishPhPenalty(fish, aquarium) > 0.15 ||
      fish.vitality <= 34
    );
  }).length;
  const plantsAtRisk = plants.filter((plant) => {
    const species = getPlantSpecies(plant.speciesId);
    return (
      numericOr(aquarium.lightHours, 0) <= 0 ||
      getPlantCo2Coverage(plant, aquarium, plants) < 0.95 ||
      getPlantPhMismatch(plant, aquarium) > 0.15 ||
      aquarium.temperature < species.temperatureMin ||
      aquarium.temperature > species.temperatureMax ||
      plant.vitality <= 34
    );
  }).length;
  return {
    waterMinDrop,
    waterMaxDrop,
    fishAtRisk,
    plantsAtRisk,
    hungerMinDrop: 9,
    hungerMaxDrop: 20,
    fryReady: fryBatches.filter((batch) => numericOr(batch.cyclesRemaining, 1) <= 1).length,
  };
}

function getFishMissingConditionCount(fish, aquarium, fishes, plants, nextHunger = fish.hunger) {
  const species = getSpecies(fish.speciesId);
  let missingConditions = 0;
  if (nextHunger <= 0) {
    missingConditions += 1;
  }
  if (aquarium.temperature < species.temperatureMin || aquarium.temperature > species.temperatureMax) {
    missingConditions += 1;
  }
  if (aquarium.waterQuality < 55) {
    missingConditions += 1;
  }
  if (getFishPhPenalty(fish, aquarium) > 0.15) {
    missingConditions += 1;
  }
  if (getFishOxygenCoverage(fish, aquarium, fishes, plants) < 0.98) {
    missingConditions += 1;
  }
  return missingConditions;
}

function getPlantMissingConditionCount(plant, aquarium, plants) {
  const species = getPlantSpecies(plant.speciesId);
  let missingConditions = 0;
  if (numericOr(aquarium.lightHours, 0) <= 0 || getPlantLightingMismatch(plant, aquarium) > 0) {
    missingConditions += 1;
  }
  if (aquarium.temperature < species.temperatureMin || aquarium.temperature > species.temperatureMax) {
    missingConditions += 1;
  }
  if (aquarium.waterQuality < 38) {
    missingConditions += 1;
  }
  if (getPlantPhMismatch(plant, aquarium) > 0.15) {
    missingConditions += 1;
  }
  if (getPlantCo2Coverage(plant, aquarium, plants) < 0.95) {
    missingConditions += 1;
  }
  return missingConditions;
}

function createCycleSummary(bundleName, aquariumBefore, aquariumAfter, fishBefore, fishAfter, plantsBefore, plantsAfter, fryHatchedCount, reason) {
  const fishLost = Math.max(0, fishBefore.length - fishAfter.length);
  const plantsLost = Math.max(0, plantsBefore.length - plantsAfter.length);
  const averageComfort = fishAfter.length
    ? Math.round(fishAfter.reduce((sum, fish) => sum + getFishComfort(fish), 0) / fishAfter.length)
    : 0;
  const averageHunger = fishAfter.length
    ? Math.round(fishAfter.reduce((sum, fish) => sum + fish.hunger, 0) / fishAfter.length)
    : 0;
  const waterDelta = Math.round(aquariumAfter.waterQuality - aquariumBefore.waterQuality);
  const tankForecast = getCycleForecast(aquariumAfter, fishAfter, plantsAfter, []);
  let headline = `Cycle ${reason === "auto" ? "automatique" : "manuel"} applique sur ${bundleName}.`;
  if (fishLost > 0 || plantsLost > 0) {
    headline = `${bundleName}: ${fishLost} poisson${fishLost > 1 ? "s" : ""} et ${plantsLost} plante${plantsLost > 1 ? "s" : ""} perdus sur ce cycle.`;
  } else if (fryHatchedCount > 0) {
    headline = `${bundleName}: ${fryHatchedCount} alevin${fryHatchedCount > 1 ? "s" : ""} ont eclos sur ce cycle.`;
  }
  const detail = `Eau ${waterDelta >= 0 ? "+" : ""}${waterDelta} pts, faim moyenne ${averageHunger}%, confort moyen ${averageComfort}%, vigilance ${tankForecast.fishAtRisk} poisson${tankForecast.fishAtRisk > 1 ? "s" : ""} / ${tankForecast.plantsAtRisk} plante${tankForecast.plantsAtRisk > 1 ? "s" : ""}.`;
  return {
    headline,
    detail,
    fishLost,
    plantsLost,
    fryHatchedCount,
    timestamp: Date.now(),
  };
}

function getPlantWaterSupport() {
  return state.plantsPlaced.reduce((sum, plant) => {
    const species = getPlantSpecies(plant.speciesId);
    const outputFactor = getPlantOxygenOutputFactor(plant, state.aquarium, state.plantsPlaced);
    if (outputFactor <= 0) {
      return sum;
    }
    return sum + species.oxygenGeneration * outputFactor * 0.55;
  }, 0);
}

function getPlantComfortRelief() {
  return clamp(
    state.plantsPlaced.reduce((sum, plant) => {
      const species = getPlantSpecies(plant.speciesId);
      const outputFactor = getPlantOxygenOutputFactor(plant, state.aquarium, state.plantsPlaced);
      if (outputFactor <= 0) {
        return sum;
      }
      return sum + species.oxygenGeneration * outputFactor * 1.4;
    }, 0),
    0,
    18
  );
}

function getBreedingSupportBonus() {
  return clamp(getPlantComfortRelief() * 0.28 + getPlantComfortSupport() * 0.5 + getFilterEfficiency() * 24, 0, 20);
}

function getCo2ConsumptionRate(aquarium = state.aquarium, plants = state.plantsPlaced) {
  return plants.reduce((sum, plant) => sum + getPlantCo2Need(plant) * (plant.vitality / 100), 0);
}

function getCo2ProductionRate(aquarium = state.aquarium) {
  return getCo2MaxLevel(aquarium.co2DeviceLevel);
}

function getOxygenProductionRate(aquarium = state.aquarium, plants = state.plantsPlaced) {
  return plants.reduce((sum, plant) => {
    const outputFactor = getPlantOxygenOutputFactor(plant, aquarium, plants);
    if (outputFactor <= 0) {
      return sum;
    }
    const species = getPlantSpecies(plant.speciesId);
    return sum + species.oxygenGeneration * outputFactor;
  }, 0);
}

function getOxygenConsumptionRate(aquarium = state.aquarium, fishes = getActiveFish()) {
  return fishes.reduce((sum, fish) => sum + getFishOxygenNeed(fish), 0);
}

function getCrowdingRatio() {
  return getActiveFish().length / 10;
}

function getFishComfort(fish) {
  return clamp(numericOr(fish?.comfort, 72), 0, 100);
}

function getFishStressLevel(fish) {
  return 100 - getFishComfort(fish);
}

function getFishDisplayStatus(fish) {
  if (getFishComfort(fish) <= 35) {
    return "Confort faible";
  }
  if (fish.vitality < 45) {
    return "Fragile";
  }
  return "Sain";
}

function getFishHealthLabel(fish) {
  if (fish.vitality >= 80) {
    return "Excellente";
  }
  if (fish.vitality >= 55) {
    return "Stable";
  }
  if (fish.vitality >= 30) {
    return "Fragile";
  }
  return "Critique";
}

function getFishCurrentSizeCm(fish) {
  const species = getSpecies(fish.speciesId);
  const adultSize = numericOr(species.adultSizeCm, 8);
  const growthRatio = clamp(fish.growth, 0, 1);
  return 1 + (adultSize - 1) * growthRatio;
}

function getPreferredPlantSupport(fish) {
  const species = getSpecies(fish.speciesId);
  if (!species?.preferredPlantId) {
    return 0;
  }

  const matchingPlants = state.plantsPlaced
    .filter((plant) => plant.speciesId === species.preferredPlantId)
    .sort((left, right) => right.vitality - left.vitality);

  return clamp(
    matchingPlants.reduce((sum, plant, index) => {
      const plantSpecies = getPlantSpecies(plant.speciesId);
      const vitalityFactor = plant.vitality / 100;
      const presenceFactor = Math.pow(0.58, index);
      return sum + (numericOr(plantSpecies.comfortBonus, 0) + 3) * vitalityFactor * presenceFactor;
    }, 0),
    0,
    15
  );
}

function getFishCompetitionProfile(fish) {
  const species = getSpecies(fish.speciesId);
  const sizeCm = getFishCurrentSizeCm(fish);
  const comfort = getFishComfort(fish);
  return {
    speedScore: fish.speedSkill * 0.62 + comfort * 0.18 + fish.vitality * 0.12 + sizeCm * 1.8,
    reflexScore: fish.reflexSkill * 0.66 + comfort * 0.18 + fish.vitality * 0.1 + Math.max(0, 14 - sizeCm) * 1.2,
    label: species.species,
  };
}

function getPlantCompetitionProfile(plant) {
  const species = getPlantSpecies(plant.speciesId);
  return {
    interceptScore:
      plant.vitality * 0.4 + numericOr(species.contestPresence, 8) * 4 + numericOr(species.fryProtection, 10) * 1.3,
    label: plant.nickname || species.species,
  };
}

function getWeeklyContestKey() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const dayOffset = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start.getTime()) / 86400000);
  const week = Math.floor(dayOffset / 7) + 1;
  return `${now.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getAquariumBeautyScore() {
  const activeFish = getActiveFish();
  if (!activeFish.length && !state.plantsPlaced.length) {
    return 0;
  }

  const fishComfort = activeFish.reduce((sum, fish) => sum + getFishComfort(fish), 0) / Math.max(activeFish.length, 1);
  const fishVariety = new Set(activeFish.map((fish) => fish.speciesId)).size * 5;
  const plantVariety = new Set(state.plantsPlaced.map((plant) => plant.speciesId)).size * 7;
  const plantPresence = state.plantsPlaced.reduce((sum, plant) => sum + plant.vitality / 18, 0);
  const oxygenProduced = getOxygenProductionRate();
  const oxygenConsumed = getOxygenConsumptionRate();
  const oxygenBalanceScore = oxygenConsumed <= 0 ? 100 : clamp((oxygenProduced / oxygenConsumed) * 100, 0, 100);
  return clamp(
    fishComfort * 0.38 +
      state.aquarium.waterQuality * 0.22 +
      oxygenBalanceScore * 0.08 +
      fishVariety +
      plantVariety +
      plantPresence,
    0,
    200
  );
}

function getPlantComfortSupport() {
  return clamp(
    state.plantsPlaced.reduce((sum, plant) => {
      const species = getPlantSpecies(plant.speciesId);
      return sum + numericOr(species.comfortBonus, 0) * (plant.vitality / 100);
    }, 0),
    0,
    26
  );
}

function getDecorComfortSupport() {
  const decorList = Array.isArray(state.decorationsPlaced) ? state.decorationsPlaced : [];
  return clamp(decorList.length * 2, 0, 16);
}

function getPopulationComfortPenalty() {
  return clamp(Math.max(0, getActiveFish().length - 6) * 5.5, 0, 28);
}

function calculateDiseasePressure() {
  return 0;
}

function applyOfflineProgress() {
  if (isOnlineAuthoritativeMode()) {
    return;
  }
  const now = Date.now();
  const elapsedMs = now - (state.lastUpdatedAt || now);
  const elapsedHours = Math.min(elapsedMs / (1000 * 60 * 60), MAX_OFFLINE_HOURS);
  if (elapsedHours <= 0) {
    return;
  }

  const beforeCoins = state.coins;
  let remainingHours = elapsedHours;
  while (remainingHours > 0) {
    const stepHours = Math.min(remainingHours, 0.5);
    simulateAquariumStep(stepHours);
    remainingHours -= stepHours;
  }
  const earnedCoins = Math.max(0, Math.round(state.coins - beforeCoins));

  if (elapsedHours >= 1) {
    state.logs.unshift(createLog(`${formatHours(elapsedHours)} se sont ecoulees. Le port a continue a vivre pendant ton absence.`));
  }
  if (earnedCoins > 0) {
    state.logs.unshift(createLog(`La maintenance passive du bac a rapporte ${earnedCoins} coquillages.`));
  }
}

function renderCycleStatus() {
  if (!els.cycleNumberValue || !els.cycleMinutesValue || !els.cycleTimerValue || !els.advanceCycleBtn) {
    return;
  }
  const cycleState = getCycleState();
  const autoInMs = getCycleRemainingRefreshMs();
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();

  els.cycleNumberValue.textContent = `Cycle ${cycleState.cycleNumber}`;
  els.cycleMinutesValue.textContent = `${cycleState.minutesRemaining} / ${CYCLE_MINUTES} min`;
  els.cycleTimerValue.textContent = onlineBlocked
    ? "Synchronisation serveur en cours..."
    : `Cycle automatique dans ${formatCountdown(autoInMs)}`;
  els.advanceCycleBtn.disabled = onlineBlocked;
  els.advanceCycleBtn.textContent =
    getOnboardingState().step === 8
      ? "Premier cycle gratuit"
      : `Cycle suivant (${CYCLE_ADVANCE_PEARL_COST} perles)`;
  if (els.dailyRewardBtn) {
    const canClaim = canClaimDailyReward();
    els.dailyRewardBtn.disabled = onlineBlocked || !canClaim;
    els.dailyRewardBtn.textContent = canClaim ? "Recompense du jour" : "Recompense recue";
  }
}

function render() {
  applyPendingAutoCycles();
  ensureMissionsForToday();
  renderOnlineSessionButton();
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();
  const aquariumComfort = calculateAquariumComfort();
  const nextLevelXp = state.level * 100;
  const co2Produced = getCo2ProductionRate();
  const co2Consumed = getCo2ConsumptionRate();
  const oxygenProduced = getOxygenProductionRate();
  const oxygenConsumed = getOxygenConsumptionRate();

  els.playerName.textContent = state.playerName;
  els.aquariumName.textContent = state.aquariumName;
  els.coinsValue.textContent = formatNumber(state.coins);
  els.pearlsValue.textContent = formatNumber(state.pearls);
  els.levelValue.textContent = String(state.level);
  els.aquariumCapacityLabel.textContent = `${state.fish.length} poisson${state.fish.length > 1 ? "s" : ""}`;
  els.waterValue.textContent = `${Math.round(state.aquarium.waterQuality)}%`;
  els.comfortValue.textContent = `${Math.round(aquariumComfort)}%`;
  els.temperatureValue.textContent = `${state.aquarium.temperatureTarget.toFixed(1).replace(".", ",")} C`;
  els.co2BalanceValue.textContent = `${co2Consumed.toFixed(1).replace(".", ",")} / ${co2Produced.toFixed(1).replace(".", ",")}`;
  els.oxygenBalanceValue.textContent = `${oxygenConsumed.toFixed(1).replace(".", ",")} / ${oxygenProduced.toFixed(1).replace(".", ",")}`;
  els.phValue.textContent = state.aquarium.phLevel.toFixed(1).replace(".", ",");
  els.tankStateTag.textContent = onlineBlocked
    ? "Sync serveur"
    : aquariumComfort >= 72 && state.aquarium.waterQuality >= 72
      ? "Stable"
      : aquariumComfort >= 52 && state.aquarium.waterQuality >= 55
        ? "Vigilance"
        : "Fragile";
  els.xpLabel.textContent = `${state.xp} / ${nextLevelXp} XP`;
  els.xpBar.style.width = `${Math.min((state.xp / nextLevelXp) * 100, 100)}%`;
  renderCycleStatus();

  renderMissions();
  renderInventoryPanels();
  renderAquariumSwitcher();
  renderFishCards();
  renderPlantCards();
  renderAquariumVisuals();
  renderPlacementPanel();
  renderTankTabs();
  renderInventoryTabs();
  renderShop();

  els.decorateBtn.textContent = runtime.placementMode ? "Quitter plantation" : "Mode plantation";
  els.decorateBtn.disabled = onlineBlocked || (availablePlacements().length === 0 && state.plantsPlaced.length === 0);
  els.breedBtn.textContent = "Essayer une reproduction";
  els.breedBtn.disabled = onlineBlocked || eligibleBreeders().length < 2;
  els.feedAllBtn.disabled = onlineBlocked;
  els.cleanBtn.disabled = onlineBlocked;
  if (els.renameBtn) {
    els.renameBtn.disabled = onlineBlocked;
  }
  if (els.renameAquariumBtn) {
    els.renameAquariumBtn.disabled = onlineBlocked;
  }
  els.tempSlider.min = "20";
  els.tempSlider.max = "30";
  els.tempSlider.value = String(state.aquarium.temperatureTarget);
  els.tempSliderValue.textContent = `${state.aquarium.temperatureTarget.toFixed(1).replace(".", ",")} C`;
  els.tempSliderMin.textContent = "20 C";
  els.tempSliderMax.textContent = "30 C";
  els.tempSlider.disabled = onlineBlocked;
  els.lightSlider.min = "0";
  els.lightSlider.max = String(getLampMaxHours());
  els.lightSlider.value = String(state.aquarium.lightHours);
  els.lightSliderValue.textContent = `${state.aquarium.lightHours} h`;
  els.lightSliderMin.textContent = "0 h";
  els.lightSliderMax.textContent = `${getLampMaxHours()} h`;
  els.lightSlider.disabled = onlineBlocked;
  renderShopTabs();
  renderOnboarding();
}

function renderAquariumSwitcher() {
  const activeBundle = getSelectedAquariumBundle();
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();
  const cards = state.aquariums.map((aquariumBundle) => {
    const fishCount = aquariumBundle.fish.length;
    const plantCount = aquariumBundle.plantsPlaced.length;
    const quality = Math.round(aquariumBundle.aquarium.waterQuality);
    const isActive = aquariumBundle.id === activeBundle?.id;
    return `
      <article class="aquarium-switch-card ${isActive ? "active" : ""}">
        <div class="market-title">
          <strong>${aquariumBundle.name}</strong>
          <span class="tag">Slot ${aquariumBundle.slotIndex}</span>
        </div>
        <div class="aquarium-switch-meta">
          <span>${fishCount} poissons</span>
          <span>${plantCount} plantes</span>
          <span>Eau ${quality}%</span>
        </div>
        <button class="ghost small" data-switch-aquarium="${aquariumBundle.id}" ${(isActive || onlineBlocked) ? "disabled" : ""}>
          ${isActive ? "Actif" : "Ouvrir"}
        </button>
      </article>
    `;
  });

  if (state.aquariums.length < MAX_AQUARIUMS) {
    cards.push(`
      <article class="aquarium-switch-card locked">
        <div class="market-title">
          <strong>Nouveau bassin</strong>
          <span class="tag">${getNextAquariumCost()} perles</span>
        </div>
        <span>Debloque un nouvel aquarium. Le premier est gratuit, les suivants coutent des perles.</span>
        <button class="secondary small" data-buy-aquarium ${onlineBlocked ? "disabled" : ""}>Debloquer</button>
      </article>
    `);
  }

  els.aquariumSwitcher.innerHTML = cards.join("");
  els.aquariumSwitcher.querySelectorAll("[data-switch-aquarium]").forEach((button) => {
    button.addEventListener("click", () => switchAquarium(button.dataset.switchAquarium));
  });
  els.aquariumSwitcher.querySelector("[data-buy-aquarium]")?.addEventListener("click", buyAquariumSlot);
}

function renderMissions() {
  els.missionList.innerHTML = "";
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();

  getActiveMissionDefinitions().forEach((definition) => {
    const entry = state.missionState.entries.find((item) => item.id === definition.id);
    const progress = Math.min(entry?.progress || 0, definition.goal);
    const completed = progress >= definition.goal;
    const wrapper = document.createElement("article");
    wrapper.className = "mission-item";
    wrapper.innerHTML = `
      <div class="market-title">
        <strong>${definition.label}</strong>
        <span class="tag">${progress}/${definition.goal}</span>
      </div>
      <span>Recompense: ${definition.rewardCoins} coquillages, ${definition.rewardPearls} perles</span>
    `;

    const button = document.createElement("button");
    button.className = "ghost small";
    button.textContent = entry?.claimed ? "Recuperee" : completed ? "Recuperer" : "En cours";
    button.disabled = onlineBlocked || !completed || entry?.claimed;
    button.addEventListener("click", () => claimMission(definition.id));
    wrapper.appendChild(button);
    els.missionList.appendChild(wrapper);
  });
}

function renderInventoryPanels() {
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();
  const serverInventoryFish = Array.isArray(state.serverInventoryFish) ? state.serverInventoryFish : [];
  if (isOnlineAuthoritativeMode() && serverInventoryFish.length) {
    els.inventoryFishList.innerHTML = serverInventoryFish
      .map((fish) => {
        const species = getSpecies(fish.species_id);
        return `
          <article class="inventory-item">
            <div class="market-title">
              <strong>${fish.nickname}</strong>
              <span class="tag">${species?.species || fish.species_name || fish.species_id}</span>
            </div>
            <span>Reserve serveur - faim ${Math.round(numericOr(fish.hunger, 100))}% - PDV ${Math.round(numericOr(fish.vitality_points, 10))}/10</span>
            <div class="fish-actions-row">
              <button class="secondary small" data-place-fish="${fish.id}" ${onlineBlocked ? "disabled" : ""}>Placer dans le bac</button>
              <button class="ghost small" data-sell-fish="${fish.id}" ${onlineBlocked ? "disabled" : ""}>Vendre</button>
            </div>
          </article>
        `;
      })
      .join("");
  } else {
    els.inventoryFishList.innerHTML = `
      <div class="empty-state">
        ${isOnlineAuthoritativeMode() ? "Aucun poisson en reserve sur le serveur." : "Les poissons vivent directement dans l'aquarium. Il n'y a pas encore de reserve de poissons."}
      </div>
    `;
  }

  const serverInventoryPlants = Array.isArray(state.serverInventoryPlants) ? state.serverInventoryPlants : [];
  const ownedPlants = getGroupedInventoryPlants();
  if (isOnlineAuthoritativeMode()) {
    if (!serverInventoryPlants.length && state.plantsPlaced.length === 0) {
      els.inventoryPlantList.innerHTML = `<div class="empty-state">Aucune plante possedee pour le moment.</div>`;
    } else {
      els.inventoryPlantList.innerHTML = serverInventoryPlants
        .map((plant) => {
          const species = getPlantSpecies(plant.species_id);
          return `
            <article class="market-card">
              <div class="market-title">
                <div>
                  <strong>${plant.nickname || species.species}</strong>
                  <div class="tag">Plante</div>
                </div>
                <strong>Reserve</strong>
              </div>
              <p class="market-description">${species.description}</p>
              <div class="market-meta">
                <span>${species.biome} - ${species.temperatureMin}-${species.temperatureMax} C - pH ${species.phMin.toFixed(1).replace(".", ",")}-${species.phMax.toFixed(1).replace(".", ",")} - lumiere ${species.lightMin}-${species.lightMax} h - CO2 ${species.co2Need.toFixed(1).replace(".", ",")}</span>
                <span>
                  <button class="secondary small" data-place-plant="${plant.id}" ${onlineBlocked ? "disabled" : ""}>Planter</button>
                  <button class="ghost small" data-sell-plant="${plant.id}" ${onlineBlocked ? "disabled" : ""}>Vendre</button>
                </span>
              </div>
            </article>
          `;
        })
        .join("");
    }
  } else if (!ownedPlants.length && state.plantsPlaced.length === 0) {
    els.inventoryPlantList.innerHTML = `<div class="empty-state">Aucune plante possedee pour le moment.</div>`;
  } else {
    const groupedPlacedPlants = state.plantsPlaced.reduce((map, plant) => {
      const entries = map.get(plant.speciesId) || [];
      entries.push(plant);
      map.set(plant.speciesId, entries);
      return map;
    }, new Map());
    const visibleSpeciesIds = new Set([
      ...ownedPlants.map((entry) => entry.speciesId),
      ...groupedPlacedPlants.keys(),
    ]);
    els.inventoryPlantList.innerHTML = [...visibleSpeciesIds]
      .map((speciesId) => {
        const species = getPlantSpecies(speciesId);
        const reserveCount = getOwnedPlantCount(speciesId);
        const placedPlants = groupedPlacedPlants.get(speciesId) || [];
        const placedCount = placedPlants.length;
        return `
          <article class="market-card">
            <div class="market-title">
              <div>
                <strong>${species.species}</strong>
                <div class="tag">Plante</div>
              </div>
              <strong>${reserveCount} reserve / ${placedCount} plantee${placedCount > 1 ? "s" : ""}</strong>
            </div>
            <p class="market-description">${species.description}</p>
            <div class="market-meta">
              <span>${species.biome} - ${species.temperatureMin}-${species.temperatureMax} C - pH ${species.phMin.toFixed(1).replace(".", ",")}-${species.phMax.toFixed(1).replace(".", ",")} - lumiere ${species.lightMin}-${species.lightMax} h - CO2 ${species.co2Need.toFixed(1).replace(".", ",")}</span>
              <span>
                <button class="secondary small" data-place-plant="${speciesId}" ${(reserveCount > 0 && !onlineBlocked) ? "" : "disabled"}>Planter</button>
                <button class="secondary small" data-return-plant="${placedPlants[0]?.id || ""}" ${(placedCount > 0 && !onlineBlocked) ? "" : "disabled"}>Retirer une</button>
              </span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const utilityItems = [
    { label: "Nourriture", value: `${state.inventory.food} portions`, note: "Utilisee pour nourrir les poissons." },
    {
      label: "Pastilles pH+",
      value: `${state.inventory.phUpTablets}`,
      note: "Augmente le pH de 0,6 a 0,8 selon la pastille utilisee.",
      actionId: "up",
      actionLabel: "Utiliser",
      disabled: state.inventory.phUpTablets <= 0 || state.aquarium.phLevel >= 8.5,
    },
    {
      label: "Pastilles pH-",
      value: `${state.inventory.phDownTablets}`,
      note: "Baisse le pH de 0,6 a 0,8 selon la pastille utilisee.",
      actionId: "down",
      actionLabel: "Utiliser",
      disabled: state.inventory.phDownTablets <= 0 || state.aquarium.phLevel <= 5.5,
    },
    {
      label: "Lampe",
      value: `Niv. ${state.aquarium.lampLevel} - 0 a ${getLampMaxHours()} h`,
      note: getLampProgressSummary(),
    },
    {
      label: "Diffuseur CO2",
      value: `Niv. ${state.aquarium.co2DeviceLevel} - prod. max ${getCo2MaxLevel()}`,
      note: getCo2ProgressSummary(),
    },
    {
      label: "Filtre",
      value: `Niv. ${state.aquarium.filterLevel} - reduit ${Math.round(getFilterEfficiency() * 100)}%`,
      note: getFilterProgressSummary(),
    },
  ];
  els.inventoryUtilityList.innerHTML = utilityItems
    .map(
      (item) => `
        <article class="inventory-item">
          <div class="market-title">
            <strong>${item.label}</strong>
            <span class="tag">${item.value}</span>
          </div>
          <span>${item.note}</span>
          ${item.actionId ? `<button class="secondary small" data-use-ph="${item.actionId}" ${(item.disabled || onlineBlocked) ? "disabled" : ""}>${item.actionLabel}</button>` : ""}
        </article>
      `
    )
    .join("");
  els.inventoryUtilityList.querySelectorAll("[data-use-ph]").forEach((button) => {
    button.addEventListener("click", () => applyPhTablet(button.dataset.usePh));
  });
  els.inventoryFishList.querySelectorAll("[data-place-fish]").forEach((button) => {
    button.addEventListener("click", () => placeFishFromInventory(button.dataset.placeFish));
  });
  els.inventoryFishList.querySelectorAll("[data-sell-fish]").forEach((button) => {
    button.addEventListener("click", () => sellFish(button.dataset.sellFish));
  });

  els.inventoryDecorList.innerHTML = `
    <div class="empty-state">
      Les decors reviendront plus tard. L'onglet est pret pour accueillir pierres, racines et objets de scene.
    </div>
  `;

  els.inventoryPlantList.querySelectorAll("[data-return-plant]").forEach((button) => {
    button.addEventListener("click", () => returnPlantToInventory(button.dataset.returnPlant));
  });
  els.inventoryPlantList.querySelectorAll("[data-place-plant]").forEach((button) => {
    button.addEventListener("click", () => openPlantPlacement(button.dataset.placePlant));
  });
  els.inventoryPlantList.querySelectorAll("[data-sell-plant]").forEach((button) => {
    button.addEventListener("click", () => sellPlant(button.dataset.sellPlant));
  });
}

function renderFishCards() {
  els.fishList.innerHTML = "";
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();
  if (state.fish.length === 0) {
    els.fishList.innerHTML = `<div class="empty-state">Ton aquarium est vide. Adopte un poisson gratuit dans la boutique pour demarrer.</div>`;
    return;
  }
  state.fish.forEach((fish) => {
    const species = getSpecies(fish.speciesId);
    const preferredPlant = species.preferredPlantId ? getPlantSpecies(species.preferredPlantId) : null;
    const careState = getFishCareState(fish);
    const node = els.fishTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".fish-species").textContent = species.species;
    node.querySelector(".fish-name").textContent = fish.nickname;
    node.querySelector(".fish-meta").textContent = `${isFishAdult(fish) ? "Adulte" : "Jeune"} - ${careState.label}`;

    const meterGrid = node.querySelector(".meter-grid");
    [
      ["Faim", fish.hunger],
      ["Confort", getFishComfort(fish)],
      ["Croissance", fish.growth * 100],
      ["Longevite", fish.longevity],
    ].forEach(([label, value]) => {
      const meter = document.createElement("div");
      meter.className = "meter";
      meter.innerHTML = `
        <label>${label}</label>
        <div class="meter-track">
          <div class="meter-fill" style="width:${clamp(value, 0, 100)}%"></div>
        </div>
      `;
      meterGrid.appendChild(meter);
    });

    const sellButton = node.querySelector(".sell-fish-btn");
    sellButton.disabled = onlineBlocked;
    sellButton.addEventListener("click", () => sellFish(fish.id));
    const status = document.createElement("div");
    status.className = "fish-health-line";
    status.textContent = careState.detail;
    node.appendChild(status);
    const needs = document.createElement("div");
    needs.className = "fish-health-line";
    needs.textContent = `Besoins: ${getFishNeedSummary(species)} - plante preferee: ${preferredPlant?.species || "Aucune"}`;
    node.appendChild(needs);
    const profile = document.createElement("div");
    profile.className = "fish-health-line";
    profile.innerHTML = renderInfoChipRow(getFishProfileBadges(species));
    node.appendChild(profile);
    const profileLine = document.createElement("div");
    profileLine.className = "fish-health-line";
    profileLine.textContent = `Sante ${getFishHealthLabel(fish)} - taille ${getFishCurrentSizeCm(fish).toFixed(1).replace(".", ",")} cm / ${species.adultSizeCm} cm`;
    node.appendChild(profileLine);
    els.fishList.appendChild(node);
  });
}

function renderPlantCards() {
  els.plantList.innerHTML = "";
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();
  if (state.plantsPlaced.length === 0) {
    els.plantList.innerHTML = `<div class="empty-state">Aucune plante dans ce bac pour le moment.</div>`;
    return;
  }

  state.plantsPlaced.forEach((plant) => {
    const species = getPlantSpecies(plant.speciesId);
    const careState = getPlantCareState(plant);
    const node = document.createElement("article");
    const depthLabel = plant.depth === DEPTH_FRONT ? "Avant" : "Milieu";
    node.className = "fish-card";
    node.innerHTML = `
      <div class="fish-card-top">
        <div>
          <p class="fish-species">Plante</p>
          <h3 class="fish-name">${plant.nickname || species.species}</h3>
        </div>
        <span class="tag">${depthLabel}</span>
      </div>
      <div class="fish-meta">${careState.label} - profondeur ${depthLabel}</div>
      <div class="fish-health-line">${careState.detail}</div>
      <div class="fish-health-line">Besoins: ${getPlantNeedSummary(species)}</div>
      <div class="fish-health-line">${renderInfoChipRow(getPlantProfileBadges(species))}</div>
      <div class="fish-health-line">Effet: ${getPlantOxygenLabel(species)} - protection alevins ${species.fryProtection || 0}</div>
    `;
    const actions = document.createElement("div");
    actions.className = "fish-actions-row";
    const moveBtn = document.createElement("button");
    moveBtn.className = "ghost small";
    moveBtn.textContent = "Deplacer";
    moveBtn.disabled = onlineBlocked;
    moveBtn.addEventListener("click", () => openPlantMove(plant.id));
    const returnBtn = document.createElement("button");
    returnBtn.className = "ghost small";
    returnBtn.textContent = "Retirer";
    returnBtn.disabled = onlineBlocked;
    returnBtn.addEventListener("click", () => returnPlantToInventory(plant.id));
    actions.append(moveBtn, returnBtn);
    const sellBtn = document.createElement("button");
    sellBtn.className = "ghost small";
    sellBtn.textContent = "Vendre";
    sellBtn.disabled = onlineBlocked;
    sellBtn.addEventListener("click", () => sellPlant(plant.id));
    actions.append(sellBtn);
    node.appendChild(actions);
    els.plantList.appendChild(node);
  });
}

function renderAquariumVisuals() {
  syncDecorNodes();
  syncFishActors();
}

function createPlacementKey(category, id) {
  return `${category}:${id}`;
}

function parsePlacementKey(key) {
  const [category, id] = String(key || "").split(":");
  if (!category || !id) {
    return null;
  }
  return { category, id };
}

function availablePlacements() {
  if (isOnlineAuthoritativeMode()) {
    return (Array.isArray(state.serverInventoryPlants) ? state.serverInventoryPlants : []).map((plant) => ({
      key: createPlacementKey("plant-instance", plant.id),
      category: "plant-instance",
      id: plant.id,
      speciesId: plant.species_id,
      label: `${plant.nickname || getPlantSpecies(plant.species_id)?.species || plant.species_id}`,
    }));
  }
  return [
    ...getGroupedInventoryPlants().map((entry) => ({
        key: createPlacementKey("plant", entry.speciesId),
        category: "plant",
        id: entry.speciesId,
        label: `${getPlantSpecies(entry.speciesId)?.species || entry.speciesId} x${entry.reserveCount}`,
      })),
  ];
}

function selectPlantForMove(plantId) {
  const plant = state.plantsPlaced.find((entry) => entry.id === plantId);
  if (!plant) {
    return;
  }

  runtime.movingPlantId = plant.id;
  runtime.selectedPlacementKey = createPlacementKey(isOnlineAuthoritativeMode() ? "plant-instance" : "plant", plant.id);
  runtime.selectedDepth = normalizePlantDepth(plant.depth);
  renderPlacementPanel();
}

function openPlantPlacement(plantId) {
  if (isOnlineAuthoritativeMode()) {
    const onlinePlant = (state.serverInventoryPlants || []).find((entry) => entry.id === plantId);
    if (!onlinePlant) {
      return;
    }
    runtime.placementMode = true;
    runtime.movingPlantId = null;
    runtime.selectedPlacementKey = createPlacementKey("plant-instance", plantId);
    runtime.selectedDepth = DEPTH_MID;
    runtime.tankTab = "overview";
    els.placementCursor.hidden = false;
    render();
    toast("Clique dans l'aquarium pour planter cet exemplaire.");
    return;
  }
  if (getOwnedPlantCount(plantId) <= 0) {
    return;
  }
  runtime.placementMode = true;
  runtime.movingPlantId = null;
  runtime.selectedPlacementKey = createPlacementKey("plant", plantId);
  runtime.selectedDepth = DEPTH_MID;
  runtime.tankTab = "overview";
  els.placementCursor.hidden = false;
  render();
  toast("Clique dans l'aquarium pour planter cet exemplaire.");
}

function openPlantMove(plantId) {
  runtime.placementMode = true;
  runtime.tankTab = "overview";
  els.placementCursor.hidden = false;
  selectPlantForMove(plantId);
  render();
  toast("Clique dans l'aquarium pour replacer cette plante.");
}

async function returnPlantToInventory(plantId) {
  const plant = state.plantsPlaced.find((entry) => entry.id === plantId);
  if (!plant) {
    return;
  }
  if (
    await runServerBridgeAction(
      (bridge) => bridge.togglePlantPlacement(plantId, null, plant.depth, plant.x),
      "La plante rejoint l'inventaire."
    )
  ) {
    return;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.returnPlant, "le retrait d'une plante")) {
    return;
  }

  state.plantsPlaced = state.plantsPlaced.filter((entry) => entry.id !== plantId);
  addPlantToInventory(plant.speciesId);
  if (runtime.movingPlantId === plantId) {
    runtime.movingPlantId = null;
    runtime.selectedPlacementKey = createPlacementKey("plant", plant.speciesId);
  }
  runtime.placementMode = false;
  els.placementCursor.hidden = true;
  state.logs.unshift(createLog(`${getPlantSpecies(plant.speciesId).species} a ete retiree du bac et remise en reserve.`));
  commit("La plante rejoint l'inventaire.");
}

function applyPlacementPreview(node, placementItem) {
  applyPlantSpriteNode(node, getPlantSpecies(placementItem.speciesId || placementItem.id), 0.42);
  node.classList.add("placement-preview");
}

function renderPlacementPanel() {
  const available = availablePlacements();
  const moveablePlants = state.plantsPlaced.map((plant) => ({
    key: `move:${plant.id}`,
    category: "plant",
    id: plant.speciesId,
    plantId: plant.id,
    label: `Deplacer ${getPlantSpecies(plant.speciesId)?.species || plant.speciesId}`,
  }));
  const actions = [...available, ...moveablePlants];
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();
  els.placementPanel.classList.toggle("active", runtime.placementMode);
  els.sceneHint.hidden = !runtime.placementMode;
  els.placementList.innerHTML = "";
  els.sceneHint.textContent = runtime.movingPlantId
    ? "Clique dans l'aquarium pour repositionner la plante selectionnee."
    : "Choisis une plante a placer, ou clique une plante deja enracinee pour la deplacer.";

  els.placementDepths.forEach((button) => {
    const buttonDepth = normalizePlantDepth(Number(button.dataset.depth));
    button.classList.toggle("active", buttonDepth === runtime.selectedDepth);
  });

  if (actions.length === 0) {
    els.placementList.innerHTML = `<div class="empty-state">Achete une plante pour commencer a amenager le bac.</div>`;
    return;
  }

  actions.forEach((placementItem) => {
    const button = document.createElement("button");
    const isActive =
      placementItem.plantId
        ? runtime.movingPlantId === placementItem.plantId
        : !runtime.movingPlantId && runtime.selectedPlacementKey === placementItem.key;
    button.className = `placement-chip ${isActive ? "active" : ""}`;
    button.disabled = onlineBlocked;
    const preview = document.createElement("span");
    applyPlacementPreview(preview, placementItem);
    const label = document.createElement("span");
    label.textContent = placementItem.label;
    button.append(preview, label);
    button.addEventListener("click", () => {
      if (placementItem.plantId) {
        selectPlantForMove(placementItem.plantId);
        return;
      }
      runtime.movingPlantId = null;
      runtime.selectedPlacementKey = placementItem.key;
      renderPlacementPanel();
    });
    els.placementList.appendChild(button);
  });
}

function getPlantCollisionZone(speciesId, depth) {
  const species = getPlantSpecies(speciesId);
  const sprite = getPlantSpriteConfig(species);
  const sizeScale = species?.sizeScale || 1;
  const height = sprite.displayHeight * sizeScale * 2;
  const scale = depthScale(depth);
  return {
    x: clamp((height / 12) * scale, 5.5, 10.5),
    y: clamp((height / 10) * scale, 7, 14),
  };
}

function getSceneCollisionZone(category, id, depth) {
  return getPlantCollisionZone(id, depth);
}

function scenePlacementCollidesAt(x, y, depth, id, category, ignorePlantId = null) {
  const candidateZone = getSceneCollisionZone(category, id, depth);
  const placedItems = state.plantsPlaced.map((placement) => ({
    category: "plant",
    plantId: placement.id,
    speciesId: placement.speciesId,
    x: placement.x,
    y: placement.y,
    depth: placement.depth,
  }));

  return placedItems.some((placement) => {
    if (ignorePlantId && placement.plantId === ignorePlantId) {
      return false;
    }
    if (placement.depth !== depth) {
      return false;
    }
    const zone = getSceneCollisionZone(placement.category, placement.speciesId, placement.depth);
    const dx = (placement.x - x) / (candidateZone.x + zone.x);
    const dy = (placement.y - y) / (candidateZone.y + zone.y);
    return dx * dx + dy * dy < 1;
  });
}

function syncDecorNodes() {
  els.decorBackLayer.innerHTML = "";
  els.decorMidLayer.innerHTML = "";
  els.decorFrontLayer.innerHTML = "";

  const scenicItems = state.plantsPlaced.map((placement, index) => ({ category: "plant", index, ...placement }));

  scenicItems.forEach((placement) => {
    const node = document.createElement("div");
    const scale = depthScale(placement.depth);
    const brightness = depthBrightness(placement.depth);
    const species = getPlantSpecies(placement.speciesId);
    const floorOffset = getPlantFloorOffset(species, placement.depth);
    applyPlantSpriteNode(node, species);
    node.style.setProperty("--plant-delay", `${placement.index * -0.42}s`);

    node.style.left = `${placement.x}%`;
    node.style.bottom = `calc(${(100 - getPlantSoilY(placement.depth)).toFixed(2)}% - ${floorOffset.toFixed(2)}px)`;
    node.style.opacity = "1";
    node.style.transform = `translateX(-50%) scale(${scale})`;
    node.style.zIndex = String(40 - placement.depth * 10);
    node.style.filter = `brightness(${brightness.toFixed(3)}) contrast(1.03) saturate(1.02)`;
    node.dataset.plantId = placement.id;
    node.style.pointerEvents = runtime.placementMode ? "auto" : "none";
    node.addEventListener("click", (event) => {
      if (!runtime.placementMode) {
        return;
      }
      event.stopPropagation();
      selectPlantForMove(placement.id);
    });

    const targetLayer =
      placement.depth === DEPTH_BACK
        ? els.decorBackLayer
        : placement.depth === DEPTH_MID
          ? els.decorMidLayer
          : els.decorFrontLayer;
    targetLayer.appendChild(node);
  });
}

function syncFishActors() {
  const visibleFish = state.fish;
  const fishIds = new Set(visibleFish.map((fish) => fish.id));

  runtime.fishActors.forEach((actor, fishId) => {
    if (!fishIds.has(fishId)) {
      actor.node.remove();
      runtime.fishActors.delete(fishId);
    }
  });

  visibleFish.forEach((fish) => {
    const species = getSpecies(fish.speciesId);
    let actor = runtime.fishActors.get(fish.id);
    if (!actor) {
      actor = createFishActor(fish);
      actor.node = createFishSpriteNode(species, "fish-sprite");
      els.fishLayer.appendChild(actor.node);
      runtime.fishActors.set(fish.id, actor);
    }
    actor.speciesId = fish.speciesId;
    actor.hunger = fish.hunger;
    actor.comfort = getFishComfort(fish);
    actor.spriteDirection = getFishSpriteConfig(species).direction;
    applyFishSpriteNode(actor.node, species, "fish-sprite");
  });
}

function createFishSpriteNode(species, className) {
  const node = document.createElement("div");
  node.setAttribute("aria-hidden", "true");
  node.innerHTML = `
    <span class="fish-tail"></span>
    <span class="fish-body"></span>
  `;
  applyFishSpriteNode(node, species, className);
  setFishMotionState(node, className === "hero-fish" ? 0.45 : 0.32, Math.random() * Math.PI * 2, false);
  return node;
}

function renderShop() {
  const onlineBlocked = isOnlineAuthoritativeMode() && !isOnlineCoreReady();
  els.shopFishList.innerHTML = SPECIES.map(
    (species) => `
      <article class="market-card">
        <div class="market-title">
          <div>
            <strong>${species.species}</strong>
            <div class="tag">${species.rarity}</div>
          </div>
          <strong>${species.cost} c</strong>
        </div>
        <p class="market-description">${species.description}</p>
        <div class="market-meta">
          <span>${species.biome} - ${getFishNeedSummary(species)}</span>
          <button class="secondary small" data-buy-fish="${species.id}" ${(state.level < species.unlockLevel || onlineBlocked) ? "disabled" : ""}>${state.level < species.unlockLevel ? `Niv. ${species.unlockLevel}` : "Adopter"}</button>
        </div>
        <div class="market-submeta">${renderInfoChipRow(getFishProfileBadges(species))}</div>
      </article>
    `
  ).join("");

  const plantItems = SHOP_ITEMS.filter((item) => item.type === "plant");
  const utilityItems = SHOP_ITEMS.filter((item) => item.type !== "plant" && item.type !== "water");

  const renderShopItemCard = (item) => {
    const plant = item.type === "plant" ? getPlantSpecies(item.plantType) : null;
    const tag = item.type === "plant" ? "Plante" : "Utilitaire";
    const metaLabel =
      item.type === "plant" && plant
        ? `${item.tier} - ${getPlantNeedSummary(plant)}`
        : item.type === "lamp"
          ? `${item.tier} - niveau ${item.level} - 0 a ${getLampMaxHours(item.level)} h`
          : item.type === "co2"
            ? `${item.tier} - niveau ${item.level} - prod. max ${getCo2MaxLevel(item.level)}`
            : item.type === "filter"
              ? `${item.tier} - niveau ${item.level} - reduit ${Math.round(getFilterEfficiencyByLevel(item.level) * 100)}%`
            : item.type === "ph-up" || item.type === "ph-down"
              ? `${item.tier} - ${item.amount} pastilles`
              : `${item.tier} - pack`;
    const ownedCount = item.type === "plant" ? getOwnedPlantCount(item.plantType) : 0;
    const disabled =
      (item.type === "lamp" && numericOr(state.aquarium.lampLevel, 1) >= numericOr(item.level, 1)) ||
      (item.type === "co2" && numericOr(state.aquarium.co2DeviceLevel, 1) >= numericOr(item.level, 1)) ||
      (item.type === "filter" && numericOr(state.aquarium.filterLevel, 1) >= numericOr(item.level, 1));

    return `
      <article class="market-card">
        <div class="market-title">
          <div>
            <strong>${item.name}</strong>
            <div class="tag">${tag}</div>
          </div>
          <strong>${item.cost} c</strong>
        </div>
        <p class="market-description">${item.description}</p>
        <div class="market-meta">
          <span>${metaLabel}${item.type === "plant" ? ` - stock ${ownedCount}` : ""}</span>
          <button class="secondary small" data-buy-item="${item.id}" ${(disabled || onlineBlocked) ? "disabled" : ""}>${disabled ? "Deja equipe" : "Acheter"}</button>
        </div>
        ${item.type === "plant" && plant ? `<div class="market-submeta">${renderInfoChipRow(getPlantProfileBadges(plant))}</div>` : ""}
      </article>
    `;
  };

  els.shopPlantList.innerHTML = plantItems.length
    ? plantItems.map(renderShopItemCard).join("")
    : `<div class="empty-state">Aucune plante disponible pour le moment.</div>`;

  els.shopUtilityList.innerHTML = utilityItems.length
    ? utilityItems.map(renderShopItemCard).join("")
    : `<div class="empty-state">Aucun utilitaire disponible pour le moment.</div>`;

  els.shopDecorList.innerHTML = `
    <div class="empty-state">
      La categorie decors arrive plus tard. Elle accueillera roches, racines et objets de scene.
    </div>
  `;

  els.shopFishList.querySelectorAll("[data-buy-fish]").forEach((button) => {
    button.addEventListener("click", () => buyFish(button.dataset.buyFish));
  });

  [els.shopPlantList, els.shopUtilityList].forEach((container) => {
    container.querySelectorAll("[data-buy-item]").forEach((button) => {
      button.addEventListener("click", () => buyItem(button.dataset.buyItem));
    });
  });
}

function renderShopTabs() {
  els.shopTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.shopTab === runtime.shopTab);
  });
  els.shopPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.shopPanel === runtime.shopTab);
  });
}

function renderInventoryTabs() {
  els.inventoryTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.inventoryTab === runtime.inventoryTab);
  });
  els.inventoryPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.inventoryPanel === runtime.inventoryTab);
  });
}

function renderTankTabs() {
  els.tankTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tankTab === runtime.tankTab);
  });
  els.tankPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tankPanel === runtime.tankTab);
  });
}

function getEligibleCompetitionFish() {
  const todayKey = getTodayKey();
  return getActiveFish().filter((fish) => fish.lastCompetitionDateKey !== todayKey);
}

function getEligibleCompetitionPlants() {
  const todayKey = getTodayKey();
  return state.plantsPlaced.filter((plant) => plant.lastCompetitionDateKey !== todayKey);
}

function depthScale(depth) {
  const normalizedDepth = clamp(depth, DEPTH_FRONT, DEPTH_BACK);
  return 1 - (normalizedDepth - DEPTH_FRONT) * 0.15;
}

function depthBrightness(depth) {
  const normalizedDepth = clamp(depth, DEPTH_FRONT, DEPTH_BACK);
  return 1 - (normalizedDepth - DEPTH_FRONT) * 0.25;
}

function depthOpacity(depth) {
  const perspective = (DEPTH_BACK - clamp(depth, DEPTH_FRONT, DEPTH_BACK)) / (DEPTH_BACK - DEPTH_FRONT);
  return 0.38 + perspective * 0.44;
}

function resolveDepthLevelTarget(actor, desiredDepth = actor.behaviorProfile.preferredDepthLevel) {
  const desiredLevel = clamp(Math.round(desiredDepth), DEPTH_FRONT, DEPTH_BACK);
  const currentLevel = clamp(Math.round(actor.depthLevel ?? actor.targetDepth ?? actor.depth), DEPTH_FRONT, DEPTH_BACK);

  if (desiredLevel === currentLevel) {
    return currentLevel;
  }

  return currentLevel + Math.sign(desiredLevel - currentLevel);
}

function tryScheduleDepthShift(actor, desiredDepth = actor.behaviorProfile.preferredDepthLevel, force = false) {
  const isTransitioning = Math.abs(actor.depth - actor.targetDepth) > 0.06;
  if (!force && (actor.depthChangeCooldown > 0 || isTransitioning)) {
    return;
  }

  const nextLevel = resolveDepthLevelTarget(actor, desiredDepth);
  if (nextLevel === actor.depthLevel) {
    return;
  }

  actor.depthLevel = nextLevel;
  actor.targetDepth = nextLevel;
  actor.depthChangeCooldown = 1.9 + Math.random() * 2.6;
}

function chooseFishTarget(actor) {
  const profile = actor.behaviorProfile;
  if (actor.behavior === "hover") {
    actor.targetX = clamp(actor.anchorX + (Math.random() - 0.5) * 3, actor.zone.minX, actor.zone.maxX);
    actor.targetY = clamp(actor.anchorY + (Math.random() - 0.5) * 2.2, actor.zone.minY, actor.zone.maxY);
    if (Math.random() < 0.22) {
      tryScheduleDepthShift(actor, profile.preferredDepthLevel);
    }
    actor.targetCooldown = 1 + Math.random() * 1.8;
    return;
  }

  if (actor.behavior === "inspect") {
    const decorPoint = getDecorInterestPoint();
    if (decorPoint) {
      actor.targetX = clamp(decorPoint.x, actor.zone.minX, actor.zone.maxX);
      actor.targetY = clamp(decorPoint.y, actor.zone.minY, actor.zone.maxY);
      tryScheduleDepthShift(actor, decorPoint.depth);
      actor.targetCooldown = 1.8 + Math.random() * 2.4;
      return;
    }
  }

  actor.targetX = clamp(actor.anchorX + (Math.random() - 0.5) * 18, actor.zone.minX, actor.zone.maxX);
  actor.targetY = clamp(
    actor.anchorY + (Math.random() - 0.5) * (profile.verticalRange + 4),
    actor.zone.minY,
    actor.zone.maxY
  );
  if (Math.random() < 0.34) {
    const desiredDepth = clamp(
      profile.preferredDepthLevel + (Math.random() < 0.55 ? (Math.random() > 0.5 ? 1 : -1) : 0),
      DEPTH_FRONT,
      DEPTH_BACK
    );
    tryScheduleDepthShift(actor, desiredDepth);
  }
  actor.targetCooldown = 2.4 + Math.random() * 3.8;
}

function animateScene(timestamp) {
  if (!runtime.lastTick) {
    runtime.lastTick = timestamp;
  }
  const dt = Math.min((timestamp - runtime.lastTick) / 16.666, 2.2);
  runtime.lastTick = timestamp;

  updateFoodScene(dt);
  updateFishScene(dt, timestamp);
  updateBubbleScene(dt, timestamp);

  runtime.animationFrameId = window.requestAnimationFrame(animateScene);
}

function updateFishScene(dt, timestamp) {
  const actors = Array.from(runtime.fishActors.values());
  actors.forEach((actor) => {
    const profile = actor.behaviorProfile;
    actor.behaviorTimer -= dt / 60;
    actor.targetCooldown -= dt / 60;
    actor.depthChangeCooldown -= dt / 60;
    actor.foodFocusTimer = Math.max((actor.foodFocusTimer || 0) - dt / 60, 0);

    if (actor.behaviorTimer <= 0) {
      chooseFishBehavior(actor);
    }

    if (actor.targetCooldown <= 0 || distance(actor.x, actor.y, actor.targetX, actor.targetY) < 3) {
      chooseFishTarget(actor);
    }

    let ax = (actor.targetX - actor.x) * 0.00065;
    let ay = (actor.targetY - actor.y) * 0.00055;
    const wantsFood = actor.foodFocusTimer > 0 || actor.hunger < 88 || actor.comfort < 54;
    const foodTarget = wantsFood ? findNearestFoodParticle(actor) : null;

    const pursuingFood = Boolean(foodTarget && actor.hunger < 96);

    if (pursuingFood) {
      const chaseMinY = actor.foodFocusTimer > 0 ? 8 : actor.zone.minY;
      const chaseMaxY = actor.foodFocusTimer > 0 ? 86 : actor.zone.maxY;
      actor.targetX = clamp(foodTarget.x, 6, 94);
      actor.targetY = clamp(foodTarget.y + (foodTarget.settled ? 1.5 : 3), chaseMinY, chaseMaxY);
      actor.targetCooldown = Math.max(actor.targetCooldown, 0.5);
      if (actor.depthChangeCooldown <= 0) {
        tryScheduleDepthShift(actor, foodTarget.depth);
      }

      const foodPull = actor.foodFocusTimer > 0 ? 0.00245 : 0.00145;
      ax += (foodTarget.x - actor.x) * foodPull;
      ay += (foodTarget.y - actor.y) * (foodPull * 1.08);
      actor.preferredSpeed = Math.max(actor.preferredSpeed, profile.baseSpeed * (actor.foodFocusTimer > 0 ? 1.6 : 1.2));

      if (distance(actor.x, actor.y, foodTarget.x, foodTarget.y) < 4.2 && Math.abs(actor.depth - foodTarget.depth) < 0.55) {
        consumeFoodParticle(actor, foodTarget);
        actor.foodFocusTimer = Math.max(actor.foodFocusTimer - 0.8, 0);
      }
    }

    if (actor.behavior === "hover" && actor.foodFocusTimer <= 0) {
      ax *= 0.42;
      ay *= 0.42;
    }
    if (actor.behavior === "inspect" && actor.foodFocusTimer <= 0) {
      ax *= 0.78;
      ay *= 0.74;
    }

    actors.forEach((other) => {
      if (other === actor) {
        return;
      }
      const dx = actor.x - other.x;
      const dy = actor.y - other.y;
      const distSq = dx * dx + dy * dy;
      const sameSpecies = other.speciesId === actor.speciesId;
      const separationDistance = sameSpecies ? 70 : 90;

      if (distSq > 0 && distSq < separationDistance) {
        const separationStrength =
          profile.sociability === "territorial"
            ? 0.0009
            : profile.sociability === "solitary"
              ? 0.00072
              : 0.00048;
        ax += dx * separationStrength;
        ay += dy * separationStrength * 0.85;
      }

      if (sameSpecies && distSq > 30 && distSq < 280) {
        if (profile.sociability === "shoaling" || profile.sociability === "grouped") {
          ax -= dx * 0.00016;
          ay -= dy * 0.00013;
        }
        if (profile.sociability === "paired") {
          ax -= dx * 0.00009;
          ay -= dy * 0.00007;
        }
      }
    });

    const laneCenterY = (actor.zone.minY + actor.zone.maxY) / 2;
    ay += (laneCenterY - actor.y) * (pursuingFood ? 0.00003 : 0.00014);

    if (actor.x < 8) {
      ax += 0.016;
    }
    if (actor.x > 92) {
      ax -= 0.016;
    }
    if (actor.y < 10) {
      ay += 0.012;
    }
    if (actor.y > 86) {
      ay -= 0.012;
    }

    const speedLimit =
      actor.behavior === "hover"
        ? profile.baseSpeed * 0.8
        : actor.behavior === "inspect"
          ? profile.baseSpeed * 1.1
          : profile.baseSpeed * 1.8;
    actor.vx = clamp(actor.vx + ax * dt, -speedLimit, speedLimit);
    actor.vy = clamp(actor.vy + ay * dt, -speedLimit * 0.55, speedLimit * 0.55);

    const dampingX = actor.behavior === "hover" ? 0.964 : actor.behavior === "inspect" ? 0.978 : 0.986;
    const dampingY = actor.behavior === "hover" ? 0.952 : actor.behavior === "inspect" ? 0.968 : 0.98;
    actor.vx *= dampingX;
    actor.vy *= dampingY;

    const currentSpeed = Math.sqrt(actor.vx * actor.vx + actor.vy * actor.vy);
    if (currentSpeed > actor.preferredSpeed) {
      const speedScale = actor.preferredSpeed / currentSpeed;
      actor.vx *= 0.88 + speedScale * 0.12;
      actor.vy *= 0.88 + speedScale * 0.12;
    }

    actor.x = clamp(actor.x + actor.vx * dt, 4, 96);
    actor.y = clamp(
      actor.y +
        actor.vy * dt +
        Math.sin(timestamp * 0.00045 + actor.phase) * (actor.behavior === "hover" ? 0.004 : 0.006),
      8,
      88
    );
    actor.depth = clamp(
      actor.depth + (actor.targetDepth - actor.depth) * (actor.behavior === "hover" ? 0.003 : 0.005) * dt,
      DEPTH_FRONT,
      DEPTH_BACK
    );
    if (Math.abs(actor.depth - actor.targetDepth) < 0.02) {
      actor.depth = actor.targetDepth;
    }

    if (Math.abs(actor.vx) > 0.004) {
      actor.facing = actor.vx >= 0 ? 1 : -1;
    }

    const steeringEffort = clamp((Math.abs(ax) + Math.abs(ay)) * 20, 0, 1);
    const swimEffort = clamp(
      Math.max(currentSpeed / Math.max(profile.baseSpeed * 1.35, 0.001), steeringEffort * 0.9),
      0,
      1
    );
    actor.swimEffort += (swimEffort - actor.swimEffort) * 0.14 * dt;
    setFishMotionState(actor.node, actor.swimEffort, actor.phase, actor.behavior === "hover");

    const bodyWobble = actor.behavior === "hover" ? 0.985 + Math.sin(timestamp * 0.001 + actor.phase) * 0.01 : 1;
    const scale = depthScale(actor.depth);
    const brightness = depthBrightness(actor.depth);
    const direction = actor.facing * actor.spriteDirection;
    const depthSlot = DEPTH_BACK - Math.round(actor.depth) + 1;
    actor.node.style.left = `${actor.x}%`;
    actor.node.style.top = `${actor.y}%`;
    actor.node.style.opacity = "1";
    actor.node.style.zIndex = `${depthSlot * 10 + Math.round(actor.y / 12)}`;
    actor.node.style.transform = `translate(-50%, -50%) scale(${direction * scale}, ${scale * bodyWobble})`;
    actor.node.style.filter = `brightness(${brightness.toFixed(3)}) drop-shadow(0 6px 12px rgba(4, 21, 37, 0.18))`;
  });
}

function updateBubbleScene(dt, timestamp) {
  const sceneKey = buildBubbleSceneKey();
  if (runtime.bubbleActors.length === 0 || runtime.bubbleSceneKey !== sceneKey) {
    createBubbleLayers();
  }

  runtime.bubbleActors.forEach((actor) => {
    if (actor.respawnDelay > 0) {
      actor.respawnDelay -= dt / 60;
      if (actor.respawnDelay <= 0) {
        spawnBubbleActor(actor);
      } else {
        actor.node.style.opacity = "0";
      }
      return;
    }

    actor.y -= actor.speed * 0.018 * dt;
    if (actor.y < -12) {
      scheduleBubbleRespawn(actor);
      actor.node.style.opacity = "0";
      return;
    }
    const scale = depthScale(actor.depth) * actor.scaleBase;
    actor.node.style.left = `${actor.x}%`;
    actor.node.style.top = `${actor.y}%`;
    actor.node.style.opacity = `${depthOpacity(actor.depth) * actor.opacityBase}`;
    actor.node.style.transform = `translate(-50%, -50%) scale(${scale})`;
  });
}

function createBubbleLayers() {
  runtime.bubbleSceneKey = buildBubbleSceneKey();
  runtime.bubbleActors = [];
  [els.bubbleBackLayer, els.bubbleMidLayer, els.bubbleFrontLayer].forEach((layer) => {
    layer.innerHTML = "";
  });

  const aeratorEmitters = [
    createAeratorBubbleEmitter(16, DEPTH_BACK, 7, 1.6),
    createAeratorBubbleEmitter(84, DEPTH_MID, 8, 1.8),
  ];

  aeratorEmitters.forEach((emitter) => {
    for (let index = 0; index < emitter.count; index += 1) {
      const actor = createBubbleActor(emitter.depth);
      actor.sourceType = "aerator";
      actor.emitter = emitter;
      const node = document.createElement("span");
      node.className = "bubble-particle";
      actor.node = node;
      getBubbleLayerByDepth(emitter.depth).appendChild(node);
      spawnBubbleActor(actor);
      actor.y += index * 8.4;
      runtime.bubbleActors.push(actor);
    }
  });

  state.plantsPlaced.forEach((plant) => {
    const species = getPlantSpecies(plant.speciesId);
    const plantBubbleCount = species.oxygenGeneration >= 1.4 ? 3 : species.oxygenGeneration >= 1 ? 2 : 1;
    for (let index = 0; index < plantBubbleCount; index += 1) {
      const actor = createBubbleActor(plant.depth);
      actor.sourceType = "plant";
      actor.plantId = plant.id;
      actor.emitter = null;
      const node = document.createElement("span");
      node.className = "bubble-particle micro";
      actor.node = node;
      getBubbleLayerByDepth(plant.depth).appendChild(node);
      spawnBubbleActor(actor);
      actor.respawnDelay = index === 0 ? 0.8 + Math.random() * 2.1 : 2.1 + Math.random() * 4.2;
      actor.node.style.opacity = "0";
      runtime.bubbleActors.push(actor);
    }
  });
}

function updatePlacementCursor(event) {
  if (!runtime.placementMode || !runtime.selectedPlacementKey) {
    els.placementCursor.hidden = true;
    return;
  }

  const rect = els.aquariumStage.getBoundingClientRect();
  const xPercent = clamp(((event.clientX - rect.left) / rect.width) * 100, 6, 94);
  const placementDepth = normalizePlantDepth(runtime.selectedDepth);
  const yPercent = getPlantSoilY(placementDepth);
  const scale = depthScale(placementDepth);
  const brightness = depthBrightness(placementDepth);
  const selection = parsePlacementKey(runtime.selectedPlacementKey);
  const previewSpeciesId =
    selection?.category === "plant-instance"
      ? (
          (state.serverInventoryPlants || []).find((entry) => entry.id === selection.id)?.species_id ||
          state.plantsPlaced.find((entry) => entry.id === selection.id)?.speciesId
        )
      : selection?.id;
  if (!previewSpeciesId) {
    els.placementCursor.hidden = true;
    return;
  }
  const species = getPlantSpecies(previewSpeciesId);
  const floorOffset = getPlantFloorOffset(species, placementDepth);
  const isBlocked = scenePlacementCollidesAt(
    xPercent,
    yPercent,
    placementDepth,
    previewSpeciesId,
    selection.category,
    runtime.movingPlantId
  );

  els.placementCursor.hidden = false;
  if (selection.category === "plant" || selection.category === "plant-instance") {
    applyPlantSpriteNode(els.placementCursor, species);
    const cleanClassName = els.placementCursor.className
      .replace(/\bplacement-cursor\b/g, "")
      .replace(/\binvalid\b/g, "")
      .trim();
    els.placementCursor.className = `placement-cursor ${cleanClassName}${isBlocked ? " invalid" : ""}`.trim();
  }
  els.placementCursor.style.left = `${xPercent}%`;
  els.placementCursor.style.bottom = `calc(${(100 - yPercent).toFixed(2)}% - ${floorOffset.toFixed(2)}px)`;
  els.placementCursor.style.opacity = isBlocked ? "0.42" : "0.88";
  els.placementCursor.style.filter = `${isBlocked ? "grayscale(0.25) " : ""}brightness(${brightness.toFixed(3)}) contrast(1.03) saturate(1.02)`;
  els.placementCursor.style.transform = `translateX(-50%) scale(${scale})`;
}

async function placeSelectedDecor(event) {
  if (!runtime.placementMode || !runtime.selectedPlacementKey) {
    return;
  }

  const rect = els.aquariumStage.getBoundingClientRect();
  const xPercent = clamp(((event.clientX - rect.left) / rect.width) * 100, 6, 94);
  const placementDepth = normalizePlantDepth(runtime.selectedDepth);
  const yPercent = getPlantSoilY(placementDepth);
  const selection = parsePlacementKey(runtime.selectedPlacementKey);
  const movingPlant = runtime.movingPlantId
    ? state.plantsPlaced.find((entry) => entry.id === runtime.movingPlantId)
    : null;
  const selectedSpeciesId =
    movingPlant?.speciesId ||
    (selection?.category === "plant-instance"
      ? (
          (state.serverInventoryPlants || []).find((entry) => entry.id === selection.id)?.species_id ||
          state.plantsPlaced.find((entry) => entry.id === selection.id)?.speciesId
        )
      : selection?.id);
  if (!selectedSpeciesId) {
    toast("Cette plante n'est plus disponible.");
    return;
  }

  if (scenePlacementCollidesAt(xPercent, yPercent, placementDepth, selectedSpeciesId, "plant", runtime.movingPlantId)) {
    toast("Impossible de superposer deux elements de scene sur le meme plan.");
    return;
  }

  const label = getPlantSpecies(selectedSpeciesId).species;
  const wasMoving = Boolean(runtime.movingPlantId);
  if (
    isOnlineAuthoritativeMode() &&
    (await runServerBridgeAction(
      (bridge) =>
        bridge.togglePlantPlacement(
          wasMoving ? runtime.movingPlantId : selection.id,
          state.selectedAquariumId,
          placementDepth,
          xPercent
        ),
      wasMoving ? `${label} a ete deplacee avec succes.` : `${label} a ete placee avec succes.`
    ))
  ) {
    runtime.movingPlantId = null;
    const remaining = availablePlacements();
    if (!wasMoving && remaining.length > 0) {
      runtime.selectedPlacementKey = remaining[0].key;
      runtime.placementMode = true;
      els.placementCursor.hidden = false;
    } else {
      runtime.selectedPlacementKey = null;
      runtime.placementMode = false;
      els.placementCursor.hidden = true;
    }
    renderPlacementPanel();
    if (!wasMoving && getOnboardingState().step === 3 && state.plantsPlaced.length >= 2) {
      await advanceOnboardingTo(4);
    }
    return;
  }
  if (!spendCycleMinutes(wasMoving ? CYCLE_COSTS.movePlant : CYCLE_COSTS.placePlant, wasMoving ? "le deplacement d'une plante" : "la plantation")) {
    return;
  }
  if (wasMoving) {
    state.plantsPlaced = state.plantsPlaced.map((plant) =>
      plant.id === runtime.movingPlantId
        ? { ...plant, x: xPercent, y: getPlantSoilY(placementDepth), depth: placementDepth }
        : plant
    );
  } else {
    if (!removePlantFromInventory(selection.id)) {
      toast("Cet exemplaire n'est plus disponible dans l'inventaire.");
      return;
    }
    state.plantsPlaced.push(createPlacedPlant(selection.id, xPercent, yPercent, placementDepth));
  }

  if (!wasMoving) {
    updateMissionProgress("decorateCount");
    awardXp(18);
    addFeedEntry("Toi", `vient de planter ${label} dans l'aquarium principal.`);
    state.logs.unshift(createLog(`Nouvelle plante placee: ${label}.`));
  } else {
    state.logs.unshift(createLog(`${label} a ete deplacee dans le bac.`));
  }

  const remaining = availablePlacements();
  runtime.movingPlantId = null;
  runtime.selectedPlacementKey = remaining[0]?.key || null;
  if (!runtime.selectedPlacementKey && availablePlacements().length === 0) {
    els.placementCursor.hidden = true;
  }

  commit(wasMoving ? `${label} a ete deplacee avec succes.` : `${label} a ete place avec succes.`);
  if (!wasMoving && getOnboardingState().step === 3 && state.plantsPlaced.length >= 2) {
    await advanceOnboardingTo(4);
  }
}

function distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function calculateAquariumComfort() {
  if (state.fish.length === 0) {
    return 0;
  }
  const totalComfort = state.fish.reduce((sum, fish) => sum + getFishComfort(fish), 0);
  return clamp(totalComfort / state.fish.length, 0, 100);
}

function eligibleBreeders() {
  return state.fish.filter(
    (fish) =>
      isFishAdult(fish) &&
      fish.vitality > 60 &&
      getFishComfort(fish) >= 66 &&
      state.aquarium.waterQuality >= 62
  );
}

function getSpecies(speciesId) {
  return SPECIES.find((entry) => entry.id === speciesId) || SPECIES[0];
}

function plantConditionsMet(plant, aquarium = state.aquarium) {
  const species = getPlantSpecies(plant.speciesId);
  return (
    aquarium.temperature >= species.temperatureMin &&
    aquarium.temperature <= species.temperatureMax &&
    aquarium.waterQuality >= 38 &&
    getPlantPhMismatch(plant, aquarium) <= 0.15
  );
}

function getTotalPlantOxygenRate() {
  return state.plantsPlaced.reduce((sum, plant) => {
    const species = getPlantSpecies(plant.speciesId);
    const outputFactor = getPlantOxygenOutputFactor(plant, state.aquarium, state.plantsPlaced);
    if (outputFactor <= 0) {
      return sum;
    }
    return sum + species.oxygenGeneration * outputFactor;
  }, 0);
}

function fishConditionsMet(fish, aquarium = state.aquarium, fishes = getActiveFish(), plants = state.plantsPlaced) {
  const species = getSpecies(fish.speciesId);
  const correctTemperature =
    aquarium.temperature >= species.temperatureMin && aquarium.temperature <= species.temperatureMax;
  const cleanEnough = aquarium.waterQuality >= 55;
  const phOkay = getFishPhPenalty(fish, aquarium) <= 0.15;
  const oxygenCoverage = getFishOxygenCoverage(fish, aquarium, fishes, plants);
  return correctTemperature && cleanEnough && phOkay && oxygenCoverage >= 0.98;
}

function applyHiddenVitality(fish, hours) {
  const species = getSpecies(fish.speciesId);
  const oxygenDeficit = getFishOxygenDeficit(fish, state.aquarium, state.fish, state.plantsPlaced);
  const conditionsMet = fishConditionsMet(fish, state.aquarium, state.fish, state.plantsPlaced);
  const starving = fish.hunger <= 0;
  const badConditionHours = conditionsMet ? 0 : fish.badConditionHours + hours;
  let vitality = fish.vitality;
  const tempGap =
    state.aquarium.temperature < species.temperatureMin
      ? species.temperatureMin - state.aquarium.temperature
      : state.aquarium.temperature > species.temperatureMax
        ? state.aquarium.temperature - species.temperatureMax
        : 0;
  const comfortSupport =
    getPlantComfortRelief() + getPlantComfortSupport() + getDecorComfortSupport() + getPreferredPlantSupport(fish);
  const crowdingPenalty = getPopulationComfortPenalty();
  const phGap = getFishPhPenalty(fish);
  const comfortTarget = clamp(
    92 -
      (100 - state.aquarium.waterQuality) * 0.58 -
      state.aquarium.foodResidue * 0.42 -
      tempGap * 9.2 -
      oxygenDeficit * 18 -
      phGap * 13 -
      crowdingPenalty -
      state.aquarium.stability * 0.08 +
      comfortSupport,
    0,
    100
  );
  let comfort = clamp(
    getFishComfort(fish) + (comfortTarget - getFishComfort(fish)) * Math.min(1, hours * 0.9),
    0,
    100
  );
  let newcomerHours = Math.max(fish.newcomerHours - hours, 0);

  if (!starving && conditionsMet) {
    vitality = clamp(vitality + hours * HIDDEN_VITALITY_RECOVERY_PER_HOUR, 0, 100);
  } else {
    const damageRate =
      (starving ? 7.2 : 0) +
      tempGap * 2.6 +
      phGap * 9 +
      Math.max(0, 55 - state.aquarium.waterQuality) * 0.08 +
      oxygenDeficit * 18;
    vitality = clamp(vitality - hours * Math.max(2.2, damageRate), 0, 100);
  }

  return {
    ...fish,
    comfort,
    vitality,
    newcomerHours,
    badConditionHours,
  };
}

function applyPlantHiddenVitality(plant, hours) {
  const conditionScore = getPlantConditionScore(plant, state.aquarium, state.plantsPlaced);
  const co2Deficit = getPlantCo2Deficit(plant, state.aquarium, state.plantsPlaced);
  const conditionsMet = plantConditionsMet(plant);
  const badConditionHours = conditionsMet ? 0 : plant.badConditionHours + hours;
  let vitality = plant.vitality;
  const species = getPlantSpecies(plant.speciesId);
  const tempGap =
    state.aquarium.temperature < species.temperatureMin
      ? species.temperatureMin - state.aquarium.temperature
      : state.aquarium.temperature > species.temperatureMax
        ? state.aquarium.temperature - species.temperatureMax
        : 0;
  const lightMismatch = getPlantLightingMismatch(plant);
  const phMismatch = getPlantPhMismatch(plant);

  if (conditionsMet && conditionScore >= 0.95) {
    vitality = clamp(vitality + hours * HIDDEN_VITALITY_RECOVERY_PER_HOUR, 0, 100);
  } else {
    vitality = clamp(
      vitality -
        hours *
          Math.max(
            1.8,
            (1 - conditionScore) * 11 +
            tempGap * 1.8 +
            Math.max(0, 38 - state.aquarium.waterQuality) * 0.06 +
            co2Deficit * 12 +
            lightMismatch * 3.4 +
            phMismatch * 8.5
          ),
      0,
      100
    );
  }

  return {
    ...plant,
    vitality,
    badConditionHours,
  };
}

function simulateAquariumStep(hours) {
  if (isOnlineAuthoritativeMode()) {
    return;
  }
  const event = getCurrentEvent();
  const postStepActiveFish = getActiveFish();
  state.coins += postStepActiveFish.reduce((sum, fish) => {
    const species = getSpecies(fish.speciesId);
    const multiplier = eventAppliesToRare(species) && event.rareIncomeBonus ? event.rareIncomeBonus : 1;
    const wellnessFactor = clamp(getFishComfort(fish) / 100, 0.45, 1.1);
    return sum + (species.income / 30) * hours * multiplier * wellnessFactor;
  }, 0);
  state.aquarium.visitors += Math.random() < 0.24 ? 1 + Math.round((event.decorVisitorBonus || 0) / 6) : 0;
}

function eventAppliesToRare(species) {
  return species.rarity === "Rare" || species.rarity === "Epic" || species.rarity === "Legendaire";
}

function isFishAdult(fish) {
  return fish.growth >= 1 || fish.ageHours >= getSpecies(fish.speciesId).growthHours;
}

function canClaimDailyReward() {
  if (!state.lastRewardAt) {
    return true;
  }
  const last = new Date(state.lastRewardAt).toDateString();
  const today = new Date().toDateString();
  return last !== today;
}

function updateMissionProgress(tracker, amount = 1) {
  if (!(tracker in state.missionState.trackers)) {
    state.missionState.trackers[tracker] = 0;
  }
  state.missionState.trackers[tracker] += amount;
  state.missionState.entries = state.missionState.entries.map((entry) => {
    const definition = getMissionDefinitionById(entry.id);
    if (!definition || definition.tracker !== tracker) {
      return entry;
    }
    return {
      ...entry,
      progress: Math.min(definition.goal, state.missionState.trackers[tracker]),
    };
  });
}

function awardXp(amount) {
  state.xp += amount;
  const target = state.level * 100;
  if (state.xp >= target) {
    state.xp -= target;
    state.level += 1;
    state.coins += 70;
    state.pearls += 5;
    state.logs.unshift(createLog(`Niveau ${state.level} atteint. Le port t'honore pour ton recif.`));
    toast(`Niveau ${state.level} atteint. Bonus: 70 coquillages et 5 perles.`);
  }
}

async function advanceCycle() {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.advanceCycle(state.selectedAquariumId),
      "Le cycle suivant commence immediatement."
    )
  ) {
    if (runtime.lastServerActionSucceeded && getOnboardingState().step === 8) {
      await advanceOnboardingTo(9);
    }
    return;
  }

  applyPendingAutoCycles();
  const isTutorialFreeCycle = getOnboardingState().step === 8;
  if (!isTutorialFreeCycle && state.pearls < CYCLE_ADVANCE_PEARL_COST) {
    toast(`Il faut ${CYCLE_ADVANCE_PEARL_COST} perles pour passer immediatement au cycle suivant.`);
    return;
  }

  if (!isTutorialFreeCycle) {
    state.pearls -= CYCLE_ADVANCE_PEARL_COST;
  }
  applyCycleAdvance(isTutorialFreeCycle ? "tutorial" : "paid");
  if (isTutorialFreeCycle) {
    state.aquarium.phLevel = clamp(state.aquarium.phLevel - 1, 5.5, 8.5);
    persistSelectedAquariumState(state);
  }
  commit("Le cycle suivant commence immediatement.");
  if (getOnboardingState().step === 8) {
    await advanceOnboardingTo(9);
  }
}

async function feedAllFish() {
  const activeFish = getActiveFish();
  if (activeFish.length === 0) {
    toast("Adopte d'abord quelques poissons.");
    return;
  }

  if (
    await runServerBridgeAction(
      (bridge) => bridge.useUtility("food", state.selectedAquariumId),
      "La nourriture tombe dans le bac.",
      { spawnFood: Math.max(1, Math.min(4, activeFish.length)) }
    )
  ) {
    if (runtime.lastServerActionSucceeded && getOnboardingState().step === 7) {
      await advanceOnboardingTo(8);
    }
    return;
  }

  if (state.inventory.food <= 0) {
    toast("Plus de nourriture. Passe par la boutique marine.");
    return;
  }

  const portionsUsed = Math.min(Math.max(1, activeFish.length), state.inventory.food);
  if (!spendCycleMinutes(Math.max(5, portionsUsed * 5), "le nourrissage")) {
    return;
  }
  const averageHunger = activeFish.reduce((sum, fish) => sum + fish.hunger, 0) / activeFish.length;
  const overfeeding = averageHunger > 72 ? (averageHunger - 72) / 28 : 0;
  state.inventory.food -= portionsUsed;
  spawnFoodParticles(portionsUsed);
  if (overfeeding > 0) {
    state.aquarium.foodResidue = clamp(state.aquarium.foodResidue + overfeeding * 8, 0, 100);
    state.aquarium.pollution = clamp(state.aquarium.pollution + overfeeding * 5, 0, 100);
  }
  state.aquarium.feedUsesThisCycle = Math.max(0, Math.round(numericOr(state.aquarium.feedUsesThisCycle, 0))) + 1;
  state.aquarium.visitors += 3;
  updateMissionProgress("feedCount");
  awardXp(14);
  addFeedEntry("Toi", "vient de nourrir tout son aquarium. Les poissons se ruent vers les particules.");
  state.logs.unshift(createLog(`Nourrissage lance: ${portionsUsed} portions. Residus potentiels ${Math.round(overfeeding * 100)}%.`));
  commit("La nourriture tombe dans le bac.");
  if (getOnboardingState().step === 7) {
    await advanceOnboardingTo(8);
  }
}

async function cleanAquarium() {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.cleanAquarium(state.selectedAquariumId),
      "Le changement d'eau a stabilise le bac."
    )
  ) {
    if (runtime.lastServerActionSucceeded && getOnboardingState().step === 9) {
      await advanceOnboardingTo(10);
    }
    return;
  }

  if (!spendCycleMinutes(CYCLE_COSTS.cleanLight, "le nettoyage du bac")) {
    return;
  }
  const before = state.aquarium.waterQuality;
  const waterGain = 18;
  state.aquarium.pollution = clamp(state.aquarium.pollution - waterGain * 0.85, 0, 100);
  state.aquarium.foodResidue = clamp(state.aquarium.foodResidue - waterGain * 0.75, 0, 100);
  state.aquarium.waterQuality = clamp(100 - state.aquarium.pollution, 0, 100);
  state.aquarium.filterCondition = clamp(state.aquarium.filterCondition + 8, 0, 100);
  state.aquarium.oxygenLevel = clamp(state.aquarium.oxygenLevel + 6, 0, 100);
  const gain = Math.round(state.aquarium.waterQuality - before);
  updateMissionProgress("cleanCount");
  awardXp(10);
  state.logs.unshift(createLog(`Nettoyage du bac realise. La qualite de l'eau gagne ${gain} points.`));
  commit("Le changement d'eau a stabilise le bac.");
  if (getOnboardingState().step === 9) {
    await advanceOnboardingTo(10);
  }
}

function oxygenateAquarium() {
  if (!spendCycleMinutes(CYCLE_COSTS.oxygenate, "l'oxygenation du bac")) {
    return;
  }
  state.aquarium.oxygenLevel = clamp(state.aquarium.oxygenLevel + 18, 0, 100);
  state.aquarium.stability = clamp(state.aquarium.stability + 4, 0, 100);
  updateMissionProgress("oxygenCount");
  awardXp(8);
  commit("L'oxygene dissous remonte dans l'aquarium.");
}

async function setTemperatureTarget(nextValue) {
  const targetValue = clamp(numericOr(nextValue, state.aquarium.temperatureTarget), 20, 30);
  if (Math.abs(targetValue - state.aquarium.temperatureTarget) < 0.01) {
    return true;
  }

  if (
    await runServerBridgeAction(
      (bridge) => bridge.updateSetting(state.selectedAquariumId, "temperature", targetValue),
      `Nouvelle temperature cible: ${targetValue.toFixed(1).replace(".", ",")} C.`
    )
  ) {
    return true;
  }

  if (!spendCycleMinutes(CYCLE_COSTS.temperatureStep, "le reglage thermique")) {
    return false;
  }
  state.aquarium.temperatureTarget = targetValue;
  commit(`Nouvelle temperature cible: ${state.aquarium.temperatureTarget.toFixed(1).replace(".", ",")} C.`);
  return true;
}

async function setLightHours(nextValue) {
  const targetValue = clamp(Math.round(numericOr(nextValue, state.aquarium.lightHours)), 0, getLampMaxHours());
  if (targetValue === state.aquarium.lightHours) {
    return true;
  }

  if (
    await runServerBridgeAction(
      (bridge) => bridge.updateSetting(state.selectedAquariumId, "light", targetValue),
      `Nouvelle exposition lumineuse: ${targetValue} h.`
    )
  ) {
    if (runtime.lastServerActionSucceeded && getOnboardingState().step === 4 && targetValue >= 4) {
      await advanceOnboardingTo(5);
    }
    return true;
  }

  if (!spendCycleMinutes(CYCLE_COSTS.lightStep, "le reglage lumineux")) {
    return false;
  }
  state.aquarium.lightHours = targetValue;
  commit(`Nouvelle exposition lumineuse: ${state.aquarium.lightHours} h.`);
  if (getOnboardingState().step === 4 && targetValue >= 4) {
    await advanceOnboardingTo(5);
  }
  return true;
}

function setPhLevel(nextValue, options = {}) {
  const targetValue = clamp(numericOr(nextValue, state.aquarium.phLevel), 5.5, 8.5);
  const tabletCount = Math.max(1, Math.round(numericOr(options.tabletCount, 1)));
  const inventoryKey =
    options.inventoryKey || (targetValue > state.aquarium.phLevel ? "phUpTablets" : "phDownTablets");
  const label = options.label || (targetValue > state.aquarium.phLevel ? "pastille pH+" : "pastille pH-");
  if (Math.abs(targetValue - state.aquarium.phLevel) < 0.01) {
    return true;
  }
  if (state.inventory[inventoryKey] < tabletCount) {
    toast(`Il faut ${tabletCount} ${label}${tabletCount > 1 ? "s" : ""} pour atteindre cette valeur.`);
    return false;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.phStep, "l'ajustement du pH")) {
    return false;
  }
  state.inventory[inventoryKey] -= tabletCount;
  state.aquarium.phLevel = targetValue;
  commit(`Le pH est maintenant a ${state.aquarium.phLevel.toFixed(1).replace(".", ",")}.`);
  return true;
}

async function applyPhTablet(direction) {
  const normalizedDirection = direction === "up" ? "up" : "down";
  if (
    await runServerBridgeAction(
      (bridge) => bridge.useUtility(normalizedDirection === "up" ? "ph-up" : "ph-down", state.selectedAquariumId),
      normalizedDirection === "up" ? "Le pH remonte legerement." : "Le pH baisse legerement."
    )
  ) {
    if (
      runtime.lastServerActionSucceeded &&
      normalizedDirection === "up" &&
      getOnboardingState().step === 11 &&
      Math.abs(state.aquarium.phLevel - 7.1) < 0.05
    ) {
      await grantOnboardingReward();
    }
    return;
  }
  const phShift = randomBetween(0.6, 0.8);
  const nextValue =
    normalizedDirection === "up" && getOnboardingState().step === 11
      ? 7.1
      : clamp(state.aquarium.phLevel + (normalizedDirection === "up" ? phShift : -phShift), 5.5, 8.5);
  if (Math.abs(nextValue - state.aquarium.phLevel) < 0.01) {
    toast("Le pH est deja a sa limite de reglage.");
    return;
  }
  setPhLevel(nextValue, {
    tabletCount: 1,
    inventoryKey: normalizedDirection === "up" ? "phUpTablets" : "phDownTablets",
    label: normalizedDirection === "up" ? "pastille pH+" : "pastille pH-",
  });
  if (
    normalizedDirection === "up" &&
    getOnboardingState().step === 11 &&
    Math.abs(state.aquarium.phLevel - 7.1) < 0.05
  ) {
    await grantOnboardingReward();
  }
}

function serviceFilter() {
  const coinCost = 18;
  const hasKit = state.inventory.waterKits > 0;
  if (!hasKit && state.coins < coinCost) {
    toast(`Il faut 1 kit de filtration ou ${coinCost} coquillages pour entretenir le filtre.`);
    return;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.serviceFilter, "l'entretien du filtre")) {
    return;
  }
  if (hasKit) {
    state.inventory.waterKits -= 1;
  } else {
    state.coins -= coinCost;
  }
  state.aquarium.filterCondition = clamp(state.aquarium.filterCondition + 28, 0, 100);
  state.aquarium.stability = clamp(state.aquarium.stability + 6, 0, 100);
  state.logs.unshift(createLog(hasKit ? "Le filtre a ete entretenu avec un kit neuf." : "Le filtre a ete entretenu manuellement."));
  commit("Le filtre retrouve du souffle.");
}

function upgradeFilter() {
  if (state.aquarium.filterLevel >= 3) {
    toast("Ton filtre est deja au niveau maximum.");
    return;
  }
  const cost = state.aquarium.filterLevel * 120;
  if (state.coins < cost) {
    toast(`Il faut ${cost} coquillages pour cette amelioration.`);
    return;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.upgradeFilter, "l'amelioration du filtre")) {
    return;
  }
  state.coins -= cost;
  state.aquarium.filterLevel += 1;
  state.aquarium.filterCondition = clamp(state.aquarium.filterCondition + 18, 0, 100);
  awardXp(14);
  state.logs.unshift(createLog(`Filtre ameliore au niveau ${state.aquarium.filterLevel}.`));
  commit(`Filtre ameliore: ${getFilterLabel()}.`);
}

function decorateAquarium() {
  const available = availablePlacements();
  if (available.length === 0 && state.plantsPlaced.length === 0) {
    toast("Achete d'abord une plante pour pouvoir amenager le bac.");
    return;
  }
  runtime.placementMode = !runtime.placementMode;
  runtime.movingPlantId = null;
  runtime.selectedPlacementKey =
    runtime.selectedPlacementKey && available.some((item) => item.key === runtime.selectedPlacementKey)
      ? runtime.selectedPlacementKey
      : available[0]?.key || null;
  els.placementCursor.hidden = !runtime.placementMode;
  renderPlacementPanel();
  toast(runtime.placementMode ? "Choisis une plante a poser ou clique une plante pour la deplacer." : "Mode plantation ferme.");
}

async function tryBreedFish() {
  if (
    isOnlineAuthoritativeMode() &&
    (await runServerBridgeAction(
      (bridge) => bridge.breedFish(state.selectedAquariumId),
      "La tentative de reproduction a ete envoyee au serveur."
    ))
  ) {
    return;
  }
  const breeders = eligibleBreeders();
  if (breeders.length < 2) {
    toast("Il faut au moins deux poissons adultes en bon confort.");
    return;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.breedAttempt, "la reproduction")) {
    return;
  }

  const event = getCurrentEvent();
  const chance =
    0.2 +
    (event.breedBonus || 0) +
    getBreedingSupportBonus() / 100 +
    Math.max(0, state.aquarium.waterQuality - 60) / 180;
  updateMissionProgress("breedCount");
  if (Math.random() <= chance) {
    const parent = breeders[Math.floor(Math.random() * breeders.length)];
    const batchCount = Math.min(3, 1 + Math.floor(getBreedingSupportBonus() / 18) + (Math.random() < 0.35 ? 1 : 0));
    state.fryBatches = [
      ...normalizeFryBatches(state.fryBatches),
      {
        id: `fry-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        speciesId: parent.speciesId,
        count: batchCount,
        cyclesRemaining: 2,
        createdAt: Date.now(),
      },
    ];
    awardXp(24);
    state.logs.unshift(
      createLog(
        `Une ponte prometteuse apparait dans le bac: ${batchCount} alevin${batchCount > 1 ? "s" : ""} de ${getSpecies(parent.speciesId).species} sont attendus.`
      )
    );
    addFeedEntry("Port communautaire", `${state.playerName} surveille une nouvelle portee dans ${state.aquariumName}.`);
    commit("Une nouvelle portee evoluera au prochain cycle.");
    return;
  }

  state.logs.unshift(createLog("La tentative de reproduction n'a rien donne cette fois."));
  commit("La saison n'est pas encore assez favorable.");
}

async function claimDailyReward() {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.claimDailyReward(),
      "La maree du jour t'apporte de belles ressources."
    )
  ) {
    return;
  }
  if (!canClaimDailyReward()) {
    toast("La recompense du jour a deja ete prise.");
    return;
  }

  const event = getCurrentEvent();
  const coinsReward = 80 + state.level * 12;
  const pearlsReward = 4 + (event.dailyPearlsBonus || 0);
  state.coins += coinsReward;
  state.pearls += pearlsReward;
  state.inventory.food += 3;
  state.lastRewardAt = Date.now();
  updateMissionProgress("dailyRewardCount");
  awardXp(20);
  state.logs.unshift(createLog(`Recompense quotidienne obtenue: ${coinsReward} coquillages, ${pearlsReward} perles.`));
  commit("La maree du jour t'apporte de belles ressources.");
}

async function claimMission(missionId) {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.claimMission(missionId),
      "Mission quotidienne recuperee."
    )
  ) {
    return;
  }
  const definition = getMissionDefinitionById(missionId);
  const entry = state.missionState.entries.find((mission) => mission.id === missionId);
  if (!definition || !entry || entry.claimed || entry.progress < definition.goal) {
    return;
  }

  entry.claimed = true;
  state.coins += definition.rewardCoins;
  state.pearls += definition.rewardPearls;
  awardXp(16);
  state.logs.unshift(createLog(`Mission terminee: ${definition.label}.`));
  commit("Mission quotidienne recuperee.");
}

async function buyFish(speciesId) {
  const species = getSpecies(speciesId);
  if (state.level < (species.unlockLevel || 1)) {
    toast(`Cette espece sera disponible au niveau ${species.unlockLevel}.`);
    return;
  }

  if (
    await runServerBridgeAction(
      (bridge) => bridge.buyFish(speciesId, state.selectedAquariumId),
      `${species.species} adopte avec succes.`
    )
  ) {
    if (runtime.lastServerActionSucceeded && getOnboardingState().step === 5 && getOwnedFishTotalForOnboarding() >= 1) {
      await advanceOnboardingTo(6);
    }
    return;
  }

  if (state.coins < species.cost) {
    toast("Pas assez de coquillages pour cette adoption.");
    return;
  }

  state.coins -= species.cost;
  const newcomer = createFish(speciesId);
  state.fish.push(newcomer);
  state.aquarium.visitors += 6;
  updateMissionProgress("adoptionCount");
  updateMissionProgress("purchaseCount");
  awardXp(15);
  addFeedEntry("Toi", `a adopte ${newcomer.nickname}, un ${species.species.toLowerCase()}.`);
  state.logs.unshift(createLog(`${newcomer.nickname} rejoint l'aquarium.`));
  commit(`${species.species} adopte avec succes.`);
  if (getOnboardingState().step === 5 && getOwnedFishTotalForOnboarding() >= 1) {
    await advanceOnboardingTo(6);
  }
}

async function buyItem(itemId) {
  const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  if (
    await runServerBridgeAction(
      (bridge) => bridge.buyItem(itemId, state.selectedAquariumId),
      `${item.name} ajoute a ton inventaire.`
    )
  ) {
    if (runtime.lastServerActionSucceeded) {
      await handleOnboardingAfterShopItem(item);
    }
    return;
  }

  const effectiveCost = isOnboardingShopItemFree(item) ? 0 : item.cost;
  if (state.coins < effectiveCost) {
    toast("Il te manque des coquillages pour cet achat.");
    return;
  }

  state.coins -= effectiveCost;
  if (item.type === "food") {
    state.inventory.food += item.amount;
  }
  if (item.type === "water") {
    state.inventory.waterKits += Math.max(1, Math.round(item.amount / 20));
  }
  if (item.type === "ph-up") {
    state.inventory.phUpTablets += Math.max(1, Math.round(item.amount));
  }
  if (item.type === "ph-down") {
    state.inventory.phDownTablets += Math.max(1, Math.round(item.amount));
  }
  if (item.type === "lamp") {
    state.aquarium.lampLevel = Math.max(state.aquarium.lampLevel || 1, numericOr(item.level, 1));
    state.aquarium.lightHours = clamp(state.aquarium.lightHours, 0, getLampMaxHours(state.aquarium.lampLevel));
  }
  if (item.type === "co2") {
    state.aquarium.co2DeviceLevel = Math.max(state.aquarium.co2DeviceLevel || 1, numericOr(item.level, 1));
    state.aquarium.co2Level = getCo2MaxLevel(state.aquarium.co2DeviceLevel);
  }
  if (item.type === "filter") {
    state.aquarium.filterLevel = Math.max(state.aquarium.filterLevel || 1, numericOr(item.level, 1));
  }
  if (item.type === "plant") {
    addPlantToInventory(item.plantType);
  }

  updateMissionProgress("purchaseCount");
  awardXp(10);
  state.logs.unshift(createLog(`Achat realise: ${item.name}.`));
  commit(`${item.name} ajoute a ton inventaire.`);
  await handleOnboardingAfterShopItem(item);
}

async function placeFishFromInventory(fishId) {
  if (!fishId) {
    return;
  }

  if (
    await runServerBridgeAction(
      (bridge) => bridge.toggleFishPlacement(fishId, state.selectedAquariumId),
      "Le poisson rejoint l'aquarium."
    )
  ) {
    return;
  }

  toast("Le placement de poissons en reserve n'est disponible qu'en version online.");
}

async function sellFish(fishId) {
  if (
    isOnlineAuthoritativeMode() &&
    (await runServerBridgeAction((bridge) => bridge.sellFish(fishId), "Le poisson a ete vendu."))
  ) {
    return;
  }
  if (state.fish.length <= 1) {
    toast("Garde au moins un poisson pour faire vivre ton aquarium.");
    return;
  }

  const fish = state.fish.find((entry) => entry.id === fishId);
  if (!fish) {
    return;
  }
  const species = getSpecies(fish.speciesId);
  state.fish = state.fish.filter((entry) => entry.id !== fishId);
  state.coins += species.sellPrice;
  state.logs.unshift(createLog(`${fish.nickname} a ete confie au marche marin pour ${species.sellPrice} coquillages.`));
  commit(`${fish.nickname} a trouve un nouveau foyer.`);
}

async function sellPlant(plantId) {
  if (
    isOnlineAuthoritativeMode() &&
    (await runServerBridgeAction((bridge) => bridge.sellPlant(plantId), "La plante a ete vendue."))
  ) {
    return;
  }

  toast("La vente de plantes n'est disponible qu'en version online.");
}

async function switchAquarium(aquariumId) {
  if (!aquariumId || aquariumId === state.selectedAquariumId) {
    return;
  }

  const previousAquariumId = state.selectedAquariumId;
  persistSelectedAquariumState(state);
  runtime.placementMode = false;
  runtime.selectedPlacementKey = null;
  runtime.movingPlantId = null;
  runtime.tankTab = "overview";
  runtime.inventoryTab = "fish";
  clearFoodParticles();
  els.placementCursor.hidden = true;
  state.selectedAquariumId = aquariumId;
  syncSelectedAquariumState(state);
  if (await refreshOnlineAuthoritativeState({ silent: true })) {
    render();
    toast(`${state.aquariumName} est maintenant ouvert.`);
    return;
  }
  if (isOnlineAuthoritativeMode()) {
    state.selectedAquariumId = previousAquariumId;
    syncSelectedAquariumState(state);
    render();
    toast("Impossible de charger cet aquarium depuis le serveur pour le moment.");
    return;
  }
  applyOfflineProgress();
  createBubbleLayers();
  saveState();
  render();
  toast(`${state.aquariumName} est maintenant ouvert.`);
}

async function buyAquariumSlot() {
  const previousAquariumCount = state.aquariums.length;
  if (
    isOnlineAuthoritativeMode() &&
    (await runServerBridgeAction(
      (bridge) => bridge.buyAquariumSlot(),
      "Un nouvel aquarium vient d'etre debloque."
    ))
  ) {
    if (state.aquariums.length > previousAquariumCount) {
      const newestAquarium = [...state.aquariums].sort((left, right) => right.slotIndex - left.slotIndex)[0];
      if (newestAquarium?.id) {
        state.selectedAquariumId = newestAquarium.id;
        syncSelectedAquariumState(state);
        saveState();
        render();
      }
    }
    return;
  }
  if (state.aquariums.length >= MAX_AQUARIUMS) {
    toast("Tu as atteint le nombre maximum d'aquariums.");
    return;
  }

  const cost = getNextAquariumCost();
  if (state.pearls < cost) {
    toast(`Il faut ${cost} perles pour debloquer un nouvel aquarium.`);
    return;
  }

  persistSelectedAquariumState(state);
  state.pearls -= cost;
  const slotIndex = state.aquariums.length + 1;
  const newBundle = createAquariumBundle({
    slotIndex,
    name: `Aquarium ${slotIndex}`,
    aquarium: DEFAULT_AQUARIUM_STATS,
  });
  state.aquariums.push(newBundle);
  state.selectedAquariumId = newBundle.id;
  syncSelectedAquariumState(state);
  runtime.tankTab = "overview";
  runtime.inventoryTab = "fish";
  clearFoodParticles();
  state.logs.unshift(createLog(`${newBundle.name} vient d'etre debloque contre ${cost} perles.`));
  createBubbleLayers();
  commit(`${newBundle.name} est pret a accueillir une nouvelle population.`);
}

async function runSpeedCompetition() {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.runSpeedCompetition(state.selectedAquariumId),
      "Course de vitesse terminee."
    )
  ) {
    return;
  }
  const candidate = [...getEligibleCompetitionFish()].sort(
    (left, right) => getFishCompetitionProfile(right).speedScore - getFishCompetitionProfile(left).speedScore
  )[0];
  if (!candidate) {
    toast("Aucun poisson n'est disponible pour une course aujourd'hui.");
    return;
  }
  if (state.pearls < 2) {
    toast("Il faut 2 perles pour inscrire un poisson a une course.");
    return;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.speedCompetition, "la course de vitesse")) {
    return;
  }

  const profile = getFishCompetitionProfile(candidate);
  const playerScore = profile.speedScore + Math.random() * 16;
  const field = COMMUNITY_PLAYERS.slice(0, 4).map((player, index) => ({
    id: `npc-speed-${player.id}`,
    label: `${player.name} - ${player.specialty}`,
    score: 48 + index * 7 + Math.random() * 40,
  }));
  const standings = [...field, { id: `player-speed-${candidate.id}`, label: candidate.nickname, score: playerScore }].sort(
    (left, right) => right.score - left.score
  );
  const rank = standings.findIndex((entry) => entry.id === `player-speed-${candidate.id}`) + 1;
  const pearlRewards = [0, 12, 7, 4, 2];
  const coinRewards = [0, 56, 34, 20, 8];
  const rewardPearls = pearlRewards[rank] || 0;
  const rewardCoins = coinRewards[rank] || 0;

  state.pearls -= 2;
  state.pearls += rewardPearls;
  state.coins += rewardCoins;
  state.fish = state.fish.map((fish) =>
    fish.id === candidate.id
      ? {
          ...fish,
          hunger: clamp(fish.hunger - 8, 0, 100),
          speedSkill: clamp(fish.speedSkill + 2 + getFishComfort(fish) * 0.02, 0, 100),
          lastCompetitionDateKey: getTodayKey(),
        }
      : fish
  );
  state.logs.unshift(
    createLog(
      `${candidate.nickname} termine ${rank}${rank === 1 ? "er" : "e"} en course de vitesse et gagne ${rewardPearls} perles.`
    )
  );
  addFeedEntry("Port communautaire", `${candidate.nickname} brille en course de vitesse dans ${state.aquariumName}.`);
  commit(`Course de vitesse terminee: ${candidate.nickname} finit ${rank}${rank === 1 ? "er" : "e"}.`);
}

async function runReflexCompetition() {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.runReflexCompetition(state.selectedAquariumId),
      "Competition Evite-plante terminee."
    )
  ) {
    return;
  }
  const fish = [...getEligibleCompetitionFish()].sort(
    (left, right) => getFishCompetitionProfile(right).reflexScore - getFishCompetitionProfile(left).reflexScore
  )[0];
  const plant = [...getEligibleCompetitionPlants()].sort(
    (left, right) => getPlantCompetitionProfile(right).interceptScore - getPlantCompetitionProfile(left).interceptScore
  )[0];
  if (!fish || !plant) {
    toast("Il faut un poisson et une plante disponibles pour une competition de reflexe.");
    return;
  }
  if (state.pearls < 2) {
    toast("Il faut 2 perles pour cette competition.");
    return;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.reflexCompetition, "la competition Evite-plante")) {
    return;
  }

  const fishProfile = getFishCompetitionProfile(fish);
  const plantProfile = getPlantCompetitionProfile(plant);
  const playerScore = fishProfile.reflexScore * 0.68 + plantProfile.interceptScore * 0.32 + Math.random() * 14;
  const field = COMMUNITY_PLAYERS.slice(1, 5).map((player, index) => ({
    id: `npc-reflex-${player.id}`,
    label: `${player.name} - duo`,
    score: 46 + index * 6 + Math.random() * 36,
  }));
  const duoLabel = `${fish.nickname} & ${plant.nickname || getPlantSpecies(plant.speciesId).species}`;
  const standings = [...field, { id: `player-reflex-${fish.id}-${plant.id}`, label: duoLabel, score: playerScore }].sort(
    (left, right) => right.score - left.score
  );
  const rank = standings.findIndex((entry) => entry.id === `player-reflex-${fish.id}-${plant.id}`) + 1;
  const rewardPearls = [0, 10, 6, 3, 1][rank] || 0;
  const rewardCoins = [0, 44, 26, 14, 0][rank] || 0;

  state.pearls -= 2;
  state.pearls += rewardPearls;
  state.coins += rewardCoins;
  const todayKey = getTodayKey();
  state.fish = state.fish.map((entry) =>
    entry.id === fish.id
      ? {
          ...entry,
          hunger: clamp(entry.hunger - 6, 0, 100),
          reflexSkill: clamp(entry.reflexSkill + 2 + getFishComfort(entry) * 0.02, 0, 100),
          lastCompetitionDateKey: todayKey,
        }
      : entry
  );
  state.plantsPlaced = state.plantsPlaced.map((entry) =>
    entry.id === plant.id
      ? {
          ...entry,
          lastCompetitionDateKey: todayKey,
        }
      : entry
  );
  state.logs.unshift(createLog(`${duoLabel} termine ${rank}${rank === 1 ? "er" : "e"} en Evite-plante.`));
  addFeedEntry("Port communautaire", `${duoLabel} marque des points en competition Evite-plante.`);
  commit(`Competition Evite-plante terminee: duo classe ${rank}${rank === 1 ? "er" : "e"}.`);
}

async function enterBeautyContest() {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.enterBeautyContest(state.selectedAquariumId),
      "Concours beaute enregistre."
    )
  ) {
    return;
  }
  const weekKey = getWeeklyContestKey();
  if (state.competitionState.weeklyContestEntries?.[state.selectedAquariumId] === weekKey) {
    toast("Cet aquarium est deja inscrit au concours de cette semaine.");
    return;
  }
  if (!spendCycleMinutes(CYCLE_COSTS.beautyContest, "l'inscription au concours beaute")) {
    return;
  }

  const playerScore = getAquariumBeautyScore() + Math.random() * 18;
  const field = COMMUNITY_PLAYERS.map((player, index) => ({
    id: `npc-beauty-${player.id}`,
    label: player.aquarium,
    score: 82 + index * 7 + Math.random() * 40,
  }));
  const standings = [...field, { id: `player-beauty-${state.selectedAquariumId}`, label: state.aquariumName, score: playerScore }].sort(
    (left, right) => right.score - left.score
  );
  const rank = standings.findIndex((entry) => entry.id === `player-beauty-${state.selectedAquariumId}`) + 1;
  const rewardPearls = rank === 1 ? 16 : rank === 2 ? 10 : rank === 3 ? 6 : rank <= 5 ? 3 : 0;
  const rewardCoins = rank === 1 ? 90 : rank === 2 ? 60 : rank === 3 ? 36 : rank <= 5 ? 18 : 0;

  state.competitionState.weeklyContestEntries[state.selectedAquariumId] = weekKey;
  state.competitionState.history.unshift({
    type: "beauty",
    aquariumId: state.selectedAquariumId,
    aquariumName: state.aquariumName,
    weekKey,
    rank,
    score: Math.round(playerScore),
  });
  state.competitionState.history = state.competitionState.history.slice(0, 12);
  state.pearls += rewardPearls;
  state.coins += rewardCoins;
  state.logs.unshift(createLog(`${state.aquariumName} est classe ${rank}${rank === 1 ? "er" : "e"} au concours beaute.`));
  addFeedEntry("Port communautaire", `${state.aquariumName} entre au concours beaute hebdomadaire.`);
  commit(`Concours beaute: ${state.aquariumName} termine ${rank}${rank === 1 ? "er" : "e"}.`);
}

async function renameAquarium() {
  const nextName = window.prompt("Nom du bac actif :", state.aquariumName);
  if (!nextName) {
    return;
  }
  const trimmed = nextName.trim().slice(0, 28);
  if (!trimmed) {
    return;
  }
  if (
    await runServerBridgeAction(
      (bridge) => bridge.renameAquarium(state.selectedAquariumId, trimmed),
      "Le nom de l'aquarium a ete mis a jour."
    )
  ) {
    return;
  }
  state.aquariumName = trimmed;
  state.logs.unshift(createLog(`L'aquarium actif s'appelle maintenant ${trimmed}.`));
  commit("Le nom de l'aquarium a ete mis a jour.");
}

async function logoutOnlineSession() {
  const bridge = getOnlineBridge();
  if (!bridge?.signOut) {
    return;
  }
  try {
    await bridge.signOut();
  } catch (error) {
    console.error(error);
    window.alert(error.message || "Impossible de fermer la session online.");
  }
}

async function visitCommunity(profileId) {
  if (
    await runServerBridgeAction(
      (bridge) => bridge.visitCommunity(profileId),
      "Visite terminee."
    )
  ) {
    return;
  }
  const profile = COMMUNITY_PLAYERS.find((entry) => entry.id === profileId);
  if (!profile) {
    return;
  }

  const event = getCurrentEvent();
  const rewardCoins = Math.round((26 + (event.socialCoinsBonus || 0)) * (event.visitBonusMultiplier || 1));
  state.coins += rewardCoins;
  state.aquarium.visitors += 4 + (event.decorVisitorBonus ? Math.round(state.plantsPlaced.length / 2) : 0);

  if (profile.gift === "food") {
    state.inventory.food += 1;
  }
  if (profile.gift === "coins") {
    state.coins += 14;
  }
  if (profile.gift === "pearls") {
    state.pearls += 2;
  }

  updateMissionProgress("visitCount");
  awardXp(11);
  addFeedEntry(profile.name, `a remercie ${state.playerName} pour une visite chaleureuse.`);
  state.logs.unshift(createLog(`Visite chez ${profile.name}. Recompense recue: ${rewardCoins} coquillages.`));
  commit(`Visite terminee dans ${profile.aquarium}.`);
}

async function renamePlayer() {
  const nextName = window.prompt("Nom de ton gardien de recif :", state.playerName);
  if (!nextName) {
    return;
  }
  const trimmed = nextName.trim().slice(0, 26);
  if (!trimmed) {
    return;
  }
  if (
    await runServerBridgeAction(
      (bridge) => bridge.renamePlayer(trimmed),
      "Ton profil communautaire est mis a jour."
    )
  ) {
    return;
  }
  state.playerName = trimmed;
  addFeedEntry("Port communautaire", `${trimmed} vient de hisser son fanion sur le recif.`);
  commit("Ton profil communautaire est mis a jour.");
}

function addFeedEntry(author, message) {
  state.communityFeed.unshift({
    author,
    message,
    when: "A l'instant",
  });
  state.communityFeed = state.communityFeed.slice(0, 20);
}

function createLog(message) {
  return {
    message,
    when: new Date().toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function commit(message, options = {}) {
  saveState();
  render();
  if (isOnlineAuthoritativeMode() && options.syncProfile !== false) {
    queueOnlineProfileSnapshotSync();
  }
  toast(message);
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
  window.setTimeout(() => node.remove(), 2800);
}

function generateInitialFeed() {
  return [
    {
      author: "Port communautaire",
      message: "Bienvenue. Les aquariums les mieux entretenus gagnent plus de visiteurs.",
      when: "Maintenant",
    },
    {
      author: "Naya",
      message: "Les guppys dores font de super premiers compagnons pour relancer un bac.",
      when: "Il y a 1 h",
    },
    {
      author: "Thea",
      message: "Je cherche toujours des bettas lunaires a admirer pendant la Nuit des perles.",
      when: "Il y a 3 h",
    },
  ];
}

function generateFishName() {
  const prefixes = FISH_NAME_PARTS.prefixes.length ? FISH_NAME_PARTS.prefixes : ["Aster", "Nemo"];
  const suffixes = FISH_NAME_PARTS.suffixes.length ? FISH_NAME_PARTS.suffixes : ["bleu", "perle"];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generateBabyName() {
  const names = FISH_NAME_PARTS.babies.length ? FISH_NAME_PARTS.babies : ["Pixel", "Etoile"];
  return names[Math.floor(Math.random() * names.length)];
}

function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(value));
}

function formatHours(value) {
  if (value < 1) {
    return `${Math.round(value * 60)} minutes`;
  }
  return `${value.toFixed(1).replace(".", ",")} heures`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function numericOr(value, fallback) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function setupTabs() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      els.tabs.forEach((item) => item.classList.remove("active"));
      els.panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
      saveOnlineUiCache();
    });
  });
}

function setupTankTabs() {
  els.tankTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      runtime.tankTab = tab.dataset.tankTab || "overview";
      renderTankTabs();
      saveOnlineUiCache();
    });
  });
}

function setupShopTabs() {
  els.shopTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      runtime.shopTab = tab.dataset.shopTab || "fish";
      renderShopTabs();
      saveOnlineUiCache();
    });
  });
}

function setupInventoryTabs() {
  els.inventoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      runtime.inventoryTab = tab.dataset.inventoryTab || "fish";
      renderInventoryTabs();
      saveOnlineUiCache();
    });
  });
}

function setupEvents() {
  els.advanceCycleBtn.addEventListener("click", advanceCycle);
  els.dailyRewardBtn?.addEventListener("click", claimDailyReward);
  els.feedAllBtn.addEventListener("click", feedAllFish);
  els.cleanBtn.addEventListener("click", cleanAquarium);
  els.tempSlider.addEventListener("input", () => {
    els.tempSliderValue.textContent = `${Number(els.tempSlider.value).toFixed(1).replace(".", ",")} C`;
  });
  els.tempSlider.addEventListener("change", async () => {
    if (!(await setTemperatureTarget(els.tempSlider.value))) {
      render();
    }
  });
  els.lightSlider.addEventListener("input", () => {
    els.lightSliderValue.textContent = `${Math.round(Number(els.lightSlider.value))} h`;
  });
  els.lightSlider.addEventListener("change", async () => {
    if (!(await setLightHours(els.lightSlider.value))) {
      render();
    }
  });
  els.decorateBtn.addEventListener("click", decorateAquarium);
  els.breedBtn.addEventListener("click", tryBreedFish);
  els.renameBtn.addEventListener("click", renamePlayer);
  els.renameAquariumBtn.addEventListener("click", renameAquarium);
  els.onlineLogoutBtn?.addEventListener("click", logoutOnlineSession);
  els.onboardingStartBtn?.addEventListener("click", () => {
    if (getOnboardingState().step === 0) {
      advanceOnboardingTo(1);
    }
  });
  els.onboardingCloseBtn?.addEventListener("click", closeOnboardingReward);
  document.addEventListener("mousemove", (event) => {
    runtime.cursorX = event.clientX;
    runtime.cursorY = event.clientY;
    updateOnboardingPosition();
  });
  window.addEventListener("resize", updateOnboardingPosition);
  window.addEventListener("beforeunload", saveOnlineUiCache);
  els.placementCancelBtn.addEventListener("click", () => {
    runtime.placementMode = false;
    runtime.selectedPlacementKey = null;
    runtime.movingPlantId = null;
    els.placementCursor.hidden = true;
    renderPlacementPanel();
  });
  els.placementDepths.forEach((button) => {
    button.addEventListener("click", () => {
      runtime.selectedDepth = normalizePlantDepth(Number(button.dataset.depth));
      renderPlacementPanel();
    });
  });
  els.aquariumStage.addEventListener("mousemove", updatePlacementCursor);
  els.aquariumStage.addEventListener("mouseleave", () => {
    els.placementCursor.hidden = true;
  });
  els.aquariumStage.addEventListener("click", placeSelectedDecor);
}

async function main() {
  const onlineStateLoaded = await refreshOnlineAuthoritativeState({ silent: true });
  if (!onlineStateLoaded && !isOnlineAuthoritativeMode()) {
    applyOfflineProgress();
  }
  setupTabs();
  setupTankTabs();
  setupInventoryTabs();
  setupShopTabs();
  restoreOnlineUiCache();
  setupEvents();
  createBubbleLayers();
  render();
  runtime.animationFrameId = window.requestAnimationFrame(animateScene);
  window.setInterval(() => {
    simulateAquariumStep(0.2);
    if (!isOnlineAuthoritativeMode()) {
      saveState();
    }
    render();
  }, 12000);
}

main();
