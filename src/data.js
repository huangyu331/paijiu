export const PROFILE_STORAGE_KEY = "paijiu-master-state";
export const GAME_VERSION = 1;
export const DAILY_REWARD = 1000;
export const BANKRUPTCY_GRANT = 3000;
export const STARTING_CHIPS = 10000;

export const MODES = {
  quick: {
    id: "quick",
    name: "快速游戏",
    tagline: "无限练习筹码，适合熟悉规则",
    persistentChips: false,
  },
  challenge: {
    id: "challenge",
    name: "挑战模式",
    tagline: "从 10000 筹码起步，追逐最高分",
    persistentChips: true,
  },
  endless: {
    id: "endless",
    name: "无尽模式",
    tagline: "沿用当前筹码，持续累积历史战绩",
    persistentChips: true,
  },
  tutorial: {
    id: "tutorial",
    name: "教学关卡",
    tagline: "通过实例理解分牌、犯规与结算",
    persistentChips: false,
  },
};

export const TILE_TYPES = [
  {
    key: "teen",
    name: "天牌",
    alias: "天",
    pips: [6, 6],
    count: 2,
    rank: 15,
    shortLabel: "6-6",
  },
  {
    key: "day",
    name: "地牌",
    alias: "地",
    pips: [1, 1],
    count: 2,
    rank: 14,
    shortLabel: "1-1",
  },
  {
    key: "yun",
    name: "人牌",
    alias: "人",
    pips: [4, 4],
    count: 2,
    rank: 13,
    shortLabel: "4-4",
  },
  {
    key: "gor",
    name: "和牌",
    alias: "和",
    pips: [1, 3],
    count: 2,
    rank: 12,
    shortLabel: "1-3",
  },
  {
    key: "mooy",
    name: "梅花",
    alias: "梅",
    pips: [5, 5],
    count: 2,
    rank: 11,
    shortLabel: "5-5",
  },
  {
    key: "chong",
    name: "长三",
    alias: "长三",
    pips: [3, 3],
    count: 2,
    rank: 10,
    shortLabel: "3-3",
  },
  {
    key: "bon",
    name: "板凳",
    alias: "板凳",
    pips: [2, 2],
    count: 2,
    rank: 9,
    shortLabel: "2-2",
  },
  {
    key: "foo",
    name: "斧头",
    alias: "斧头",
    pips: [5, 1],
    count: 2,
    rank: 8,
    shortLabel: "5-1",
  },
  {
    key: "ping",
    name: "红头十",
    alias: "红十",
    pips: [4, 6],
    count: 2,
    rank: 7,
    shortLabel: "4-6",
  },
  {
    key: "tit",
    name: "高脚七",
    alias: "高七",
    pips: [1, 6],
    count: 2,
    rank: 6,
    shortLabel: "1-6",
  },
  {
    key: "look",
    name: "零霖六",
    alias: "零霖六",
    pips: [3, 6],
    count: 2,
    rank: 5,
    shortLabel: "3-6",
  },
  {
    key: "chopGow",
    name: "杂五",
    alias: "杂五",
    pips: [5, 2],
    count: 2,
    rank: 4,
    shortLabel: "5-2",
  },
  {
    key: "chopBot",
    name: "杂八",
    alias: "杂八",
    pips: [2, 4],
    count: 2,
    rank: 3,
    shortLabel: "2-4",
  },
  {
    key: "chopChit",
    name: "杂七",
    alias: "杂七",
    pips: [1, 5],
    count: 2,
    rank: 2,
    shortLabel: "1-5",
  },
  {
    key: "chopNg",
    name: "杂九",
    alias: "杂九",
    pips: [3, 5],
    count: 2,
    rank: 1,
    shortLabel: "3-5",
  },
  {
    key: "geeJoonA",
    name: "丁三",
    alias: "丁三",
    pips: [1, 2],
    count: 1,
    rank: 16,
    shortLabel: "丁三",
  },
  {
    key: "geeJoonB",
    name: "二四",
    alias: "二四",
    pips: [2, 4],
    count: 1,
    rank: 16,
    shortLabel: "二四",
  },
];

export const PAIR_ORDER = [
  "至尊宝",
  "天牌对",
  "地牌对",
  "人牌对",
  "和牌对",
  "梅花对",
  "长三对",
  "板凳对",
  "斧头对",
  "红头十对",
  "高脚七对",
  "零霖六对",
  "杂五对",
  "杂八对",
  "杂七对",
  "杂九对",
];

export const TUTORIAL_STEPS = [
  {
    title: "目标",
    body: "每局你和庄家各拿 4 张牌，必须拆成前组和后组两手牌。前组不能大于后组。",
  },
  {
    title: "胜负",
    body: "前后两组都赢是双赢，盈利为下注的 2 倍；一胜一负为和局；双输或犯规则损失下注。",
  },
  {
    title: "点数",
    body: "非对子按两张牌的总点数个位数比较，点数相同则比较最大单张牌。庄家在完全平手时获胜。",
  },
  {
    title: "特殊牌型",
    body: "丁三与二四组合成至尊宝，是最大的特殊牌型。其它完全相同的两张牌构成对子。",
  },
];

export const ACHIEVEMENTS = [
  {
    id: "first_win",
    title: "开门红",
    description: "首次获得双赢",
    reward: 500,
    check: (profile) => profile.stats.doubleWins >= 1,
  },
  {
    id: "veteran",
    title: "牌桌常客",
    description: "累计完成 20 局",
    reward: 1000,
    check: (profile) => profile.stats.gamesPlayed >= 20,
  },
  {
    id: "hot_streak",
    title: "热手",
    description: "连胜达到 5 局",
    reward: 1200,
    check: (profile) => profile.stats.bestWinStreak >= 5,
  },
  {
    id: "high_roller",
    title: "豪客",
    description: "单局下注达到 3000",
    reward: 800,
    check: (profile) => profile.stats.highestBet >= 3000,
  },
];

export const RULE_NOTES = [
  "采用 32 张牌九牌，包含丁三与二四两张至尊牌。",
  "非对子按总点数个位数比较，点数相同时再比较牌面更大的单张。",
  "前组必须小于或等于后组，否则按犯规直接双输。",
  "为贴近传统庄闲玩法，若两手完全平局，系统判定庄家获胜。",
];
