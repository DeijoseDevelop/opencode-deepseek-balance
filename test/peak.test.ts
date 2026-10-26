import assert from "node:assert/strict"
import test from "node:test"
import { countdown, isPeak, nextPeakChange } from "../src/peak.ts"

test("isPeak marks weekday peak windows in UTC", () => {
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 26, 0, 59))), false)
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 26, 1, 0))), true)
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 26, 3, 59))), true)
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 26, 4, 0))), false)
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 26, 6, 0))), true)
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 26, 9, 59))), true)
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 26, 10, 0))), false)
})

test("isPeak is off-peak all weekend", () => {
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 24, 2, 0))), false)
  assert.equal(isPeak(new Date(Date.UTC(2026, 9, 25, 7, 0))), false)
})

test("nextPeakChange finds the next boundary", () => {
  assert.equal(
    nextPeakChange(new Date(Date.UTC(2026, 9, 26, 0, 30)))?.toISOString(),
    "2026-10-26T01:00:00.000Z",
  )
  assert.equal(
    nextPeakChange(new Date(Date.UTC(2026, 9, 26, 3, 30)))?.toISOString(),
    "2026-10-26T04:00:00.000Z",
  )
  assert.equal(
    nextPeakChange(new Date(Date.UTC(2026, 9, 26, 9, 30)))?.toISOString(),
    "2026-10-26T10:00:00.000Z",
  )
})

test("nextPeakChange skips the weekend", () => {
  assert.equal(
    nextPeakChange(new Date(Date.UTC(2026, 9, 23, 10, 0)))?.toISOString(),
    "2026-10-26T01:00:00.000Z",
  )
  assert.equal(
    nextPeakChange(new Date(Date.UTC(2026, 9, 24, 12, 0)))?.toISOString(),
    "2026-10-26T01:00:00.000Z",
  )
})

test("countdown formats minutes and hours", () => {
  const from = new Date(Date.UTC(2026, 9, 26, 0, 0))
  assert.equal(countdown(new Date(Date.UTC(2026, 9, 26, 0, 1)), from), "1m")
  assert.equal(countdown(new Date(Date.UTC(2026, 9, 26, 0, 59)), from), "59m")
  assert.equal(countdown(new Date(Date.UTC(2026, 9, 26, 1, 0)), from), "1h 00m")
  assert.equal(countdown(new Date(Date.UTC(2026, 9, 26, 3, 12)), from), "3h 12m")
})
