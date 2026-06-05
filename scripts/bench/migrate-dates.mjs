#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "data-file": { type: "string" },
  },
});

const file = values["data-file"];
if (!file) {
  console.error("usage: migrate-dates.mjs --data-file <path>");
  process.exit(2);
}

const raw = readFileSync(file, "utf8");
const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
const data = JSON.parse(json);

if (!data?.entries || typeof data.entries !== "object") {
  console.error("error: data.js missing 'entries' object");
  process.exit(1);
}

let updated = 0;
let unchanged = 0;

for (const chartEntries of Object.values(data.entries)) {
  for (const entry of chartEntries) {
    const target = Date.parse(entry.commit?.timestamp);
    if (Number.isNaN(target)) {
      unchanged++;
      continue;
    }
    if (Math.abs(entry.date - target) <= 1000) {
      unchanged++;
      continue;
    }
    entry.date = target;
    updated++;
  }
  chartEntries.sort((a, b) => a.date - b.date);
}

writeFileSync(file, "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2));
console.log(`updated: ${updated}`);
console.log(`unchanged: ${unchanged}`);
