#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "data-file": { type: "string" },
    "match-sha": { type: "string" },
    "backfill": { type: "boolean", default: false },
    "tag-only": { type: "boolean", default: false },
    "commit-json": { type: "string" },
    "tag": { type: "string", default: "" },
  },
});

const file = values["data-file"];
const matchSha = values["match-sha"];
if (!file || !matchSha) {
  console.error("usage: process-entry.mjs --data-file <path> --match-sha <sha> [--backfill --commit-json <path>] [--tag-only] [--tag <name>]");
  process.exit(2);
}
if (Boolean(values.backfill) === Boolean(values["tag-only"])) {
  console.error("exactly one of --backfill or --tag-only must be set");
  process.exit(2);
}

const raw = readFileSync(file, "utf8");
const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
const data = JSON.parse(json);

if (!data?.entries || typeof data.entries !== "object") {
  console.error("error: data-file missing 'entries' object");
  process.exit(1);
}

function mapCommit(api) {
  return {
    author: {
      name: api.commit.author.name,
      email: api.commit.author.email,
      username: api.author?.login ?? "",
    },
    committer: {
      name: api.commit.committer.name,
      email: api.commit.committer.email,
      username: api.committer?.login ?? "",
    },
    distinct: true,
    id: api.sha,
    message: api.commit.message.split("\n", 1)[0],
    timestamp: api.commit.committer.date,
    tree_id: api.commit.tree.sha,
    url: api.html_url,
  };
}

let changed = 0;
for (const chartEntries of Object.values(data.entries)) {
  const idx = chartEntries.findIndex((e) => e.commit?.id === matchSha);
  if (idx < 0) continue;
  const entry = chartEntries[idx];

  if (values.backfill) {
    const commitJsonPath = values["commit-json"];
    if (!commitJsonPath) {
      console.error("--backfill requires --commit-json");
      process.exit(2);
    }
    const api = JSON.parse(readFileSync(commitJsonPath, "utf8"));
    entry.commit = mapCommit(api);
    entry.date = Date.parse(entry.commit.timestamp);
    if (values.tag) entry.tag = values.tag;

    // Dedupe: drop any other entry with the new SHA.
    for (let i = chartEntries.length - 1; i >= 0; --i) {
      if (i !== idx && chartEntries[i].commit?.id === entry.commit.id) {
        chartEntries.splice(i, 1);
      }
    }
    changed++;
  } else {
    // --tag-only
    if (values.tag && entry.tag !== values.tag) {
      entry.tag = values.tag;
      changed++;
    }
  }

  chartEntries.sort((a, b) => a.date - b.date);
}

// If nothing changed, skip the write so the caller's `git diff --quiet`
// short-circuits the commit.
if (changed === 0) {
  console.log("no changes");
  process.exit(0);
}

writeFileSync(file, "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2));
console.log(`processed ${changed} entry/entries`);
