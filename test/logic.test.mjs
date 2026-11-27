// Tests for the DealProof pure logic: discount maths, the honesty-weighted deal
// score, filtering and sorting. Run with: node --test test/
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  discountPct,
  savings,
  scoreDeal,
  filterDeals,
  sortDeals,
  formatMoney,
} from "../app/logic.js";

const sample = [
  { id: "a", title: "Beats Studio Pro headphones", store: "Walmart", category: "Audio", price: 99, was: 299, signal: "new-low" },
  { id: "b", title: "MacBook Neo laptop", store: "Best Buy", category: "Computers", price: 649, was: 699, signal: "inflated" },
  { id: "c", title: "Keurig K-Express brewer", store: "Walmart", category: "Kitchen", price: 35, was: 68.99, signal: "routine" },
  { id: "d", title: "Sony WH-1000XM5 headphones", store: "Best Buy", category: "Audio", price: 169, was: 398, signal: "strong" },
];

test("discountPct rounds to a whole percent", () => {
  assert.equal(discountPct(sample[0]), 67);
  assert.equal(discountPct(sample[1]), 7);
  assert.equal(discountPct({ price: 50, was: 50 }), 0);
});

test("savings is the plain dollar difference", () => {
  assert.equal(savings(sample[0]), 200);
  assert.equal(savings(sample[2]), 33.99);
});

test("scoreDeal rewards a verified new low over an inflated anchor", () => {
  const low = scoreDeal(sample[0]);
  const inflated = scoreDeal(sample[1]);
  assert.ok(low > inflated, `new low ${low} should beat inflated ${inflated}`);
  assert.ok(low >= 0 && low <= 100);
  assert.ok(inflated >= 0 && inflated <= 100);
});

test("scoreDeal ranks a strong deep cut above a routine shallow one", () => {
  assert.ok(scoreDeal(sample[3]) > scoreDeal(sample[2]));
});

test("filterDeals matches search text against title and store", () => {
  assert.deepEqual(filterDeals(sample, { q: "beats" }).map((d) => d.id), ["a"]);
  assert.deepEqual(filterDeals(sample, { q: "walmart" }).map((d) => d.id), ["a", "c"]);
});

test("filterDeals applies category, store and minimum discount together", () => {
  assert.deepEqual(filterDeals(sample, { category: "Audio" }).map((d) => d.id), ["a", "d"]);
  assert.deepEqual(filterDeals(sample, { store: "Best Buy", minDiscount: 50 }).map((d) => d.id), ["d"]);
  assert.deepEqual(filterDeals(sample, { minDiscount: 90 }), []);
});

test("sortDeals orders by score, discount and price without mutating input", () => {
  const byScore = sortDeals(sample, "score");
  assert.equal(byScore[0].id, "a");
  assert.equal(byScore[byScore.length - 1].id, "b");
  const byDiscount = sortDeals(sample, "discount");
  assert.equal(byDiscount[0].id, "a");
  const byPrice = sortDeals(sample, "price-asc");
  assert.deepEqual(byPrice.map((d) => d.id), ["c", "a", "d", "b"]);
  assert.equal(sample[0].id, "a", "input order untouched");
});

test("formatMoney groups thousands and keeps cents only when needed", () => {
  assert.equal(formatMoney(149), "$149");
  assert.equal(formatMoney(1399.99), "$1,399.99");
  assert.equal(formatMoney(68.99), "$68.99");
});
