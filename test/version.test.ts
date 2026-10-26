import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { readPluginVersion } from "../src/version.ts"

test("reads the package version", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
  assert.equal(readPluginVersion(), pkg.version)
})
