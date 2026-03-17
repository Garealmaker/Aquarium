import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const STORAGE_KEY = "aquariow-legacy-save";

const els = {
  gameStatus: document.getElementById("game-status"),
  gameAuthBadge: document.getElementById("game-auth-badge"),
  gameUserEmail: document.getElementById("game-user-email"),
  gameSyncStatus: document.getElementById("game-sync-status"),
  gameSyncStatusPanel: document.getElementById("game-sync-status-panel"),
  gameLastSync: document.getElementById("game-last-sync"),
  gameLastSyncPanel: document.getElementById("game-last-sync-panel"),
  gameSaveSource: document.getElementById("game-save-source"),
  gameSaveSourcePanel: document.getElementById("game-save-source-panel"),
  syncNowBtn: document.getElementById("sync-now-btn"),
  reloadCloudBtn: document.getElementById("reload-cloud-btn"),
  backLauncherBtn: document.getElementById("back-launcher-btn"),
  logoutGameBtn: document.getElementById("logout-game-btn"),
  gameFrame: document.getElementById("game-frame"),
};

let supabase = null;
let currentSession = null;
let lastSyncedRaw = "";

function isAuthoritativeServerMode() {
  return Boolean(window.AQUARIOW_ONLINE_BRIDGE?.isEnabled);
}

function isDevMode() {
  return new URLSearchParams(window.location.search).get("dev") === "1";
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

function getLocalRawSave() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function getLocalParsedSave() {
  const raw = getLocalRawSave();
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function setStatus(message, badgeText = "En cours") {
  if (els.gameStatus) {
    els.gameStatus.textContent = message;
  }
  if (els.gameAuthBadge) {
    els.gameAuthBadge.textContent = badgeText;
    els.gameAuthBadge.className = `badge ${currentSession?.user ? "online" : "offline"}`;
  }
}

function setSyncStatusLabel(value) {
  if (els.gameSyncStatus) {
    els.gameSyncStatus.textContent = value;
  }
  if (els.gameSyncStatusPanel) {
    els.gameSyncStatusPanel.textContent = value;
  }
}

function setLastSyncLabel(value) {
  if (els.gameLastSync) {
    els.gameLastSync.textContent = value;
  }
  if (els.gameLastSyncPanel) {
    els.gameLastSyncPanel.textContent = value;
  }
}

function setSaveSourceLabel(value) {
  if (els.gameSaveSource) {
    els.gameSaveSource.textContent = value;
  }
  if (els.gameSaveSourcePanel) {
    els.gameSaveSourcePanel.textContent = value;
  }
}

async function fetchRemoteSave() {
  if (!isDevMode()) {
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
  return data || null;
}

async function pushRawSave(rawSave, originLabel = "navigateur") {
  if (!isDevMode() || !rawSave) {
    return;
  }
  const save = JSON.parse(rawSave);
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
  lastSyncedRaw = rawSave;
  setSyncStatusLabel(`Sync ${originLabel}`);
  setLastSyncLabel(formatDateTime(payload.updated_at));
}

async function syncLocalSave(originLabel = "auto") {
  if (!isDevMode() || !currentSession?.user) {
    return;
  }
  const rawSave = getLocalRawSave();
  if (!rawSave || rawSave === lastSyncedRaw) {
    return;
  }
  await pushRawSave(rawSave, originLabel);
}

async function fetchCoreState() {
  const { data, error } = await supabase.rpc("get_player_core_state");
  if (error) {
    throw error;
  }
  return data;
}

function getShopItem(itemId) {
  return (window.GAME_CONTENT?.shopItems || []).find((entry) => entry.id === itemId) || null;
}

function createOnlineBridge() {
  return {
    isEnabled: true,
    async getCoreState() {
      return fetchCoreState();
    },
    async advanceCycle(aquariumId) {
      const { data, error } = await supabase.rpc("advance_cycle_server", {
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async buyAquariumSlot() {
      const { data, error } = await supabase.rpc("buy_aquarium_slot_server");
      if (error) {
        throw error;
      }
      return data;
    },
    async breedFish(aquariumId) {
      const { data, error } = await supabase.rpc("breed_fish_server", {
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async buyFish(speciesId, aquariumId) {
      const { data, error } = await supabase.rpc("buy_server_item", {
        target_item_category: "fish",
        target_item_key: speciesId,
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async buyItem(itemId, aquariumId) {
      const item = getShopItem(itemId);
      if (!item) {
        throw new Error("Objet de boutique introuvable.");
      }

      const itemCategory =
        item.type === "plant"
          ? "plant"
          : ["food", "water", "ph-up", "ph-down"].includes(item.type)
            ? "utility"
            : ["lamp", "co2", "filter"].includes(item.type)
              ? "equipment"
              : "";
      const itemKey = item.type === "plant" ? item.plantType : item.id;
      if (!itemCategory || !itemKey) {
        throw new Error("Cet achat n'est pas encore pris en charge cote serveur.");
      }

      const { data, error } = await supabase.rpc("buy_server_item", {
        target_item_category: itemCategory,
        target_item_key: itemKey,
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async useUtility(itemKey, aquariumId) {
      const { data, error } = await supabase.rpc("use_inventory_utility_server", {
        target_item_key: itemKey,
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async cleanAquarium(aquariumId) {
      const { data, error } = await supabase.rpc("clean_aquarium_server", {
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async updateSetting(aquariumId, settingKey, settingValue) {
      const { data, error } = await supabase.rpc("update_aquarium_setting_server", {
        target_aquarium_id: aquariumId,
        setting_key: settingKey,
        setting_value: Number(settingValue),
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async toggleFishPlacement(fishId, aquariumId) {
      const { data, error } = await supabase.rpc("toggle_fish_placement_server", {
        target_fish_id: fishId,
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async sellFish(fishId) {
      const { data, error } = await supabase.rpc("sell_owned_fish_server", {
        target_fish_id: fishId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async togglePlantPlacement(plantId, aquariumId, depth, xPercent) {
      const { data, error } = await supabase.rpc("toggle_plant_placement_server", {
        target_plant_id: plantId,
        target_aquarium_id: aquariumId,
        target_depth: depth,
        target_x_percent: xPercent,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async sellPlant(plantId) {
      const { data, error } = await supabase.rpc("sell_owned_plant_server", {
        target_plant_id: plantId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async claimDailyReward() {
      const { data, error } = await supabase.rpc("claim_daily_reward_server");
      if (error) {
        throw error;
      }
      return data;
    },
    async claimMission(missionId) {
      const { data, error } = await supabase.rpc("claim_mission_server", {
        target_mission_id: missionId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async renamePlayer(playerName) {
      const { data, error } = await supabase.rpc("rename_player_server", {
        target_player_name: playerName,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async renameAquarium(aquariumId, aquariumName) {
      const { data, error } = await supabase.rpc("rename_aquarium_server", {
        target_aquarium_id: aquariumId,
        target_name: aquariumName,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async visitCommunity(profileId) {
      const { data, error } = await supabase.rpc("visit_community_server", {
        target_profile_id: profileId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async runSpeedCompetition(aquariumId) {
      const { data, error } = await supabase.rpc("run_speed_competition_server", {
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async runReflexCompetition(aquariumId) {
      const { data, error } = await supabase.rpc("run_reflex_competition_server", {
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async enterBeautyContest(aquariumId) {
      const { data, error } = await supabase.rpc("enter_beauty_contest_server", {
        target_aquarium_id: aquariumId,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async syncProfileSnapshot(snapshot) {
      const { error } = await supabase.rpc("sync_profile_snapshot_server", {
        target_player_name: snapshot?.playerName || null,
        target_coins: Number(snapshot?.coins ?? 0),
        target_pearls: Number(snapshot?.pearls ?? 0),
        target_level: Number(snapshot?.level ?? 1),
        target_xp: Number(snapshot?.xp ?? 0),
        target_aquarium_id: snapshot?.aquariumId || null,
        target_aquarium_name: snapshot?.aquariumName || null,
      });
      if (error) {
        throw error;
      }
      return true;
    },
    async updateOnboardingState(step, completed = null, rewardClaimed = null) {
      const { data, error } = await supabase.rpc("update_onboarding_state_server", {
        target_step: step,
        target_completed: completed,
        target_reward_claimed: rewardClaimed,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    async claimOnboardingReward() {
      const { data, error } = await supabase.rpc("claim_onboarding_reward_server");
      if (error) {
        throw error;
      }
      return data;
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      window.location.href = "./index.html";
      return true;
    },
  };
}

function loadGameFrame() {
  els.gameFrame.src = "../index.html";
}

async function prepareAuthoritativeOnlineState() {
  try {
    await fetchCoreState();
    localStorage.removeItem(STORAGE_KEY);
    lastSyncedRaw = "";
    setSaveSourceLabel("Serveur Supabase");
    setLastSyncLabel("Session active");
    setStatus("Etat serveur charge. Le jeu va s'ouvrir en mode autoritaire.", "Connecte");
    return;
  } catch (serverError) {
    console.error(serverError);
    if (!isDevMode()) {
      localStorage.removeItem(STORAGE_KEY);
      lastSyncedRaw = "";
      setSaveSourceLabel("Serveur requis");
      setLastSyncLabel("En attente");
      throw new Error("Le serveur principal n'a pas repondu. Reessaie dans un instant.");
    }
  }

  try {
    const remoteSave = await fetchRemoteSave();
    if (remoteSave?.state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteSave.state));
      lastSyncedRaw = JSON.stringify(remoteSave.state);
      setSaveSourceLabel("Secours legacy");
      setLastSyncLabel(formatDateTime(remoteSave.updated_at));
      setStatus("Secours legacy charge. Le serveur principal n'a pas repondu.", "Connecte");
      return;
    }
  } catch (remoteError) {
    console.error(remoteError);
  }

  const localSave = getLocalParsedSave();
  if (localSave) {
    setSaveSourceLabel("Cache local");
    setStatus("Cache local conserve temporairement en attendant le serveur.", "Connecte");
    return;
  }

  setSaveSourceLabel("Aucune");
  setStatus("Aucun etat charge. Le jeu s'appuiera sur le serveur des qu'il repond.", "Connecte");
}

function bindEvents() {
  els.syncNowBtn?.addEventListener("click", async () => {
    if (!isDevMode()) {
      toast("La synchronisation legacy est reservee au mode dev.");
      return;
    }
    try {
      await syncLocalSave("manuel");
      toast("Sauvegarde du jeu synchronisee.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.reloadCloudBtn?.addEventListener("click", async () => {
    if (!isDevMode()) {
      toast("Le rechargement legacy est reserve au mode dev.");
      return;
    }
    try {
      const remoteSave = await fetchRemoteSave();
      if (!remoteSave?.state) {
        toast("Aucune sauvegarde cloud disponible.");
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteSave.state));
      lastSyncedRaw = JSON.stringify(remoteSave.state);
      setSaveSourceLabel("Cloud recharge");
      setLastSyncLabel(formatDateTime(remoteSave.updated_at));
      setSyncStatusLabel("Cloud reapplique");
      els.gameFrame.src = "../index.html";
      toast("La sauvegarde cloud a ete reappliquee et le jeu recharge.");
    } catch (error) {
      toast(error.message);
    }
  });

  els.backLauncherBtn?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  els.logoutGameBtn?.addEventListener("click", async () => {
    try {
      await window.AQUARIOW_ONLINE_BRIDGE?.signOut();
    } catch (error) {
      toast(error.message);
    }
  });

  if (isDevMode()) {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        syncLocalSave("arriere-plan").catch((error) => console.error(error));
      }
    });

    window.addEventListener("beforeunload", () => {
      syncLocalSave("fermeture").catch((error) => console.error(error));
    });
  }
}

async function init() {
  bindEvents();

  if (!isConfigured()) {
    setStatus("Configure `supabase-config.js` avant d'ouvrir le jeu online.", "A configurer");
    return;
  }

  const config = getSupabaseConfig();
  supabase = createClient(config.url, config.anonKey);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  currentSession = session;

  if (!currentSession?.user) {
    window.location.href = "./index.html";
    return;
  }

  if (els.gameUserEmail) {
    els.gameUserEmail.textContent = currentSession.user.email || "Compte inconnu";
  }
  if (els.syncNowBtn) {
    els.syncNowBtn.disabled = false;
  }
  if (els.reloadCloudBtn) {
    els.reloadCloudBtn.disabled = !isDevMode();
  }
  if (els.logoutGameBtn) {
    els.logoutGameBtn.disabled = false;
  }
  setStatus("Connexion validee. Chargement de l'etat serveur...", "Connecte");

  try {
    window.AQUARIOW_ONLINE_BRIDGE = createOnlineBridge();
    await prepareAuthoritativeOnlineState();
    loadGameFrame();
    setSyncStatusLabel("Serveur autoritaire actif");
  } catch (error) {
    setStatus(`Erreur de chargement: ${error.message}`, "Erreur");
    toast(error.message);
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    currentSession = session;
    if (!session?.user) {
      window.AQUARIOW_ONLINE_BRIDGE = null;
      window.location.href = "./index.html";
    }
  });
}

init();
