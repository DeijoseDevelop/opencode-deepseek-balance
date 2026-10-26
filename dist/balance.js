import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
export function authFilePath() {
  const dataHome = process.env.XDG_DATA_HOME || join(homedir(), ".local", "share");
  return join(dataHome, "opencode", "auth.json");
}
export function readApiKey() {
  try {
    const auth = JSON.parse(readFileSync(authFilePath(), "utf8"));
    const key = auth?.deepseek?.key;
    return typeof key === "string" && key.length > 0 ? key : undefined;
  } catch {
    return undefined;
  }
}
export async function fetchBalance(key) {
  const res = await fetch("https://api.deepseek.com/user/balance", {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (!body || typeof body !== "object") return undefined;
  const infos = body.balance_infos;
  if (!Array.isArray(infos)) return undefined;
  const info = infos[0];
  if (!info || typeof info !== "object") return undefined;
  const record = info;
  return {
    currency: String(record.currency ?? ""),
    total: String(record.total_balance ?? "")
  };
}
//# sourceMappingURL=balance.js.map