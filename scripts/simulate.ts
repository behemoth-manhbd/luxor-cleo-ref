// RTP simulation harness (M6): pnpm simulate [rounds] [--buy]
// Targets: base RTP 96.51%, buy RTP 96.56% (verified in-game, paytable-4).
// Strip weights are TUNABLE placeholders — use this report to tune src/engine/config/strips.ts.

import { playRound } from '../src/engine'

const args = process.argv.slice(2)
const rounds = Number(args.find((a: string) => /^\d+$/.test(a)) ?? 100_000)
const buy = args.includes('--buy')
const betCents = 200

let totalCost = 0
let totalWin = 0
let hits = 0
let fsTriggers = 0
let vaultAwards = 0
let maxWin = 0
let capHits = 0

const bySymbol = new Map<string, number>()

const started = Date.now()
for (let seed = 1; seed <= rounds; seed++) {
  const r = playRound({ seed, betCents, buy })
  totalCost += r.costCents
  totalWin += r.totalWinCents
  if (r.totalWinCents > 0) hits++
  if (r.totalWinCents > maxWin) maxWin = r.totalWinCents
  for (const e of r.events) {
    if (e.type === 'fs_trigger') fsTriggers++
    if (e.type === 'vault_award') vaultAwards++
    if (e.type === 'win_cap_clamp') capHits++
    if (e.type === 'ways_evaluate') {
      for (const w of e.wins) {
        bySymbol.set(w.symbol, (bySymbol.get(w.symbol) ?? 0) + w.winCents)
      }
    }
  }
}
const secs = ((Date.now() - started) / 1000).toFixed(1)

const rtp = (100 * totalWin) / totalCost
console.log(`mode=${buy ? 'BUY' : 'BASE'} rounds=${rounds} bet=$${(betCents / 100).toFixed(2)} (${secs}s)`)
console.log(`RTP:          ${rtp.toFixed(2)}%  (target ${buy ? '96.56' : '96.51'}%)`)
console.log(`hit freq:     ${((100 * hits) / rounds).toFixed(2)}%`)
console.log(`FS trigger:   1 in ${(rounds / Math.max(fsTriggers, 1)).toFixed(0)}`)
console.log(`vault awards: ${vaultAwards} (1 in ${(rounds / Math.max(vaultAwards, 1)).toFixed(0)})`)
console.log(`cap hits:     ${capHits}`)
console.log(`max win:      ${(maxWin / betCents).toFixed(0)}× bet (cap 12500×)`)
const parts = [...bySymbol.entries()].sort((a, b) => b[1] - a[1])
for (const [sym, cents] of parts) {
  console.log(`  ${sym.padEnd(16)} ${((100 * cents) / totalCost).toFixed(2)}% of RTP`)
}
