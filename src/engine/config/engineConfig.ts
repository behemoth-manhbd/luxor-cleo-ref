import type { Board } from '../types'
import { BASE_STRIPS, BASE_STRIPS_NO_SCATTER, FS_STRIPS } from './strips'
import type { SymbolId } from '../types'

export interface EngineConfig {
  /**
   * [AMBIGUOUS] Rules say the wild's ×2 applies to combos "passing through" it, but not
   * whether a pure-wild combo multiplies itself. false = wild_multiplier pays its own
   * paytable WITHOUT doubling itself (conventional reading).
   */
  wildSelfMultiplier: boolean
  /** [ASSUMPTION] Scatters in FS only feed the VAULT, no cash (paytable-3 wording). */
  fsScatterPaysCash: boolean
  /** Buy's forced 3 scatters also pay the 1× scatter award (live corroborated, $2.00). */
  buyPaysScatter: boolean
  baseStrips: SymbolId[][]
  fsStrips: SymbolId[][]
  buyStrips: SymbolId[][]
  /**
   * Test hook: boards consumed in order instead of RNG strip fills. When used, the
   * strip-stop draws are skipped (draw order differs from live play — tests only).
   */
  boardQueue?: Board[]
}

export const DEFAULT_CONFIG: EngineConfig = {
  wildSelfMultiplier: false,
  fsScatterPaysCash: false,
  buyPaysScatter: true,
  baseStrips: BASE_STRIPS,
  fsStrips: FS_STRIPS,
  buyStrips: BASE_STRIPS_NO_SCATTER,
}
