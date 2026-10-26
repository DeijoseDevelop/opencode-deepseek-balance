import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export function readPluginVersion() {
  try {
    const pkg = require("../package.json");
    return typeof pkg.version === "string" && pkg.version.length > 0 ? pkg.version : undefined;
  } catch {
    return undefined;
  }
}
//# sourceMappingURL=version.js.map