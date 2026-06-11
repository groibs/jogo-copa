import { PLAYER_POOL } from "../../data/players";
import { mulberry32, pickN } from "./rng";
import {
  POSITION_ATTRIBUTES,
  type AttributeKey,
  type PlayerAttributes,
  type PlayerCard,
} from "./types";

// ===========================================================================
// Pool, pack e atributos das cartas
// ===========================================================================

export function getPlayerPool(): PlayerCard[] {
  return PLAYER_POOL;
}

export function getAttribute(card: PlayerCard, key: AttributeKey): number {
  return card.attributes[key] ?? 0;
}

const STEP = 10;

function clampToStep(value: number, max: number): number {
  const rounded = Math.round(value / STEP) * STEP;
  return Math.min(Math.max(rounded, 0), max);
}

/**
 * Retorna uma cópia da carta com a distribuição inicial de atributos
 * normalizada: valores em passos de 10 e soma exata igual ao baseScore.
 */
export function distributeInitialAttributes(card: PlayerCard): PlayerCard {
  const [first, second] = POSITION_ATTRIBUTES[card.position];
  const firstValue = clampToStep(getAttribute(card, first), card.baseScore);
  return {
    ...card,
    attributes: {
      [first]: firstValue,
      [second]: card.baseScore - firstValue,
    },
  };
}

/**
 * Aplica mudanças em UM dos atributos e rebalanceia o outro para que a soma
 * continue igual ao baseScore (modelo de soma zero).
 */
export function updateCardAttributes(
  card: PlayerCard,
  changes: PlayerAttributes
): PlayerCard {
  const [first, second] = POSITION_ATTRIBUTES[card.position];
  let firstValue = getAttribute(card, first);

  if (changes[first] !== undefined) {
    firstValue = clampToStep(changes[first], card.baseScore);
  } else if (changes[second] !== undefined) {
    firstValue = card.baseScore - clampToStep(changes[second], card.baseScore);
  }

  return {
    ...card,
    attributes: {
      [first]: firstValue,
      [second]: card.baseScore - firstValue,
    },
  };
}

export const PACK_COMPOSITION = { ATK: 3, ZAG: 4, GOL: 2 } as const;

/** Gera um booster com exatamente 3 ATK, 4 ZAG e 2 GOL (sem repetição). */
export function generatePack(seed: number): PlayerCard[] {
  const rng = mulberry32(seed);
  const pool = getPlayerPool();
  const atks = pickN(pool.filter((p) => p.position === "ATK"), PACK_COMPOSITION.ATK, rng);
  const zags = pickN(pool.filter((p) => p.position === "ZAG"), PACK_COMPOSITION.ZAG, rng);
  const gols = pickN(pool.filter((p) => p.position === "GOL"), PACK_COMPOSITION.GOL, rng);
  return [...atks, ...zags, ...gols].map(distributeInitialAttributes);
}
