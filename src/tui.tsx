/** @jsxImportSource @opentui/solid */
import type { TuiPluginApi, TuiPluginModule } from "@opencode-ai/plugin/tui"
import { createSignal } from "solid-js"
import { fetchBalance, readApiKey, type Balance } from "./balance.js"
import { countdown, isPeak, nextPeakChange } from "./peak.js"
import { readPluginVersion } from "./version.js"

const REFRESH_MS = 60_000
const RETRY_MS = 5_000
const CLOCK_MS = 30_000
const VERSION = readPluginVersion()

const tui = async (api: TuiPluginApi) => {
  const [balance, setBalance] = createSignal<Balance>()
  const [failed, setFailed] = createSignal(false)
  const [now, setNow] = createSignal(new Date())
  let disposed = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const clock = setInterval(() => setNow(new Date()), CLOCK_MS)

  const refresh = async () => {
    const key = readApiKey() ?? process.env.DEEPSEEK_API_KEY
    if (!key) {
      setFailed(true)
      return
    }
    try {
      const next = await fetchBalance(key)
      if (!next) throw new Error("Balance response is empty")
      setBalance(next)
      setFailed(false)
    } catch {
      setFailed(true)
    }
  }

  const schedule = async () => {
    if (disposed) return
    await refresh()
    if (disposed) return
    const delay = balance() ? REFRESH_MS : RETRY_MS
    timer = setTimeout(() => void schedule(), delay)
  }

  void schedule()
  const offIdle = api.event.on("session.idle", () => void refresh())

  api.lifecycle.onDispose(() => {
    disposed = true
    if (timer) clearTimeout(timer)
    clearInterval(clock)
    offIdle()
  })

  api.slots.register({
    order: 95,
    slots: {
      sidebar_footer() {
        const label = () => {
          if (failed()) return "n/a"
          const value = balance()
          return value ? `${value.total} ${value.currency}` : "…"
        }
        const peak = () => isPeak(now())
        const change = () => nextPeakChange(now())
        const price = () => {
          const base = peak() ? "2x price" : "50% off"
          const next = change()
          return next ? `${base} · ${countdown(next, now())}` : base
        }
        return (
          <box flexDirection="column" flexShrink={0}>
            <box flexDirection="row" gap={1} flexShrink={0}>
              <text fg={api.theme.current.text}>
                <strong>Deepseek Usage</strong>
              </text>
              {VERSION ? (
                <text
                  fg={api.theme.current.textMuted}
                  opacity={0.7}
                  selectable={false}
                >
                  {VERSION}
                </text>
              ) : null}
            </box>
            <box flexDirection="row" gap={1} flexShrink={0}>
              <text fg={api.theme.current.textMuted}>DeepSeek</text>
              <text fg={failed() ? api.theme.current.error : api.theme.current.success}>
                {label()}
              </text>
            </box>
            <box flexDirection="row" gap={1} flexShrink={0}>
              <text fg={peak() ? api.theme.current.warning : api.theme.current.success}>
                {peak() ? "Peak" : "Off-peak"}
              </text>
              <text fg={api.theme.current.textMuted}>{price()}</text>
            </box>
          </box>
        )
      },
    },
  })
}

export default {
  id: "deepseek-balance",
  tui,
} satisfies TuiPluginModule
