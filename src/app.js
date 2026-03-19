import { ACHIEVEMENTS, MODES, PAIR_ORDER, RULE_NOTES, STARTING_CHIPS, TUTORIAL_STEPS } from "./data.js";
import {
  applyRoundToProfile,
  canClaimBailout,
  claimBailout,
  createDeck,
  createProfile,
  dealerArrange,
  evaluateHand,
  getModeChips,
  maybeApplyDailyReward,
  modeAllowsBet,
  normalizeRoundSettlement,
  recommendSplit,
} from "./logic.js";
import { exportState, importState, loadState, saveState } from "./storage.js";

const app = document.querySelector("#app");
const state = loadState();

const ui = {
  screen: "home",
  modeId: "quick",
  bet: 1000,
  round: null,
  selectedCardId: "",
  detailTab: "rules",
  toast: "",
  rewardToast: "",
};

function activeProfile() {
  return state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0];
}

function setToast(message) {
  ui.toast = message;
  render();
  window.clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => {
    ui.toast = "";
    render();
  }, 2600);
}

function persist() {
  saveState(state);
}

function formatChips(value) {
  if (!Number.isFinite(value)) {
    return "无限";
  }
  return new Intl.NumberFormat("zh-CN").format(Math.max(0, Math.round(value)));
}

function getCurrentChips(profile = activeProfile()) {
  return getModeChips(profile, ui.modeId);
}

function createRound() {
  const profile = activeProfile();
  const deck = createDeck();
  const playerCards = deck.slice(0, 4);
  const bankerCards = deck.slice(4, 8);
  const suggestion = recommendSplit(playerCards);
  const bankerSplit = dealerArrange(bankerCards);
  const chips = getCurrentChips(profile);
  const roundBet = Number.isFinite(chips) ? Math.min(ui.bet, Math.max(1, chips)) : ui.bet;
  ui.round = {
    deck,
    playerCards,
    bankerCards,
    front: [],
    back: [],
    suggestion,
    bankerSplit,
    revealed: false,
    result: null,
    bet: roundBet,
  };
  ui.bet = roundBet;
  ui.selectedCardId = "";
}

function startMode(modeId) {
  ui.modeId = modeId;
  ui.screen = modeId === "tutorial" ? "tutorial" : "game";
  if (modeId !== "tutorial") {
    const currentChips = getCurrentChips();
    if (Number.isFinite(currentChips) && currentChips <= 0) {
      setToast("当前模式筹码不足，请先领取破产补助或切换模式。");
      ui.screen = "home";
      render();
      return;
    }
    ui.bet = Math.min(1000, Number.isFinite(currentChips) ? currentChips : 1000);
    createRound();
  }
  render();
}

function returnCardsFrom(groupName) {
  if (!ui.round) {
    return;
  }
  ui.round.playerCards.push(...ui.round[groupName]);
  ui.round[groupName] = [];
}

function selectCard(cardId) {
  ui.selectedCardId = ui.selectedCardId === cardId ? "" : cardId;
  render();
}

function moveCardTo(groupName) {
  if (!ui.round || !ui.selectedCardId) {
    return;
  }
  if (ui.round[groupName].length >= 2) {
    setToast(`${groupName === "front" ? "前组" : "后组"}已满。`);
    return;
  }
  const cardIndex = ui.round.playerCards.findIndex((card) => card.id === ui.selectedCardId);
  if (cardIndex === -1) {
    return;
  }
  const [card] = ui.round.playerCards.splice(cardIndex, 1);
  ui.round[groupName].push(card);
  ui.selectedCardId = "";
  render();
}

function moveBackToPool(groupName, cardId) {
  if (!ui.round) {
    return;
  }
  const cardIndex = ui.round[groupName].findIndex((card) => card.id === cardId);
  if (cardIndex === -1) {
    return;
  }
  const [card] = ui.round[groupName].splice(cardIndex, 1);
  ui.round.playerCards.push(card);
  render();
}

function useSuggestion() {
  if (!ui.round) {
    return;
  }
  ui.round.playerCards = [];
  ui.round.front = [...ui.round.suggestion.front];
  ui.round.back = [...ui.round.suggestion.back];
  render();
}

function confirmSplit() {
  const profile = activeProfile();
  if (!ui.round || ui.round.front.length !== 2 || ui.round.back.length !== 2) {
    setToast("请先把 4 张牌拆成前后两组。");
    return;
  }
  if (!modeAllowsBet(profile, ui.modeId, ui.round.bet)) {
    setToast("下注超过当前模式可用筹码。");
    return;
  }

  const settlement = normalizeRoundSettlement({
    bet: ui.round.bet,
    playerFront: ui.round.front,
    playerBack: ui.round.back,
    bankerFront: ui.round.bankerSplit.front,
    bankerBack: ui.round.bankerSplit.back,
  });

  ui.round.revealed = true;
  ui.round.result = settlement;

  const unlocked =
    ui.modeId === "quick" ? [] : applyRoundToProfile(profile, ui.modeId, ui.round.bet, settlement);

  if (unlocked.length) {
    setToast(`解锁成就：${unlocked.map((item) => item.title).join("、")}`);
  }

  persist();
  render();
}

function nextRound() {
  const chips = getCurrentChips();
  if (Number.isFinite(chips) && chips <= 0) {
    ui.screen = "home";
    setToast("筹码已归零，请先领取破产补助或切换模式。");
    render();
    return;
  }
  ui.bet = Math.min(ui.bet, Number.isFinite(chips) ? chips : ui.bet);
  createRound();
  render();
}

function updateBet(nextBet) {
  const chips = getCurrentChips();
  const max = Number.isFinite(chips) ? Math.max(1, chips) : 100000;
  const min = Number.isFinite(chips) && chips < 100 ? 1 : 100;
  ui.bet = Math.max(min, Math.min(nextBet, max));
  if (ui.round) {
    ui.round.bet = ui.bet;
  }
  render();
}

function claimDailyRewardIfNeeded() {
  const profile = activeProfile();
  const { granted } = maybeApplyDailyReward(profile);
  if (granted) {
    ui.rewardToast = `今日奖励 +${formatChips(granted)} 筹码`;
    persist();
  }
}

function createProfileAndSwitch(name) {
  if (!name?.trim()) {
    return;
  }
  const profile = createProfile(name);
  state.profiles.push(profile);
  state.activeProfileId = profile.id;
  claimDailyRewardIfNeeded();
  persist();
  render();
}

function switchProfile(profileId) {
  state.activeProfileId = profileId;
  claimDailyRewardIfNeeded();
  persist();
  render();
}

function updateNickname(name) {
  const profile = activeProfile();
  profile.nickname = name.trim() || profile.nickname;
  persist();
  render();
}

function updateAvatar(file) {
  const reader = new FileReader();
  reader.onload = () => {
    activeProfile().avatar = typeof reader.result === "string" ? reader.result : "";
    persist();
    render();
  };
  reader.readAsDataURL(file);
}

function exportSave() {
  const blob = new Blob([exportState(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "paijiu-save.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importSaveFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = importState(String(reader.result));
      state.activeProfileId = imported.activeProfileId;
      state.profiles = imported.profiles;
      state.settings = imported.settings ?? state.settings;
      persist();
      render();
      setToast("存档导入成功。");
    } catch (error) {
      setToast(error.message);
    }
  };
  reader.readAsText(file);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

function onAppClick(event) {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) {
    return;
  }

  const { action, value } = trigger.dataset;

  if (action === "open-mode") {
    startMode(value);
  } else if (action === "change-tab") {
    ui.detailTab = value;
    render();
  } else if (action === "back-home") {
    ui.screen = "home";
    ui.round = null;
    render();
  } else if (action === "select-card") {
    selectCard(value);
  } else if (action === "move-front") {
    moveCardTo("front");
  } else if (action === "move-back") {
    moveCardTo("back");
  } else if (action === "return-front") {
    moveBackToPool("front", value);
  } else if (action === "return-back") {
    moveBackToPool("back", value);
  } else if (action === "suggest") {
    useSuggestion();
  } else if (action === "confirm") {
    confirmSplit();
  } else if (action === "next-round") {
    nextRound();
  } else if (action === "bet-step") {
    updateBet(ui.bet + Number(value));
  } else if (action === "bet-max") {
    updateBet(Number.isFinite(getCurrentChips()) ? getCurrentChips() : 10000);
  } else if (action === "claim-bailout") {
    if (claimBailout(activeProfile())) {
      persist();
      render();
      setToast("已领取破产补助 3000 筹码。");
    }
  } else if (action === "export") {
    exportSave();
  } else if (action === "switch-profile") {
    switchProfile(value);
  } else if (action === "reset-challenge") {
    activeProfile().chips = STARTING_CHIPS;
    persist();
    render();
  }
}

function onAppChange(event) {
  const target = event.target;
  if (target.matches("[data-role='nickname']")) {
    updateNickname(target.value);
  } else if (target.matches("[data-role='new-profile']")) {
    createProfileAndSwitch(target.value);
    target.value = "";
  } else if (target.matches("[data-role='avatar-upload']") && target.files?.[0]) {
    updateAvatar(target.files[0]);
  } else if (target.matches("[data-role='import-save']") && target.files?.[0]) {
    importSaveFile(target.files[0]);
    target.value = "";
  } else if (target.matches("[data-role='bet-custom']")) {
    updateBet(Number(target.value));
  }
}

function enableDropZones() {
  for (const zone of app.querySelectorAll("[data-drop-zone]")) {
    zone.addEventListener("dragover", (event) => event.preventDefault());
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      ui.selectedCardId = event.dataTransfer?.getData("text/plain") ?? "";
      moveCardTo(zone.dataset.dropZone);
    });
  }

  for (const card of app.querySelectorAll("[data-drag-card]")) {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", card.dataset.dragCard ?? "");
    });
  }
}

function cardFace(card) {
  const red = card.pips.map((value) => `<span class="pip pip-${value} ${value % 2 === 0 ? "red" : ""}">${"●".repeat(value)}</span>`).join("");
  return `
    <div class="card-face">
      <div class="card-title">${card.name}</div>
      <div class="card-pips">${red}</div>
      <div class="card-label">${card.shortLabel}</div>
    </div>
  `;
}

function renderCards(cards, action, selectedId = "") {
  return cards
    .map(
      (card) => `
        <button class="tile ${selectedId === card.id ? "selected" : ""}" data-action="${action}" data-value="${card.id}" draggable="true" data-drag-card="${card.id}">
          ${cardFace(card)}
        </button>
      `,
    )
    .join("");
}

function renderLockedCards(cards, labelEval) {
  return cards
    .map(
      (card) => `
        <div class="tile static">
          ${cardFace(card)}
        </div>
      `,
    )
    .join("") + `<div class="hand-badge">${labelEval.display}</div>`;
}

function renderHome() {
  const profile = activeProfile();
  const achievements = ACHIEVEMENTS.filter((item) => profile.achievements.includes(item.id));

  return `
    <section class="hero-card">
      <div class="hero-top">
        <div class="profile-box">
          <div class="avatar ${profile.avatar ? "has-image" : ""}">
            ${profile.avatar ? `<img src="${profile.avatar}" alt="avatar" />` : profile.nickname.slice(0, 1)}
          </div>
          <div>
            <p class="eyebrow">当前牌友</p>
            <h2>${profile.nickname}</h2>
            <p>挑战筹码 ${formatChips(profile.chips)} / 无尽筹码 ${formatChips(profile.endlessChips)}</p>
          </div>
        </div>
        <div class="summary-chips">
          <span>今日状态</span>
          <strong>${ui.rewardToast || "离线可玩"}</strong>
        </div>
      </div>

      <div class="brand-lockup">
        <p class="eyebrow">New Chinese Tabletop</p>
        <h1>牌九大师</h1>
        <p class="lead">纯前端单机桌面牌九游戏。支持本地存档、多账户、教学模式、自动分牌建议与离线游玩。</p>
      </div>

      <div class="mode-grid">
        ${Object.values(MODES)
          .map(
            (mode) => `
            <button class="mode-card" data-action="open-mode" data-value="${mode.id}">
              <span>${mode.name}</span>
              <small>${mode.tagline}</small>
            </button>
          `,
          )
          .join("")}
      </div>
    </section>

    <section class="dashboard">
      <div class="panel">
        <div class="panel-head">
          <h3>说明</h3>
          <div class="tab-row">
            <button class="${ui.detailTab === "rules" ? "active" : ""}" data-action="change-tab" data-value="rules">规则</button>
            <button class="${ui.detailTab === "rankings" ? "active" : ""}" data-action="change-tab" data-value="rankings">牌型</button>
            <button class="${ui.detailTab === "stats" ? "active" : ""}" data-action="change-tab" data-value="stats">统计</button>
          </div>
        </div>
        ${renderDetailPanel(profile, achievements)}
      </div>

      <div class="panel side-panel">
        <div class="panel-head">
          <h3>本地账户</h3>
          <button class="ghost" data-action="export">导出存档</button>
        </div>
        <div class="profile-list">
          ${state.profiles
            .map(
              (profileItem) => `
                <button class="profile-chip ${profileItem.id === profile.id ? "active" : ""}" data-action="switch-profile" data-value="${profileItem.id}">
                  ${profileItem.nickname}
                </button>
              `,
            )
            .join("")}
        </div>
        <label class="field">
          <span>修改昵称</span>
          <input data-role="nickname" value="${profile.nickname}" maxlength="12" />
        </label>
        <label class="field">
          <span>新增存档（输入名称后切换焦点创建）</span>
          <input data-role="new-profile" placeholder="例如：阿福" />
        </label>
        <label class="field">
          <span>上传头像</span>
          <input type="file" accept="image/*" data-role="avatar-upload" />
        </label>
        <label class="field">
          <span>导入存档</span>
          <input type="file" accept="application/json" data-role="import-save" />
        </label>
        <div class="mini-stat">
          <span>破产保护</span>
          <strong>${canClaimBailout(profile) ? "可领取" : "今日已用或尚未破产"}</strong>
        </div>
        <div class="actions">
          <button data-action="claim-bailout" ${canClaimBailout(profile) ? "" : "disabled"}>领取 3000 补助</button>
          <button data-action="reset-challenge">重置挑战筹码</button>
        </div>
      </div>
    </section>
  `;
}

function renderDetailPanel(profile, achievements) {
  if (ui.detailTab === "rules") {
    return `
      <div class="info-stack">
        ${RULE_NOTES.map((item) => `<p>${item}</p>`).join("")}
      </div>
    `;
  }

  if (ui.detailTab === "rankings") {
    return `
      <ol class="ranking-list">
        ${PAIR_ORDER.map((item) => `<li>${item}</li>`).join("")}
      </ol>
    `;
  }

  return `
    <div class="stats-grid">
      <div><span>总局数</span><strong>${profile.stats.gamesPlayed}</strong></div>
      <div><span>双赢局</span><strong>${profile.stats.doubleWins}</strong></div>
      <div><span>和局</span><strong>${profile.stats.pushes}</strong></div>
      <div><span>双输局</span><strong>${profile.stats.doubleLosses + profile.stats.fouls}</strong></div>
      <div><span>净盈利</span><strong>${formatChips(profile.stats.netProfit)}</strong></div>
      <div><span>最高连胜</span><strong>${profile.stats.bestWinStreak}</strong></div>
      <div><span>最高下注</span><strong>${formatChips(profile.stats.highestBet)}</strong></div>
      <div><span>最高 bankroll</span><strong>${formatChips(profile.stats.biggestBankroll)}</strong></div>
    </div>
    <div class="achievement-panel">
      <h4>成就</h4>
      <div class="achievement-list">
        ${ACHIEVEMENTS.map((achievement) => {
          const unlocked = achievements.some((item) => item.id === achievement.id);
          return `
            <article class="achievement ${unlocked ? "unlocked" : ""}">
              <strong>${achievement.title}</strong>
              <p>${achievement.description}</p>
              <span>奖励 ${formatChips(achievement.reward)}</span>
            </article>
          `;
        }).join("")}
      </div>
      <h4>最近战绩</h4>
      <div class="history-list">
        ${profile.history.length
          ? profile.history
              .map(
                (record) => `
                <div class="history-row">
                  <span>${record.at}</span>
                  <strong>${MODES[record.modeId]?.name ?? record.modeId} · ${record.summary}</strong>
                  <span>下注 ${formatChips(record.bet)} / 结算 ${record.net > 0 ? "+" : ""}${formatChips(record.net)}</span>
                </div>
              `,
              )
              .join("")
          : `<p>还没有历史记录。</p>`}
      </div>
    </div>
  `;
}

function renderTutorial() {
  return `
    <section class="tutorial-shell">
      <div class="panel-head">
        <h2>教学关卡</h2>
        <button class="ghost" data-action="back-home">返回大厅</button>
      </div>
      <div class="tutorial-grid">
        ${TUTORIAL_STEPS.map(
          (step, index) => `
            <article class="tutorial-card">
              <span>第 ${index + 1} 步</span>
              <h3>${step.title}</h3>
              <p>${step.body}</p>
            </article>
          `,
        ).join("")}
      </div>
      <div class="example-strip">
        <article class="example-card">
          <h3>正确分牌</h3>
          <p>前组 4 点，后组 8 点，满足前小后大，可正常比牌。</p>
        </article>
        <article class="example-card">
          <h3>犯规示例</h3>
          <p>前组是人牌对，后组只有 6 点。前组大于后组，系统直接判负。</p>
        </article>
      </div>
    </section>
  `;
}

function renderGame() {
  const round = ui.round;
  const profile = activeProfile();

  if (!round) {
    return "";
  }

  const frontEval = round.front.length === 2 ? evaluateHand(round.front) : null;
  const backEval = round.back.length === 2 ? evaluateHand(round.back) : null;
  const chips = getCurrentChips(profile);

  return `
    <section class="game-shell">
      <div class="panel-head compact">
        <button class="ghost" data-action="back-home">返回大厅</button>
        <h2>${MODES[ui.modeId].name}</h2>
        <div class="status-line">下注 ${formatChips(ui.bet)} · 当前筹码 ${formatChips(chips)}</div>
      </div>

      <div class="table-layout">
        <section class="dealer-panel">
          <p class="eyebrow">庄家区域</p>
          <div class="locked-hand">
            ${
              round.revealed
                ? `
                  <div class="hand-column">
                    <span>前组</span>
                    <div class="tile-row">${renderLockedCards(round.bankerSplit.front, evaluateHand(round.bankerSplit.front))}</div>
                  </div>
                  <div class="hand-column">
                    <span>后组</span>
                    <div class="tile-row">${renderLockedCards(round.bankerSplit.back, evaluateHand(round.bankerSplit.back))}</div>
                  </div>
                `
                : `<div class="dealer-hidden">庄家分牌将在确认后翻开</div>`
            }
          </div>
        </section>

        <section class="player-panel">
          <div class="panel-head compact">
            <div>
              <p class="eyebrow">你的牌</p>
              <h3>点击或拖拽到前后组</h3>
            </div>
            <div class="actions">
              <button class="ghost" data-action="suggest">智能分牌</button>
              <button data-action="confirm" ${round.revealed ? "disabled" : ""}>确认分牌</button>
            </div>
          </div>

          <div class="tile-row pool">${renderCards(round.playerCards, "select-card", ui.selectedCardId)}</div>

          <div class="split-grid">
            <div class="drop-panel" data-drop-zone="front">
              <div class="drop-head">
                <strong>前组</strong>
                <button class="ghost mini" data-action="move-front" ${ui.selectedCardId ? "" : "disabled"}>放入前组</button>
              </div>
              <div class="tile-row">${renderCards(round.front, "return-front")}</div>
              <p>${frontEval ? frontEval.display : "放入 2 张牌"}</p>
            </div>
            <div class="drop-panel" data-drop-zone="back">
              <div class="drop-head">
                <strong>后组</strong>
                <button class="ghost mini" data-action="move-back" ${ui.selectedCardId ? "" : "disabled"}>放入后组</button>
              </div>
              <div class="tile-row">${renderCards(round.back, "return-back")}</div>
              <p>${backEval ? backEval.display : "放入 2 张牌"}</p>
            </div>
          </div>

          <div class="bet-strip">
            <label class="field inline">
              <span>自定义下注</span>
              <input type="number" min="${Number.isFinite(chips) && chips < 100 ? 1 : 100}" step="100" value="${ui.bet}" data-role="bet-custom" ${round.revealed ? "disabled" : ""} />
            </label>
            <div class="actions">
              <button class="ghost" data-action="bet-step" data-value="-100">-100</button>
              <button class="ghost" data-action="bet-step" data-value="100">+100</button>
              <button class="ghost" data-action="bet-step" data-value="500">+500</button>
              <button class="ghost" data-action="bet-max">最大</button>
            </div>
          </div>

          <div class="suggest-panel">
            <span>推荐方案</span>
            <strong>前组 ${round.suggestion.frontEval.display} / 后组 ${round.suggestion.backEval.display}</strong>
          </div>
        </section>
      </div>

      ${round.revealed ? renderSettlement(round.result) : ""}
    </section>
  `;
}

function renderSettlement(result) {
  return `
    <section class="settlement-panel ${result.outcome}">
      <div>
        <p class="eyebrow">本局结算</p>
        <h3>${result.summary}</h3>
        <p>前组 ${result.playerFront.display} vs ${result.bankerFront.display} · ${result.frontResult}</p>
        <p>后组 ${result.playerBack.display} vs ${result.bankerBack.display} · ${result.backResult}</p>
      </div>
      <div class="settlement-net">
        <span>筹码变化</span>
        <strong>${result.net > 0 ? "+" : ""}${formatChips(result.net)}</strong>
      </div>
      <button data-action="next-round">再来一局</button>
    </section>
  `;
}

function renderLayout() {
  return `
    <main class="shell theme-${state.settings.theme}">
      ${ui.screen === "home" ? renderHome() : ""}
      ${ui.screen === "tutorial" ? renderTutorial() : ""}
      ${ui.screen === "game" ? renderGame() : ""}
      ${ui.toast ? `<div class="toast">${ui.toast}</div>` : ""}
    </main>
  `;
}

function render() {
  app.innerHTML = renderLayout();
  enableDropZones();
}

claimDailyRewardIfNeeded();
registerServiceWorker();
app.addEventListener("click", onAppClick);
app.addEventListener("change", onAppChange);
render();
