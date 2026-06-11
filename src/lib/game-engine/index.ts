// 🗿 ÉGOL+AURA — API pública do motor do jogo (funções puras)

export * from "./types";
export { mulberry32, shuffle, pickN, weightedPick, type Rng } from "./rng";
export {
  getPlayerPool,
  getAttribute,
  generatePack,
  distributeInitialAttributes,
  updateCardAttributes,
  PACK_COMPOSITION,
} from "./cards";
export {
  resolveDribbleDuel,
  resolveGoalkeeperReflexDuel,
  resolveShot,
  resolveCounterAttack,
  auraBonus,
  COUNTER_SHOT_PENALTY,
  COUNTER_PASS_MIN,
  COUNTER_PASS_MAX,
} from "./duels";
export { generateBotLineup, allocateBotAura, chooseBotAttackSide } from "./bot";
export {
  createInitialMatchState,
  advanceMatchState,
  resolveLance,
  calculateMatchStats,
  TOTAL_LANCES,
} from "./match";
