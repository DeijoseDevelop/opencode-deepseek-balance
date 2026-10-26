import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

export function readPluginVersion(): string | undefined {
  try {
    const pkg = require("../package.json") as { version?: unknown }
    return typeof pkg.version === "string" && pkg.version.length > 0 ? pkg.version : undefined
  } catch {
    return undefined
  }
}
