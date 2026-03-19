import test from "node:test";
import assert from "node:assert/strict";

import { compareHands, evaluateHand, normalizeRoundSettlement, recommendSplit } from "../src/logic.js";

const tian1 = { id: "teen-1", key: "teen", name: "天牌", alias: "天", pips: [6, 6], rank: 15, shortLabel: "6-6" };
const tian2 = { ...tian1, id: "teen-2" };
const di1 = { id: "day-1", key: "day", name: "地牌", alias: "地", pips: [1, 1], rank: 14, shortLabel: "1-1" };
const dingSan = { id: "geeJoonA-1", key: "geeJoonA", name: "丁三", alias: "丁三", pips: [1, 2], rank: 16, shortLabel: "丁三" };
const erSi = { id: "geeJoonB-1", key: "geeJoonB", name: "二四", alias: "二四", pips: [2, 4], rank: 16, shortLabel: "二四" };
const ren1 = { id: "yun-1", key: "yun", name: "人牌", alias: "人", pips: [4, 4], rank: 13, shortLabel: "4-4" };
const he1 = { id: "gor-1", key: "gor", name: "和牌", alias: "和", pips: [1, 3], rank: 12, shortLabel: "1-3" };

test("至尊宝应高于天牌对", () => {
  const supreme = evaluateHand([dingSan, erSi]);
  const teenPair = evaluateHand([tian1, tian2]);

  assert.equal(compareHands(supreme, teenPair), 1);
});

test("点数比较按个位数与最大单张进行", () => {
  const higher = evaluateHand([tian1, di1]);
  const lower = evaluateHand([ren1, he1]);

  assert.equal(higher.points > lower.points, true);
  assert.equal(compareHands(higher, lower), 1);
});

test("推荐分牌会保持前组不大于后组", () => {
  const split = recommendSplit([tian1, tian2, di1, ren1]);
  assert.equal(compareHands(split.frontEval, split.backEval, false) <= 0, true);
});

test("前组大于后组应判犯规", () => {
  const settlement = normalizeRoundSettlement({
    bet: 1000,
    playerFront: [tian1, tian2],
    playerBack: [di1, ren1],
    bankerFront: [di1, ren1],
    bankerBack: [di1, ren1],
  });

  assert.equal(settlement.outcome, "foul");
  assert.equal(settlement.net, -1000);
});
