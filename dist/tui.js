import { effect as _$effect } from "@opentui/solid";
import { memo as _$memo } from "@opentui/solid";
import { insert as _$insert } from "@opentui/solid";
import { createTextNode as _$createTextNode } from "@opentui/solid";
import { insertNode as _$insertNode } from "@opentui/solid";
import { setProp as _$setProp } from "@opentui/solid";
import { createElement as _$createElement } from "@opentui/solid";
/** @jsxImportSource @opentui/solid */

import { createSignal } from "solid-js";
import { fetchBalance, readApiKey } from "./balance.js";
import { countdown, isPeak, nextPeakChange } from "./peak.js";
import { readPluginVersion } from "./version.js";
const REFRESH_MS = 60_000;
const RETRY_MS = 5_000;
const CLOCK_MS = 30_000;
const VERSION = readPluginVersion();
const tui = async api => {
  const [balance, setBalance] = createSignal();
  const [failed, setFailed] = createSignal(false);
  const [now, setNow] = createSignal(new Date());
  let disposed = false;
  let timer;
  const clock = setInterval(() => setNow(new Date()), CLOCK_MS);
  const refresh = async () => {
    const key = readApiKey() ?? process.env.DEEPSEEK_API_KEY;
    if (!key) {
      setFailed(true);
      return;
    }
    try {
      const next = await fetchBalance(key);
      if (!next) throw new Error("Balance response is empty");
      setBalance(next);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };
  const schedule = async () => {
    if (disposed) return;
    await refresh();
    if (disposed) return;
    const delay = balance() ? REFRESH_MS : RETRY_MS;
    timer = setTimeout(() => void schedule(), delay);
  };
  void schedule();
  const offIdle = api.event.on("session.idle", () => void refresh());
  api.lifecycle.onDispose(() => {
    disposed = true;
    if (timer) clearTimeout(timer);
    clearInterval(clock);
    offIdle();
  });
  api.slots.register({
    order: 95,
    slots: {
      sidebar_footer() {
        const label = () => {
          if (failed()) return "n/a";
          const value = balance();
          return value ? `${value.total} ${value.currency}` : "…";
        };
        const peak = () => isPeak(now());
        const change = () => nextPeakChange(now());
        const price = () => {
          const base = peak() ? "2x price" : "50% off";
          const next = change();
          return next ? `${base} · ${countdown(next, now())}` : base;
        };
        return (() => {
          var _el$ = _$createElement("box"),
            _el$2 = _$createElement("box"),
            _el$3 = _$createElement("text"),
            _el$4 = _$createElement("strong"),
            _el$6 = _$createElement("box"),
            _el$7 = _$createElement("text"),
            _el$9 = _$createElement("text"),
            _el$0 = _$createElement("box"),
            _el$1 = _$createElement("text"),
            _el$10 = _$createElement("text");
          _$insertNode(_el$, _el$2);
          _$insertNode(_el$, _el$6);
          _$insertNode(_el$, _el$0);
          _$setProp(_el$, "flexDirection", "column");
          _$setProp(_el$, "flexShrink", 0);
          _$insertNode(_el$2, _el$3);
          _$setProp(_el$2, "flexDirection", "row");
          _$setProp(_el$2, "gap", 1);
          _$setProp(_el$2, "flexShrink", 0);
          _$insertNode(_el$3, _el$4);
          _$insertNode(_el$4, _$createTextNode(`Deepseek Usage`));
          _$insert(_el$2, VERSION ? (() => {
            var _el$11 = _$createElement("text");
            _$setProp(_el$11, "opacity", 0.7);
            _$setProp(_el$11, "selectable", false);
            _$insert(_el$11, VERSION);
            _$effect(_$p => _$setProp(_el$11, "fg", api.theme.current.textMuted, _$p));
            return _el$11;
          })() : null, null);
          _$insertNode(_el$6, _el$7);
          _$insertNode(_el$6, _el$9);
          _$setProp(_el$6, "flexDirection", "row");
          _$setProp(_el$6, "gap", 1);
          _$setProp(_el$6, "flexShrink", 0);
          _$insertNode(_el$7, _$createTextNode(`DeepSeek`));
          _$insert(_el$9, label);
          _$insertNode(_el$0, _el$1);
          _$insertNode(_el$0, _el$10);
          _$setProp(_el$0, "flexDirection", "row");
          _$setProp(_el$0, "gap", 1);
          _$setProp(_el$0, "flexShrink", 0);
          _$insert(_el$1, () => peak() ? "Peak" : "Off-peak");
          _$insert(_el$10, price);
          _$effect(_p$ => {
            var _v$ = api.theme.current.text,
              _v$2 = api.theme.current.textMuted,
              _v$3 = failed() ? api.theme.current.error : api.theme.current.success,
              _v$4 = peak() ? api.theme.current.warning : api.theme.current.success,
              _v$5 = api.theme.current.textMuted;
            _v$ !== _p$.e && (_p$.e = _$setProp(_el$3, "fg", _v$, _p$.e));
            _v$2 !== _p$.t && (_p$.t = _$setProp(_el$7, "fg", _v$2, _p$.t));
            _v$3 !== _p$.a && (_p$.a = _$setProp(_el$9, "fg", _v$3, _p$.a));
            _v$4 !== _p$.o && (_p$.o = _$setProp(_el$1, "fg", _v$4, _p$.o));
            _v$5 !== _p$.i && (_p$.i = _$setProp(_el$10, "fg", _v$5, _p$.i));
            return _p$;
          }, {
            e: undefined,
            t: undefined,
            a: undefined,
            o: undefined,
            i: undefined
          });
          return _el$;
        })();
      }
    }
  });
};
export default {
  id: "deepseek-balance",
  tui
};
//# sourceMappingURL=tui.js.map