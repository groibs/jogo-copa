import { getPlayerPool } from "./cards";
import { mulberry32, pickN, weightedPick, type Rng } from "./rng";
import {
  AURA_POINTS_PER_LANCE,
  AURA_TARGETS,
  MAX_AURA_PER_TARGET,
  type AttackSide,
  type AuraAllocation,
  type AuraTarget,
  type Lineup,
  type MatchState,
} from "./types";

// ===========================================================================
// Bot — escalação, distribuição de aura e escolha de lado (semi-aleatórios)
// ===========================================================================

export function generateBotLineup(seed: number): Lineup {
  const rng = mulberry32(seed);
  const pool = getPlayerPool();
  const [atk] = pickN(pool.filter((p) => p.position === "ATK"), 1, rng);
  const [zagLeft, zagRight] = pickN(pool.filter((p) => p.position === "ZAG"), 2, rng);
  const [gol] = pickN(pool.filter((p) => p.position === "GOL"), 1, rng);
  return { atk, zagLeft, zagRight, gol };
}

/**
 * Pesos por alvo conforme a situação do bot no lance.
 * Atacando: investe mais no atacante. Defendendo: alterna entre zagueiros,
 * goleiro e o próprio atacante (esperando contra-ataque).
 */
const ATTACK_WEIGHTS: Record<AuraTarget, number> = {
  "atk-chute": 3,
  "atk-drible": 3,
  "zagLeft-desarme": 0.4,
  "zagLeft-passe": 0.3,
  "zagRight-desarme": 0.4,
  "zagRight-passe": 0.3,
  "gol-reflexo": 0.4,
  "gol-defesa": 0.4,
};

const DEFENSE_WEIGHTS: Record<AuraTarget, number> = {
  "atk-chute": 1.2,
  "atk-drible": 0.3,
  "zagLeft-desarme": 2.4,
  "zagLeft-passe": 0.9,
  "zagRight-desarme": 2.4,
  "zagRight-passe": 0.9,
  "gol-reflexo": 1.8,
  "gol-defesa": 1.8,
};

/** Distribui os 3 pontos de aura do bot no lance atual. */
export function allocateBotAura(matchState: MatchState, rng?: Rng): AuraAllocation {
  const random =
    rng ?? mulberry32(matchState.seed + matchState.currentLance * 7919 + 13);
  const weights =
    matchState.possession === "bot" ? ATTACK_WEIGHTS : DEFENSE_WEIGHTS;

  const allocation: AuraAllocation = {};
  for (let i = 0; i < AURA_POINTS_PER_LANCE; i++) {
    const candidates = AURA_TARGETS.filter(
      (target) => (allocation[target] ?? 0) < MAX_AURA_PER_TARGET
    );
    if (candidates.length === 0) break;
    const entries = candidates.map(
      (target) => [target, weights[target]] as [AuraTarget, number]
    );
    const picked = weightedPick(entries, random);
    allocation[picked] = (allocation[picked] ?? 0) + 1;
  }
  return allocation;
}

export function chooseBotAttackSide(rng: Rng): AttackSide {
  return rng() < 0.5 ? "left" : "right";
}
