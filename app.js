const STORAGE_KEY = "paijiu-master-save-v1";
const PIP_POSITIONS = {
  1: [{ x: 50, y: 50 }],
  2: [
    { x: 30, y: 30 },
    { x: 70, y: 70 },
  ],
  3: [
    { x: 30, y: 30 },
    { x: 50, y: 50 },
    { x: 70, y: 70 },
  ],
  4: [
    { x: 30, y: 30 },
    { x: 70, y: 30 },
    { x: 30, y: 70 },
    { x: 70, y: 70 },
  ],
  5: [
    { x: 30, y: 30 },
    { x: 70, y: 30 },
    { x: 50, y: 50 },
    { x: 30, y: 70 },
    { x: 70, y: 70 },
  ],
  6: [
    { x: 30, y: 22 },
    { x: 70, y: 22 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 30, y: 78 },
    { x: 70, y: 78 },
  ],
};

const TILE_DEFS = [
  { code: "tian-1", name: "天牌", points: 12, pairKey: "tian", singleRank: 31, top: { count: 6, colors: ["red", "red", "red", "black", "black", "black"] }, bottom: { count: 6, colors: ["red", "red", "red", "black", "black", "black"] } },
  { code: "tian-2", name: "天牌", points: 12, pairKey: "tian", singleRank: 31, top: { count: 6, colors: ["red", "red", "red", "black", "black", "black"] }, bottom: { count: 6, colors: ["red", "red", "red", "black", "black", "black"] } },
  { code: "di-1", name: "地牌", points: 2, pairKey: "di", singleRank: 30, top: { count: 1, colors: ["red"] }, bottom: { count: 1, colors: ["red"] } },
  { code: "di-2", name: "地牌", points: 2, pairKey: "di", singleRank: 30, top: { count: 1, colors: ["red"] }, bottom: { count: 1, colors: ["red"] } },
  { code: "ren-1", name: "人牌", points: 8, pairKey: "ren", singleRank: 29, top: { count: 4, colors: ["red", "red", "red", "red"] }, bottom: { count: 4, colors: ["red", "red", "red", "red"] } },
  { code: "ren-2", name: "人牌", points: 8, pairKey: "ren", singleRank: 29, top: { count: 4, colors: ["red", "red", "red", "red"] }, bottom: { count: 4, colors: ["red", "red", "red", "red"] } },
  { code: "he-1", name: "和牌", points: 4, pairKey: "he", singleRank: 28, top: { count: 1, colors: ["red"] }, bottom: { count: 3, colors: ["black", "black", "black"] } },
  { code: "he-2", name: "和牌", points: 4, pairKey: "he", singleRank: 28, top: { count: 1, colors: ["red"] }, bottom: { count: 3, colors: ["black", "black", "black"] } },
  { code: "mei-1", name: "梅花", points: 10, pairKey: "mei", singleRank: 27, top: { count: 5, colors: ["black", "black", "black", "black", "black"] }, bottom: { count: 5, colors: ["black", "black", "black", "black", "black"] } },
  { code: "mei-2", name: "梅花", points: 10, pairKey: "mei", singleRank: 27, top: { count: 5, colors: ["black", "black", "black", "black", "black"] }, bottom: { count: 5, colors: ["black", "black", "black", "black", "black"] } },
  { code: "changsan-1", name: "长三", points: 6, pairKey: "changsan", singleRank: 26, top: { count: 3, colors: ["black", "black", "black"] }, bottom: { count: 3, colors: ["black", "black", "black"] } },
  { code: "changsan-2", name: "长三", points: 6, pairKey: "changsan", singleRank: 26, top: { count: 3, colors: ["black", "black", "black"] }, bottom: { count: 3, colors: ["black", "black", "black"] } },
  { code: "bandeng-1", name: "板凳", points: 4, pairKey: "bandeng", singleRank: 25, top: { count: 2, colors: ["black", "black"] }, bottom: { count: 2, colors: ["black", "black"] } },
  { code: "bandeng-2", name: "板凳", points: 4, pairKey: "bandeng", singleRank: 25, top: { count: 2, colors: ["black", "black"] }, bottom: { count: 2, colors: ["black", "black"] } },
  { code: "futou-1", name: "斧头", points: 11, pairKey: "futou", singleRank: 24, top: { count: 5, colors: ["black", "black", "black", "black", "black"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "futou-2", name: "斧头", points: 11, pairKey: "futou", singleRank: 24, top: { count: 5, colors: ["black", "black", "black", "black", "black"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "hongtou-1", name: "红头十", points: 10, pairKey: "hongtou", singleRank: 23, top: { count: 4, colors: ["red", "red", "red", "red"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "hongtou-2", name: "红头十", points: 10, pairKey: "hongtou", singleRank: 23, top: { count: 4, colors: ["red", "red", "red", "red"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "gaojiaoqi-1", name: "高脚七", points: 7, pairKey: "gaojiaoqi", singleRank: 22, top: { count: 1, colors: ["red"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "gaojiaoqi-2", name: "高脚七", points: 7, pairKey: "gaojiaoqi", singleRank: 22, top: { count: 1, colors: ["red"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "linglinliu-1", name: "零霖六", points: 6, pairKey: "linglinliu", singleRank: 21, top: { count: 1, colors: ["red"] }, bottom: { count: 5, colors: ["black", "black", "black", "black", "black"] } },
  { code: "linglinliu-2", name: "零霖六", points: 6, pairKey: "linglinliu", singleRank: 21, top: { count: 1, colors: ["red"] }, bottom: { count: 5, colors: ["black", "black", "black", "black", "black"] } },
  { code: "hongjiu", name: "红九", points: 9, pairKey: "hongjiu", singleRank: 20, top: { count: 4, colors: ["red", "red", "red", "red"] }, bottom: { count: 5, colors: ["black", "black", "black", "black", "black"] } },
  { code: "heijiu", name: "黑九", points: 9, pairKey: "heijiu", singleRank: 19, top: { count: 3, colors: ["black", "black", "black"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "pingba", name: "平八", points: 8, pairKey: "pingba", singleRank: 18, top: { count: 2, colors: ["black", "black"] }, bottom: { count: 6, colors: ["black", "black", "black", "black", "black", "black"] } },
  { code: "xieba", name: "斜八", points: 8, pairKey: "xieba", singleRank: 17, top: { count: 3, colors: ["black", "black", "black"] }, bottom: { count: 5, colors: ["black", "black", "black", "black", "black"] } },
  { code: "hongqi", name: "红七", points: 7, pairKey: "hongqi", singleRank: 16, top: { count: 3, colors: ["black", "black", "black"] }, bottom: { count: 4, colors: ["red", "red", "red", "red"] } },
  { code: "heiqi", name: "黑七", points: 7, pairKey: "heiqi", singleRank: 15, top: { count: 2, colors: ["black", "black"] }, bottom: { count: 5, colors: ["black", "black", "black", "black", "black"] } },
  { code: "hongwu", name: "红五", points: 5, pairKey: "hongwu", singleRank: 14, top: { count: 1, colors: ["red"] }, bottom: { count: 4, colors: ["black", "black", "black", "black"] } },
  { code: "heiwu", name: "黑五", points: 5, pairKey: "heiwu", singleRank: 13, top: { count: 2, colors: ["black", "black"] }, bottom: { count: 3, colors: ["black", "black", "black"] } },
  { code: "dahou", name: "大猴", points: 6, pairKey: "dahou", singleRank: 12, top: { count: 2, colors: ["black", "black"] }, bottom: { count: 4, colors: ["red", "red", "red", "red"] } },
  { code: "xiaohou", name: "小猴", points: 3, pairKey: "xiaohou", singleRank: 11, top: { count: 1, colors: ["red"] }, bottom: { count: 2, colors: ["black", "black"] } },
];

const PAIR_RANKS = new Map([
  ["zhizunbao", { rank: 16, label: "至尊宝" }],
  ["tian", { rank: 15, label: "双天" }],
  ["di", { rank: 14, label: "双地" }],
  ["ren", { rank: 13, label: "双人" }],
  ["he", { rank: 12, label: "双和" }],
  ["mei", { rank: 11, label: "双梅" }],
  ["changsan", { rank: 10, label: "双长" }],
  ["bandeng", { rank: 9, label: "双板凳" }],
  ["futou", { rank: 8, label: "双斧头" }],
  ["hongtou", { rank: 7, label: "双红头" }],
  ["gaojiaoqi", { rank: 6, label: "双高脚" }],
  ["linglinliu", { rank: 5, label: "双零霖" }],
  ["za9", { rank: 4, label: "杂九对" }],
  ["za8", { rank: 3, label: "杂八对" }],
  ["za7", { rank: 2, label: "杂七对" }],
  ["za5", { rank: 1, label: "杂五对" }],
]);

const SPECIAL_HANDS = [
  { key: "tianwang", label: "天王", matcher: (a, b) => includes(a, b, "tian") && [9].includes(otherTile(a, b, "tian").points), points: 1, tiebreak: 6 },
  { key: "diwang", label: "地王", matcher: (a, b) => includes(a, b, "di") && [9].includes(otherTile(a, b, "di").points), points: 1, tiebreak: 5 },
  { key: "tiangang", label: "天杠", matcher: (a, b) => includes(a, b, "tian") && [8].includes(otherTile(a, b, "tian").points), points: 0, tiebreak: 4 },
  { key: "digang", label: "地杠", matcher: (a, b) => includes(a, b, "di") && [8].includes(otherTile(a, b, "di").points), points: 0, tiebreak: 3 },
  { key: "tiangaojiu", label: "天高九", matcher: (a, b) => includes(a, b, "tian") && includes(a, b, "heiqi"), points: 9, tiebreak: 2 },
  { key: "digaojiu", label: "地高九", matcher: (a, b) => includes(a, b, "di") && includes(a, b, "gaojiaoqi"), points: 9, tiebreak: 1 },
];

const MODE_META = {
  small: { title: "小牌九", description: "标准 2 张快节奏对局" },
};

const RULES_SECTIONS = [
  {
    title: "核心规则",
    lines: [
      "每局你和庄家各得 2 张牌，直接比大小。",
      "对牌永远大于非对牌，至尊宝是最大对牌。",
      "非对牌比较点数个位数，同点数再比最大单张。",
      "完全相同默认庄家赢，可在设置中关闭庄家优势。",
    ],
  },
  {
    title: "特殊组合",
    lines: [
      "支持天王、地王、天杠、地杠、天高九、地高九。",
      "这些组合按文档作为命名牌处理，并在同点数时优先于普通点数牌。",
    ],
  },
  {
    title: "存档与奖励",
    lines: [
      "首次创建存档赠送 10,000 筹码。",
      "每日首次登录额外领取 1,000 筹码。",
      "筹码为 0 时可每日免费重置 1 次。",
    ],
  },
];

const state = {
  db: loadDatabase(),
  ui: {
    mode: "small",
    bet: 500,
    stage: "idle",
    wall: [],
    dice: null,
    round: null,
  },
};

const DIE_FACE_ORDER = [1, 6, 2, 5, 3, 4];

const els = mapElements();

boot();

function boot() {
  ensureProfiles();
  bindEvents();
  renderRules();
  renderComboPreview();
  applyTheme();
  setupOrientationGuard();
  awardDailyBonus();
  refreshAll();
  registerServiceWorker();
}

function mapElements() {
  return {
    playerName: document.getElementById("playerName"),
    playerMeta: document.getElementById("playerMeta"),
    chipsValue: document.getElementById("chipsValue"),
    betValue: document.getElementById("betValue"),
    diceValues: document.getElementById("diceValues"),
    diceSummary: document.getElementById("diceSummary"),
    bankerTiles: document.getElementById("bankerTiles"),
    playerTiles: document.getElementById("playerTiles"),
    bankerHandCaption: document.getElementById("bankerHandCaption"),
    playerHandCaption: document.getElementById("playerHandCaption"),
    bankerResultLabel: document.getElementById("bankerResultLabel"),
    playerResultLabel: document.getElementById("playerResultLabel"),
    roundBanner: document.getElementById("roundBanner"),
    historyList: document.getElementById("historyList"),
    statsGrid: document.getElementById("statsGrid"),
    comboPreview: document.getElementById("comboPreview"),
    profileList: document.getElementById("profileList"),
    profileNameInput: document.getElementById("profileNameInput"),
    avatarInput: document.getElementById("avatarInput"),
    importDataInput: document.getElementById("importDataInput"),
    playerAvatar: document.getElementById("playerAvatar"),
    avatarFallback: document.getElementById("avatarFallback"),
    specialCombosToggle: document.getElementById("specialCombosToggle"),
    bankerAdvantageToggle: document.getElementById("bankerAdvantageToggle"),
    lightThemeToggle: document.getElementById("lightThemeToggle"),
    detailsDialog: document.getElementById("detailsDialog"),
    rulesContent: document.getElementById("rulesContent"),
    toastStack: document.getElementById("toastStack"),
    orientationGuard: document.getElementById("orientationGuard"),
    orientationContinueButton: document.getElementById("orientationContinueButton"),
    openDetailsButton: document.getElementById("openDetailsButton"),
    createProfileButton: document.getElementById("createProfileButton"),
    exportDataButton: document.getElementById("exportDataButton"),
    halfButton: document.getElementById("halfButton"),
    maxButton: document.getElementById("maxButton"),
    dealButton: document.getElementById("dealButton"),
  };
}

function bindEvents() {
  document.querySelectorAll(".bet-adjust").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = getActiveProfile();
      const step = Math.max(100, Math.floor(profile.chips / 20 / 100) * 100 || 100);
      if (button.dataset.action === "increase") {
        state.ui.bet = clampBet(state.ui.bet + step);
      } else {
        state.ui.bet = clampBet(state.ui.bet - step);
      }
      refreshBet();
    });
  });

  els.halfButton.addEventListener("click", () => {
    const profile = getActiveProfile();
    state.ui.bet = clampBet(Math.floor(profile.chips / 2 / 100) * 100 || 100);
    refreshBet();
  });

  els.maxButton.addEventListener("click", () => {
    state.ui.bet = clampBet(getActiveProfile().chips);
    refreshBet();
  });

  els.dealButton.addEventListener("click", startRound);
  els.orientationContinueButton.addEventListener("click", () => {
    if (canForceDismissOrientationGuard()) {
      document.body.classList.remove("orientation-required");
      els.orientationGuard.hidden = true;
      return;
    }
    toast("请先将设备旋转到横屏后再继续。", "error");
  });
  els.openDetailsButton.addEventListener("click", () => {
    syncSettingsInputs();
    els.detailsDialog.showModal();
  });
  els.createProfileButton.addEventListener("click", createProfileFromInput);
  els.exportDataButton.addEventListener("click", exportData);
  els.importDataInput.addEventListener("change", importData);
  els.avatarInput.addEventListener("change", handleAvatarSelection);

  els.specialCombosToggle.addEventListener("change", () => {
    getActiveProfile().settings.specialCombos = els.specialCombosToggle.checked;
    persist();
    refreshAll();
  });
  els.bankerAdvantageToggle.addEventListener("change", () => {
    getActiveProfile().settings.bankerAdvantage = els.bankerAdvantageToggle.checked;
    persist();
    refreshAll();
  });
  els.lightThemeToggle.addEventListener("change", () => {
    state.db.preferences.theme = els.lightThemeToggle.checked ? "light" : "dark";
    persist();
    applyTheme();
  });
}

function ensureProfiles() {
  if (!state.db.profiles.length) {
    const profile = createProfile("访客玩家");
    state.db.profiles.push(profile);
    state.db.activeProfileId = profile.id;
    persist();
  }
  if (!state.db.activeProfileId || !state.db.profiles.find((profile) => profile.id === state.db.activeProfileId)) {
    state.db.activeProfileId = state.db.profiles[0].id;
  }
}

function createProfile(name, avatar = "") {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    nickname: name || "新玩家",
    avatar,
    chips: 10000,
    createdAt: now,
    lastDailyReward: "",
    lastBankruptReset: "",
    stats: {
      rounds: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      bestStreak: 0,
      currentStreak: 0,
      profit: 0,
    },
    settings: {
      specialCombos: true,
      bankerAdvantage: true,
    },
    history: [],
  };
}

function loadDatabase() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { activeProfileId: "", profiles: [], preferences: { theme: "dark" } };
    }
    const parsed = JSON.parse(raw);
    return {
      activeProfileId: parsed.activeProfileId || "",
      profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
      preferences: parsed.preferences || { theme: "dark" },
    };
  } catch (error) {
    console.error(error);
    return { activeProfileId: "", profiles: [], preferences: { theme: "dark" } };
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.db));
}

function getActiveProfile() {
  return state.db.profiles.find((profile) => profile.id === state.db.activeProfileId);
}

function refreshAll() {
  refreshHeader();
  refreshBet();
  refreshTable();
  renderHistory();
  renderStats();
  renderProfiles();
  syncSettingsInputs();
}

function refreshHeader() {
  const profile = getActiveProfile();
  els.playerName.textContent = profile.nickname;
  els.playerMeta.textContent = `总局数 ${formatNumber(profile.stats.rounds)} · 总盈利 ${formatSigned(profile.stats.profit)}`;
  els.chipsValue.textContent = formatNumber(profile.chips);
  els.playerAvatar.hidden = !profile.avatar;
  els.avatarFallback.hidden = Boolean(profile.avatar);
  if (profile.avatar) {
    els.playerAvatar.src = profile.avatar;
  }
}

function refreshBet() {
  state.ui.bet = clampBet(state.ui.bet);
  els.betValue.textContent = formatNumber(state.ui.bet);
  els.dealButton.disabled = state.ui.stage !== "idle" || state.ui.bet <= 0 || getActiveProfile().chips <= 0;
}

function refreshTable() {
  const round = state.ui.round;
  if (!round) {
    renderTiles(els.bankerTiles, [{ back: true }, { back: true }]);
    renderTiles(els.playerTiles, [{ back: true }, { back: true }]);
    els.bankerHandCaption.textContent = "-";
    els.playerHandCaption.textContent = "-";
    els.bankerResultLabel.textContent = "待发牌";
    els.playerResultLabel.textContent = "待发牌";
    els.roundBanner.textContent = "押注后开始本局";
    renderDice([0, 0], false);
    els.diceSummary.textContent = "尚未掷骰";
    return;
  }

  const visibleDice = state.ui.stage === "rolling" ? round.rollingDice || round.dice : round.dice;
  const allRevealed = areAllCardsRevealed(round);
  renderDice(visibleDice, state.ui.stage === "rolling");
  els.diceSummary.textContent = state.ui.stage === "rolling" ? "骰盅摇动中" : `起始牌墙位置 ${round.startIndex + 1}`;
  renderTiles(
    els.bankerTiles,
    round.bankerTiles.length
      ? round.bankerTiles.map((tile, index) => ({
          ...tile,
          hidden: !round.revealedBanker[index],
          spotlight: round.activeReveal?.side === "banker" && round.activeReveal?.index === index,
        }))
      : [{ back: true }, { back: true }]
  );
  renderTiles(
    els.playerTiles,
    round.playerTiles.length
      ? round.playerTiles.map((tile, index) => ({
          ...tile,
          hidden: !round.revealedPlayer[index],
          spotlight: round.activeReveal?.side === "player" && round.activeReveal?.index === index,
        }))
      : [{ back: true }, { back: true }]
  );
  els.bankerHandCaption.textContent = allRevealed ? round.bankerEval.description : "庄家即将亮牌";
  els.playerHandCaption.textContent = allRevealed ? round.playerEval.description : "请等待翻牌";
  els.bankerResultLabel.textContent = allRevealed ? round.bankerEval.title : "牌背";
  els.playerResultLabel.textContent = allRevealed ? round.playerEval.title : "牌背";
  els.roundBanner.textContent = round.banner;
}

function renderTiles(container, tiles) {
  const nextKey = JSON.stringify(
    tiles.map((tile) => ({
      code: tile.code || tile.name || "back",
      back: Boolean(tile.back),
      hidden: Boolean(tile.hidden),
      spotlight: Boolean(tile.spotlight),
    }))
  );
  if (container.dataset.renderKey === nextKey) {
    return;
  }
  container.dataset.renderKey = nextKey;
  container.innerHTML = "";
  tiles.forEach((tile) => container.appendChild(buildTile(tile)));
}

function buildTile(tile) {
  const node = document.createElement("div");
  node.className = `tile${tile.hidden ? " hidden-face" : ""}${tile.back ? " back" : ""}${tile.spotlight ? " spotlight" : ""}`;
  if (tile.back) {
    return node;
  }

  const body = document.createElement("div");
  body.className = "tile-body";

  const front = document.createElement("div");
  front.className = "tile-face tile-front";

  const back = document.createElement("div");
  back.className = "tile-face tile-back";

  const label = document.createElement("div");
  label.className = "tile-name";
  label.textContent = tile.name;
  front.appendChild(label);

  const divider = document.createElement("div");
  divider.className = "tile-divider";
  front.appendChild(divider);

  front.appendChild(buildHalf(tile.top, "top"));
  front.appendChild(buildHalf(tile.bottom, "bottom"));
  body.appendChild(front);
  body.appendChild(back);
  node.appendChild(body);
  return node;
}

function renderDice(values, rolling) {
  const dice = Array.isArray(values) && values.length === 2 ? values : [0, 0];
  els.diceValues.innerHTML = "";
  dice.forEach((value, index) => {
    const die = document.createElement("div");
    die.className = `die${rolling ? " is-rolling" : ""}${value ? "" : " is-idle"}`;
    die.setAttribute("data-value", String(value || 1));
    die.setAttribute("aria-hidden", "true");
    die.style.animationDelay = `${index * 90}ms`;

    const cube = document.createElement("div");
    cube.className = "die-cube";
    DIE_FACE_ORDER.forEach((faceValue, faceIndex) => {
      const face = document.createElement("div");
      face.className = `die-face face-${faceIndex + 1}`;
      const positions = PIP_POSITIONS[faceValue];
      positions.forEach((point) => {
        const pip = document.createElement("span");
        pip.className = "die-pip";
        pip.style.left = `${point.x}%`;
        pip.style.top = `${point.y}%`;
        face.appendChild(pip);
      });
      cube.appendChild(face);
    });

    if (!value) {
      const idleMark = document.createElement("div");
      idleMark.className = "die-idle-mark";
      idleMark.textContent = "?";
      die.appendChild(idleMark);
    }

    die.appendChild(cube);
    els.diceValues.appendChild(die);
  });
}

function buildHalf(half, position) {
  const node = document.createElement("div");
  node.className = `tile-half ${position}`;
  const positions = PIP_POSITIONS[half.count];
  positions.forEach((point, index) => {
    const pip = document.createElement("span");
    pip.className = `pip ${half.colors[index]}`;
    pip.style.left = `${point.x}%`;
    pip.style.top = `${point.y}%`;
    node.appendChild(pip);
  });
  return node;
}

function renderComboPreview() {
  const items = [
    { title: "至尊宝", description: "小猴 + 大猴，最大对牌" },
    { title: "双天", description: "天牌对，所有文牌对中仅次于至尊宝" },
    { title: "杂九对", description: "红九 + 黑九，杂对里最大" },
    { title: "点数比牌", description: "非对牌按个位数，同点再比最大单张" },
  ];
  els.comboPreview.innerHTML = items
    .map((item) => `<div class="combo-item"><strong>${item.title}</strong><p class="muted">${item.description}</p></div>`)
    .join("");
}

function renderRules() {
  els.rulesContent.innerHTML = RULES_SECTIONS.map((section) => {
    const lines = section.lines.map((line) => `<p class="muted">${line}</p>`).join("");
    return `<section class="rules-section"><strong>${section.title}</strong>${lines}</section>`;
  }).join("");
}

function renderHistory() {
  const profile = getActiveProfile();
  if (!profile.history.length) {
    els.historyList.innerHTML = '<div class="history-item"><strong>暂无记录</strong><p class="muted">开始第一局后，这里会展示最近 10 条战绩。</p></div>';
    return;
  }
  els.historyList.innerHTML = profile.history
    .slice(0, 10)
    .map((item) => {
      const value = item.delta > 0 ? `+${formatNumber(item.delta)}` : formatNumber(item.delta);
      return `<div class="history-item"><strong>${item.result} · ${item.playerTitle} vs ${item.bankerTitle}</strong><p class="muted">${item.mode} · 下注 ${formatNumber(item.bet)} · 结算 ${value}</p></div>`;
    })
    .join("");
}

function renderStats() {
  const { stats } = getActiveProfile();
  const winRate = stats.rounds ? `${Math.round((stats.wins / stats.rounds) * 100)}%` : "0%";
  const items = [
    ["总局数", formatNumber(stats.rounds)],
    ["胜率", winRate],
    ["最高连胜", formatNumber(stats.bestStreak)],
    ["总盈利", formatSigned(stats.profit)],
    ["当前连胜", formatNumber(stats.currentStreak)],
    ["当前筹码", formatNumber(getActiveProfile().chips)],
  ];
  els.statsGrid.innerHTML = items
    .map(([label, value]) => `<div class="stat-item"><strong>${value}</strong><p class="muted">${label}</p></div>`)
    .join("");
}

function renderProfiles() {
  const activeId = state.db.activeProfileId;
  els.profileList.innerHTML = state.db.profiles
    .map((profile) => {
      const selected = profile.id === activeId ? "当前使用" : "切换";
      return `
        <div class="profile-item">
          <div>
            <strong>${escapeHtml(profile.nickname)}</strong>
            <p class="muted">筹码 ${formatNumber(profile.chips)} · 总局数 ${formatNumber(profile.stats.rounds)}</p>
          </div>
          <div class="profile-actions">
            <button class="secondary-button" data-profile-action="switch" data-profile-id="${profile.id}">${selected}</button>
            <button class="ghost-button" data-profile-action="reset" data-profile-id="${profile.id}">破产保护</button>
            ${state.db.profiles.length > 1 ? `<button class="ghost-button" data-profile-action="delete" data-profile-id="${profile.id}">删除</button>` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  els.profileList.querySelectorAll("[data-profile-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.profileAction;
      const id = button.dataset.profileId;
      if (action === "switch") {
        state.db.activeProfileId = id;
        persist();
        refreshAll();
      } else if (action === "delete") {
        deleteProfile(id);
      } else if (action === "reset") {
        bankruptReset(id);
      }
    });
  });
}

function syncSettingsInputs() {
  const profile = getActiveProfile();
  els.specialCombosToggle.checked = profile.settings.specialCombos;
  els.bankerAdvantageToggle.checked = profile.settings.bankerAdvantage;
  els.lightThemeToggle.checked = state.db.preferences.theme === "light";
}

function createProfileFromInput() {
  const name = els.profileNameInput.value.trim() || `玩家${state.db.profiles.length + 1}`;
  const avatar = els.avatarInput.dataset.avatarData || "";
  const profile = createProfile(name, avatar);
  state.db.profiles.push(profile);
  state.db.activeProfileId = profile.id;
  els.profileNameInput.value = "";
  els.avatarInput.value = "";
  delete els.avatarInput.dataset.avatarData;
  persist();
  toast("新存档已创建，已赠送 10,000 筹码。", "success");
  refreshAll();
}

function deleteProfile(id) {
  if (id === state.db.activeProfileId) {
    const alternatives = state.db.profiles.filter((profile) => profile.id !== id);
    if (!alternatives.length) {
      toast("至少保留一个存档。", "error");
      return;
    }
    state.db.activeProfileId = alternatives[0].id;
  }
  state.db.profiles = state.db.profiles.filter((profile) => profile.id !== id);
  persist();
  refreshAll();
}

function handleAvatarSelection(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    els.avatarInput.dataset.avatarData = String(reader.result || "");
    toast("头像已载入，创建存档后生效。", "success");
  };
  reader.readAsDataURL(file);
}

function exportData() {
  const blob = new Blob([JSON.stringify(state.db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `paijiu-save-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      if (!Array.isArray(data.profiles) || !data.profiles.length) {
        throw new Error("无效存档");
      }
      state.db = {
        activeProfileId: data.activeProfileId || data.profiles[0].id,
        profiles: data.profiles,
        preferences: data.preferences || { theme: "dark" },
      };
      ensureProfiles();
      persist();
      refreshAll();
      toast("存档导入成功。", "success");
    } catch (error) {
      toast("导入失败，文件格式不正确。", "error");
    }
  };
  reader.readAsText(file);
}

function awardDailyBonus() {
  const profile = getActiveProfile();
  const today = currentDay();
  if (profile.lastDailyReward === today) {
    return;
  }
  profile.lastDailyReward = today;
  profile.chips += 1000;
  persist();
  toast("每日奖励已到账：+1,000 筹码。", "success");
}

function bankruptReset(profileId = state.db.activeProfileId) {
  const profile = state.db.profiles.find((item) => item.id === profileId);
  const today = currentDay();
  if (profile.chips > 0) {
    toast("当前筹码未归零，无需破产保护。", "error");
    return;
  }
  if (profile.lastBankruptReset === today) {
    toast("今天的破产保护已经使用过。", "error");
    return;
  }
  profile.lastBankruptReset = today;
  profile.chips = 10000;
  persist();
  toast("破产保护已生效，筹码重置为 10,000。", "success");
  refreshAll();
}

async function startRound() {
  const profile = getActiveProfile();
  if (state.ui.stage !== "idle") return;
  if (profile.chips <= 0) {
    toast("筹码不足，请使用破产保护或切换存档。", "error");
    return;
  }
  const bet = clampBet(state.ui.bet);
  if (bet <= 0 || bet > profile.chips) {
    toast("下注金额无效。", "error");
    return;
  }

  state.ui.stage = "building";
  const deck = shuffle([...TILE_DEFS]);
  const dice = rollDice();
  const startIndex = (dice[0] + dice[1] - 1) % 8;
  state.ui.wall = Array.from({ length: 8 }, (_, index) => ({ index, count: 4 }));
  state.ui.round = {
    mode: state.ui.mode,
    bet,
    dice,
    rollingDice: [randomDieValue(), randomDieValue()],
    startIndex,
    deck,
    playerTiles: [],
    bankerTiles: [],
    revealedBanker: [false, false],
    revealedPlayer: [false, false],
    activeReveal: null,
    playerEval: null,
    bankerEval: null,
    banner: "正在砌牌",
  };
  refreshAll();
  await pause(450);

  state.ui.stage = "rolling";
  state.ui.round.banner = "摇骰中";
  refreshTable();
  await animateDiceRoll(650);
  state.ui.round.rollingDice = null;
  state.ui.round.banner = "骰子落定，决定起牌位置";
  refreshTable();
  await pause(4000);

  state.ui.stage = "dealing";
  const orderedDeck = rotateDealDeck(deck, startIndex);
  const playerTiles = [orderedDeck[0], orderedDeck[2]];
  const bankerTiles = [orderedDeck[1], orderedDeck[3]];
  state.ui.round.playerTiles = playerTiles;
  state.ui.round.bankerTiles = bankerTiles;
  state.ui.wall = state.ui.wall.map((stack, index) => ({
    ...stack,
    count: index === startIndex ? 0 : stack.count,
  }));
  state.ui.round.banner = "牌已落桌，准备开牌";
  refreshTable();
  await pause(250);

  state.ui.stage = "revealing";
  const settings = getActiveProfile().settings;
  const playerEval = evaluateHand(playerTiles, settings);
  const bankerEval = evaluateHand(bankerTiles, settings);
  const outcome = compareHands(playerEval, bankerEval, settings.bankerAdvantage);
  state.ui.round.playerEval = playerEval;
  state.ui.round.bankerEval = bankerEval;
  state.ui.round.banner = "庄家先开第一张";
  state.ui.round.activeReveal = { side: "banker", index: 0 };
  refreshTable();
  state.ui.round.revealedBanker[0] = true;
  refreshTable();
  await pause(420);
  state.ui.round.banner = "庄家再开一张";
  state.ui.round.activeReveal = { side: "banker", index: 1 };
  state.ui.round.revealedBanker[1] = true;
  refreshTable();
  await pause(420);
  state.ui.round.banner = "闲家先开第一张";
  state.ui.round.activeReveal = { side: "player", index: 0 };
  state.ui.round.revealedPlayer[0] = true;
  refreshTable();
  await pause(420);
  state.ui.round.banner = "你翻开最后一张";
  state.ui.round.activeReveal = { side: "player", index: 1 };
  state.ui.round.revealedPlayer[1] = true;
  refreshTable();
  await pause(520);
  state.ui.round.activeReveal = null;
  state.ui.round.banner = outcome.banner;
  refreshTable();
  await pause(220);

  settleRound(outcome);
  state.ui.stage = "idle";
  refreshAll();
}

function settleRound(outcome) {
  const profile = getActiveProfile();
  const round = state.ui.round;
  let delta = 0;
  if (outcome.result === "win") {
    delta = round.bet;
    profile.stats.wins += 1;
    profile.stats.currentStreak += 1;
    profile.stats.bestStreak = Math.max(profile.stats.bestStreak, profile.stats.currentStreak);
  } else if (outcome.result === "lose") {
    delta = -round.bet;
    profile.stats.losses += 1;
    profile.stats.currentStreak = 0;
  } else {
    profile.stats.pushes += 1;
    profile.stats.currentStreak = 0;
  }

  profile.chips += delta;
  profile.stats.rounds += 1;
  profile.stats.profit += delta;
  profile.history.unshift({
    timestamp: new Date().toISOString(),
    mode: MODE_META[round.mode].title,
    result: outcome.banner,
    bet: round.bet,
    delta,
    playerTitle: round.playerEval.title,
    bankerTitle: round.bankerEval.title,
  });
  profile.history = profile.history.slice(0, 30);
  persist();

  if (profile.chips <= 0) {
    toast("筹码已归零，可在存档面板使用破产保护。", "error");
  } else {
    toast(`${outcome.banner}，本局结算 ${formatSigned(delta)}。`, delta >= 0 ? "success" : "error");
  }
}

function evaluateHand(tiles, settings) {
  const [left, right] = [...tiles].sort((a, b) => b.singleRank - a.singleRank);
  const pair = detectPair(left, right);
  if (pair) {
    return {
      category: "pair",
      title: pair.label,
      description: `${left.name} + ${right.name}`,
      strength: [2, pair.rank, left.singleRank, right.singleRank],
    };
  }

  if (settings.specialCombos) {
    const special = SPECIAL_HANDS.find((item) => item.matcher(left, right));
    if (special) {
      return {
        category: "special",
        title: special.label,
        description: `${left.name} + ${right.name}，${special.points}点`,
        points: special.points,
        strength: [1, special.points, special.tiebreak, left.singleRank, right.singleRank],
      };
    }
  }

  const points = (left.points + right.points) % 10;
  return {
    category: "points",
    title: points === 0 ? "瘪十" : `${points}点`,
    description: `${left.name} + ${right.name}`,
    points,
    strength: [1, points, 0, left.singleRank, right.singleRank],
  };
}

function compareHands(playerEval, bankerEval, bankerAdvantage) {
  const comparison = compareStrength(playerEval.strength, bankerEval.strength);
  if (comparison > 0) {
    return { result: "win", banner: "你赢了" };
  }
  if (comparison < 0) {
    return { result: "lose", banner: "庄家获胜" };
  }
  return { result: bankerAdvantage ? "lose" : "push", banner: bankerAdvantage ? "平手判庄家赢" : "本局和牌" };
}

function compareStrength(left, right) {
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const a = left[index] || 0;
    const b = right[index] || 0;
    if (a !== b) {
      return a > b ? 1 : -1;
    }
  }
  return 0;
}

function detectPair(left, right) {
  if (includes(left, right, "xiaohou") && includes(left, right, "dahou")) {
    return PAIR_RANKS.get("zhizunbao");
  }
  if (left.pairKey === right.pairKey && PAIR_RANKS.has(left.pairKey)) {
    return PAIR_RANKS.get(left.pairKey);
  }
  if (includes(left, right, "hongjiu") && includes(left, right, "heijiu")) {
    return PAIR_RANKS.get("za9");
  }
  if (includes(left, right, "pingba") && includes(left, right, "xieba")) {
    return PAIR_RANKS.get("za8");
  }
  if (includes(left, right, "hongqi") && includes(left, right, "heiqi")) {
    return PAIR_RANKS.get("za7");
  }
  if (includes(left, right, "hongwu") && includes(left, right, "heiwu")) {
    return PAIR_RANKS.get("za5");
  }
  return null;
}

function includes(a, b, pairKey) {
  return a.pairKey === pairKey || b.pairKey === pairKey;
}

function otherTile(a, b, pairKey) {
  return a.pairKey === pairKey ? b : a;
}

function rotateDealDeck(deck, startIndex) {
  const split = startIndex * 4;
  return deck.slice(split).concat(deck.slice(0, split));
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const random = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    const pick = Math.floor(random * (index + 1));
    [copy[index], copy[pick]] = [copy[pick], copy[index]];
  }
  return copy;
}

function rollDice() {
  const random = crypto.getRandomValues(new Uint32Array(2));
  return [1 + (random[0] % 6), 1 + (random[1] % 6)];
}

async function animateDiceRoll(durationMs = 650) {
  const start = performance.now();
  while (performance.now() - start < durationMs) {
    state.ui.round.rollingDice = [randomDieValue(), randomDieValue()];
    refreshTable();
    await pause(90);
  }
}

function randomDieValue() {
  return 1 + Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * 6);
}

function areAllCardsRevealed(round) {
  return Boolean(round?.revealedBanker?.every(Boolean) && round?.revealedPlayer?.every(Boolean));
}

function applyTheme() {
  document.body.dataset.theme = state.db.preferences.theme === "light" ? "light" : "dark";
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((error) => console.error(error));
  }
}

function setupOrientationGuard() {
  syncOrientationGuard();
  window.addEventListener("resize", syncOrientationGuard);
  window.addEventListener("orientationchange", () => {
    syncOrientationGuard();
    window.setTimeout(syncOrientationGuard, 120);
    window.setTimeout(syncOrientationGuard, 320);
  });
  window.visualViewport?.addEventListener("resize", syncOrientationGuard);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      syncOrientationGuard();
    }
  });

  if (screen.orientation?.lock) {
    const requestLock = () => {
      screen.orientation.lock("landscape").catch(() => {});
    };
    requestLock();
    document.addEventListener("click", requestLock, { passive: true });
  }
}

function syncOrientationGuard() {
  const needsLandscape = isPortraitPhone();
  document.body.classList.toggle("orientation-required", needsLandscape);
  els.orientationGuard.hidden = !needsLandscape;
}

function isPortraitPhone() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowScreen = window.matchMedia("(max-width: 960px)").matches;
  const byViewport = window.innerHeight > window.innerWidth;
  const byScreenOrientation = screen.orientation?.type?.startsWith("portrait") ?? false;
  const hasWindowOrientation = typeof window.orientation === "number";
  const byAngle = hasWindowOrientation ? Math.abs(window.orientation) !== 90 : false;
  const portrait = byViewport || byScreenOrientation || byAngle;
  return coarsePointer && narrowScreen && portrait;
}

function canForceDismissOrientationGuard() {
  const landscapeByViewport = window.innerWidth > window.innerHeight;
  const landscapeByOrientation = screen.orientation?.type?.startsWith("landscape") ?? false;
  const landscapeByAngle = typeof window.orientation === "number" ? Math.abs(window.orientation) === 90 : false;
  return landscapeByViewport || landscapeByOrientation || landscapeByAngle;
}

function toast(message, type = "success") {
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.textContent = message;
  els.toastStack.appendChild(node);
  window.setTimeout(() => node.remove(), 2600);
}

function clampBet(value) {
  const chips = getActiveProfile().chips;
  if (chips <= 0) return 0;
  const clamped = Math.max(100, Math.min(chips, Number(value) || 100));
  if (clamped === chips) {
    return chips;
  }
  return Math.max(100, Math.floor(clamped / 100) * 100);
}

function statusText(stage) {
  return (
    {
      building: "砌牌中",
      rolling: "掷骰中",
      dealing: "派牌中",
      revealing: "亮牌结算",
    }[stage] || "准备开局"
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatSigned(value) {
  return `${value > 0 ? "+" : ""}${formatNumber(value)}`;
}

function currentDay() {
  return new Date().toISOString().slice(0, 10);
}

function pause(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
