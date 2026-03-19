import { DAILY_REWARD, ACHIEVEMENTS, BANKRUPTCY_GRANT, MODES, STARTING_CHIPS, TILE_TYPES } from "./data.js";

const tileTypeMap = new Map(TILE_TYPES.map((tile) => [tile.key, tile]));
const pairRanks = new Map([
  ["teen", 1],
  ["day", 2],
  ["yun", 3],
  ["gor", 4],
  ["mooy", 5],
  ["chong", 6],
  ["bon", 7],
  ["foo", 8],
  ["ping", 9],
  ["tit", 10],
  ["look", 11],
  ["chopGow", 12],
  ["chopBot", 13],
  ["chopChit", 14],
  ["chopNg", 15],
]);

export function cryptoRandomInt(max) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

export function shuffle(list) {
  const clone = [...list];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = cryptoRandomInt(index + 1);
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

export function createDeck() {
  const deck = [];
  for (const type of TILE_TYPES) {
    for (let copy = 0; copy < type.count; copy += 1) {
      deck.push({
        id: `${type.key}-${copy + 1}`,
        key: type.key,
        name: type.name,
        alias: type.alias,
        pips: [...type.pips],
        rank: type.rank,
        shortLabel: type.shortLabel,
      });
    }
  }
  return shuffle(deck);
}

export function tileStrength(tile) {
  return tileTypeMap.get(tile.key)?.rank ?? 0;
}

export function cardTotal(tile) {
  return tile.pips[0] + tile.pips[1];
}

function isSupreme(cards) {
  const keys = cards.map((card) => card.key).sort();
  return keys[0] === "geeJoonA" && keys[1] === "geeJoonB";
}

function isPair(cards) {
  return cards[0].key === cards[1].key && cards[0].key !== "geeJoonA" && cards[0].key !== "geeJoonB";
}

export function evaluateHand(cards) {
  if (!cards || cards.length !== 2) {
    return null;
  }

  const sortedByStrength = [...cards].sort((left, right) => tileStrength(right) - tileStrength(left));

  if (isSupreme(cards)) {
    return {
      type: "supreme",
      name: "至尊宝",
      display: "至尊宝",
      cards: sortedByStrength,
      points: 9,
      sortKey: [3, 99, 99],
    };
  }

  if (isPair(cards)) {
    const pairName = `${cards[0].name}对`;
    const pairRank = 100 - (pairRanks.get(cards[0].key) ?? 99);
    return {
      type: "pair",
      name: pairName,
      display: `${pairName}`,
      cards: sortedByStrength,
      points: 0,
      sortKey: [2, pairRank, tileStrength(sortedByStrength[0])],
    };
  }

  const points = cards.map(cardTotal).reduce((sum, value) => sum + value, 0) % 10;
  const kickerA = tileStrength(sortedByStrength[0]);
  const kickerB = tileStrength(sortedByStrength[1]);

  return {
    type: "points",
    name: `${points}点`,
    display: `${points}点`,
    cards: sortedByStrength,
    points,
    sortKey: [1, points, kickerA, kickerB],
  };
}

export function compareHands(playerHand, bankerHand, bankerWinsTie = false) {
  const player = Array.isArray(playerHand) ? evaluateHand(playerHand) : playerHand;
  const banker = Array.isArray(bankerHand) ? evaluateHand(bankerHand) : bankerHand;

  for (let index = 0; index < Math.max(player.sortKey.length, banker.sortKey.length); index += 1) {
    const playerValue = player.sortKey[index] ?? 0;
    const bankerValue = banker.sortKey[index] ?? 0;

    if (playerValue > bankerValue) {
      return 1;
    }

    if (playerValue < bankerValue) {
      return -1;
    }
  }

  return bankerWinsTie ? -1 : 0;
}

export function enumerateSplits(cards) {
  const indexes = [
    [[0, 1], [2, 3]],
    [[0, 2], [1, 3]],
    [[0, 3], [1, 2]],
  ];

  return indexes.map(([frontIndexes, backIndexes]) => {
    const handA = [cards[frontIndexes[0]], cards[frontIndexes[1]]];
    const handB = [cards[backIndexes[0]], cards[backIndexes[1]]];
    const compare = compareHands(handA, handB, false);
    const front = compare <= 0 ? handA : handB;
    const back = compare <= 0 ? handB : handA;
    return {
      front,
      back,
      frontEval: evaluateHand(front),
      backEval: evaluateHand(back),
      totalValue:
        evaluateHand(front).sortKey.reduce((sum, value, index) => sum + value * (index + 1), 0) +
        evaluateHand(back).sortKey.reduce((sum, value, index) => sum + value * (index + 4), 0),
    };
  });
}

export function recommendSplit(cards) {
  const splits = enumerateSplits(cards);
  return splits.sort((left, right) => {
    const backCompare = compareHands(left.backEval, right.backEval, false);
    if (backCompare !== 0) {
      return backCompare > 0 ? -1 : 1;
    }

    const frontCompare = compareHands(left.frontEval, right.frontEval, false);
    if (frontCompare !== 0) {
      return frontCompare > 0 ? -1 : 1;
    }

    return right.totalValue - left.totalValue;
  })[0];
}

export function createProfile(name) {
  const now = new Date().toISOString();
  return {
    id: `profile-${Math.random().toString(36).slice(2, 10)}`,
    nickname: name?.trim() || "牌友",
    avatar: "",
    chips: STARTING_CHIPS,
    endlessChips: STARTING_CHIPS,
    createdAt: now,
    lastDailyRewardAt: "",
    lastBailoutAt: "",
    history: [],
    achievements: [],
    stats: {
      gamesPlayed: 0,
      doubleWins: 0,
      pushes: 0,
      doubleLosses: 0,
      fouls: 0,
      wins: 0,
      losses: 0,
      netProfit: 0,
      highestBet: 0,
      bestWinStreak: 0,
      currentWinStreak: 0,
      biggestBankroll: STARTING_CHIPS,
    },
  };
}

export function getTodayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function maybeApplyDailyReward(profile) {
  const today = getTodayStamp();
  if (profile.lastDailyRewardAt === today) {
    return { profile, granted: 0 };
  }

  profile.chips += DAILY_REWARD;
  profile.endlessChips += DAILY_REWARD;
  profile.lastDailyRewardAt = today;
  return { profile, granted: DAILY_REWARD };
}

export function canClaimBailout(profile) {
  return profile.chips <= 0 && profile.lastBailoutAt !== getTodayStamp();
}

export function claimBailout(profile) {
  if (!canClaimBailout(profile)) {
    return false;
  }

  profile.chips += BANKRUPTCY_GRANT;
  profile.endlessChips += BANKRUPTCY_GRANT;
  profile.lastBailoutAt = getTodayStamp();
  return true;
}

export function normalizeRoundSettlement(round) {
  const playerFront = evaluateHand(round.playerFront);
  const playerBack = evaluateHand(round.playerBack);
  const bankerFront = evaluateHand(round.bankerFront);
  const bankerBack = evaluateHand(round.bankerBack);

  if (compareHands(playerFront, playerBack, false) > 0) {
    return {
      summary: "犯规",
      outcome: "foul",
      net: -round.bet,
      playerFront,
      playerBack,
      bankerFront,
      bankerBack,
      frontResult: "负",
      backResult: "负",
    };
  }

  const frontCompare = compareHands(playerFront, bankerFront, true);
  const backCompare = compareHands(playerBack, bankerBack, true);
  const frontResult = frontCompare > 0 ? "胜" : "负";
  const backResult = backCompare > 0 ? "胜" : "负";

  if (frontCompare > 0 && backCompare > 0) {
    return {
      summary: "双赢",
      outcome: "doubleWin",
      net: round.bet * 2,
      playerFront,
      playerBack,
      bankerFront,
      bankerBack,
      frontResult,
      backResult,
    };
  }

  if (frontCompare <= 0 && backCompare <= 0) {
    return {
      summary: "双输",
      outcome: "doubleLoss",
      net: -round.bet,
      playerFront,
      playerBack,
      bankerFront,
      bankerBack,
      frontResult,
      backResult,
    };
  }

  return {
    summary: "和局",
    outcome: "push",
    net: 0,
    playerFront,
    playerBack,
    bankerFront,
    bankerBack,
    frontResult,
    backResult,
  };
}

export function dealerArrange(cards) {
  return recommendSplit(cards);
}

export function applyRoundToProfile(profile, modeId, bet, settlement) {
  profile.stats.gamesPlayed += 1;
  profile.stats.highestBet = Math.max(profile.stats.highestBet, bet);
  profile.stats.netProfit += settlement.net;

  if (settlement.outcome === "doubleWin") {
    profile.stats.doubleWins += 1;
    profile.stats.wins += 1;
    profile.stats.currentWinStreak += 1;
  } else if (settlement.outcome === "push") {
    profile.stats.pushes += 1;
    profile.stats.currentWinStreak = 0;
  } else {
    profile.stats.losses += 1;
    profile.stats.currentWinStreak = 0;
    if (settlement.outcome === "foul") {
      profile.stats.fouls += 1;
    } else {
      profile.stats.doubleLosses += 1;
    }
  }

  profile.stats.bestWinStreak = Math.max(profile.stats.bestWinStreak, profile.stats.currentWinStreak);

  if (MODES[modeId]?.persistentChips) {
    if (modeId === "challenge") {
      profile.chips += settlement.net;
      profile.stats.biggestBankroll = Math.max(profile.stats.biggestBankroll, profile.chips);
    } else if (modeId === "endless") {
      profile.endlessChips += settlement.net;
      profile.stats.biggestBankroll = Math.max(profile.stats.biggestBankroll, profile.endlessChips);
    }
  }

  profile.history.unshift({
    id: `round-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toLocaleString("zh-CN"),
    modeId,
    bet,
    outcome: settlement.outcome,
    summary: settlement.summary,
    net: settlement.net,
    playerFront: settlement.playerFront.display,
    playerBack: settlement.playerBack.display,
    bankerFront: settlement.bankerFront.display,
    bankerBack: settlement.bankerBack.display,
  });
  profile.history = profile.history.slice(0, 20);

  const unlocked = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!profile.achievements.includes(achievement.id) && achievement.check(profile)) {
      profile.achievements.push(achievement.id);
      profile.chips += achievement.reward;
      profile.endlessChips += achievement.reward;
      unlocked.push(achievement);
    }
  }

  return unlocked;
}

export function getModeChips(profile, modeId) {
  if (modeId === "endless") {
    return profile.endlessChips;
  }

  if (modeId === "challenge") {
    return profile.chips;
  }

  return Number.POSITIVE_INFINITY;
}

export function modeAllowsBet(profile, modeId, bet) {
  const chips = getModeChips(profile, modeId);
  return Number.isFinite(chips) ? bet <= chips && bet > 0 : bet > 0;
}
