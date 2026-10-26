import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("..", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const changelog = read("CHANGELOG.md");
const moduleJson = JSON.parse(read("module.json"));
const releaseConfig = JSON.parse(read("release.config.json"));
const helper = read("scripts/release.ps1");
const releaseScript = read("release.ps1");

const versionFromNotes = readdirSync(new URL("release-notes/", root))
  .filter((name) => /^RELEASE-NOTES-\d+\.\d+\.\d+\.md$/.test(name))
  .map((name) => name.slice("RELEASE-NOTES-".length, -".md".length));

test("CHANGELOG.md is the cumulative packaged history", () => {
  assert.equal(changelog.startsWith(`# ${moduleJson.title} Changelog\n`), true);
  assert.equal(changelog.endsWith("\n"), true);
  assert.equal(changelog.includes("\r"), false);
  assert.equal(releaseConfig.requiredPaths.includes("CHANGELOG.md"), true);
  assert.match(helper, /function Update-Changelog/);
  assert.match(helper, /function Write-Changelog/);
  assert.match(releaseScript, /Update-Changelog/);
  assert.match(releaseScript, /\[switch\]\$ValidateOnly/);
  assert.match(releaseScript, /git add -- module\.json CHANGELOG\.md/);
  assert.match(releaseScript, /scripts\/release\.ps1/);
});

test("changelog headings, bullets, and version order suit in-Foundry viewers", () => {
  const lines = changelog.split("\n");
  for (const line of lines) {
    assert.equal(/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line), false, line);
    assert.equal(/^#{1,6}[^#\s]/.test(line), false, line);
    assert.equal(/^\s*[*+]\s+/.test(line), false, line);
  }

  assert.doesNotMatch(changelog, /^## (What Changed|Verification|Validation|Notes|Compatibility)/m);
  assert.doesNotMatch(changelog, /Loot balance has not received campaign playtesting/);
  assert.doesNotMatch(changelog, /Morelord Core is required for account-based entitlement checks and entitled content packs/);

  const versions = [...changelog.matchAll(/^## (\d+\.\d+\.\d+)$/gm)].map((match) => match[1]);
  assert.deepEqual(new Set(versions).size, versions.length);
  assert.deepEqual(versions, versionFromNotes.toSorted((left, right) => right.localeCompare(left, undefined, { numeric: true })));
  assert.equal(versions[0], moduleJson.version);

  assert.match(changelog, /^### Improvements\n\nRequires Morelord Core 0\.5\.1 or later\./m);
  assert.match(changelog, /^- GMs can open material sources from orange Gather, Harvest, and Loot pills\./m);
  assert.match(changelog, /^## 0\.2\.0\n\n- Added Harvest preflight controls listing active player characters/m);
  assert.match(changelog, /^### Fixed\n\n- Encounter Loot and spell-scroll generation now honor both D&D5e Configure Sources/m);
  assert.ok(changelog.indexOf("## 0.4.10") < changelog.indexOf("## 0.4.9"));
});
