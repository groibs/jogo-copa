import {
  AURA_POINT_VALUE,
  type CounterAttackResult,
  type DuelResult,
} from "./types";

// ===========================================================================
// Duelos — funções puras que resolvem cada embate do lance
// Todos os valores de aura aqui são PONTOS de aura (cada ponto vale +5).
// ===========================================================================

export function auraBonus(points: number): number {
  return points * AURA_POINT_VALUE;
}

function duel(attackerTotal: number, defenderTotal: number): DuelResult {
  const margin = attackerTotal - defenderTotal;
  return {
    attackerTotal,
    defenderTotal,
    margin,
    // Empate sempre favorece a defesa.
    winner: margin > 0 ? "attacker" : "defender",
  };
}

/** Drible do atacante vs Desarme do zagueiro do lado atacado. */
export function resolveDribbleDuel(params: {
  dribble: number;
  dribbleAura: number;
  tackle: number;
  tackleAura: number;
}): DuelResult {
  return duel(
    params.dribble + auraBonus(params.dribbleAura),
    params.tackle + auraBonus(params.tackleAura)
  );
}

/**
 * Drible do atacante vs Reflexo do goleiro.
 * Não gera gol: gera um modificador para o chute.
 */
export function resolveGoalkeeperReflexDuel(params: {
  dribble: number;
  dribbleAura: number;
  reflex: number;
  reflexAura: number;
}): { duel: DuelResult; shotModifier: number } {
  const result = duel(
    params.dribble + auraBonus(params.dribbleAura),
    params.reflex + auraBonus(params.reflexAura)
  );

  let shotModifier = 0;
  if (result.margin >= 20) shotModifier = 10;
  else if (result.margin >= 10) shotModifier = 5;
  else if (result.margin <= -20) shotModifier = -10;
  else if (result.margin <= -10) shotModifier = -5;

  return { duel: result, shotModifier };
}

/** Chute do atacante (+modificador) vs Defesa do goleiro. Empate = defesa. */
export function resolveShot(params: {
  shot: number;
  shotAura: number;
  modifier: number;
  save: number;
  saveAura: number;
}): { duel: DuelResult; goal: boolean } {
  const result = duel(
    params.shot + auraBonus(params.shotAura) + params.modifier,
    params.save + auraBonus(params.saveAura)
  );
  return { duel: result, goal: result.winner === "attacker" };
}

export const COUNTER_SHOT_PENALTY = -10;
export const COUNTER_PASS_MIN = 20;
export const COUNTER_PASS_MAX = 80;

/**
 * Contra-ataque após roubo do zagueiro.
 * margem = total do zagueiro - total do atacante (no duelo de drible).
 * chance de passe = Passe (+aura) + margem, limitada a 20%–80%.
 * Se o passe encaixa, o atacante do time que roubou finaliza com Chute -10.
 */
export function resolveCounterAttack(params: {
  pass: number;
  passAura: number;
  stealMargin: number;
  passRoll: number; // 0–100
  counterShot: number;
  counterShotAura: number;
  save: number;
  saveAura: number;
}): CounterAttackResult {
  const rawChance = params.pass + auraBonus(params.passAura) + params.stealMargin;
  const passChance = Math.min(Math.max(rawChance, COUNTER_PASS_MIN), COUNTER_PASS_MAX);
  const passSuccess = params.passRoll < passChance;

  if (!passSuccess) {
    return { passChance, passRoll: params.passRoll, passSuccess, shotDuel: null, goal: false };
  }

  const { duel: shotDuel, goal } = resolveShot({
    shot: params.counterShot,
    shotAura: params.counterShotAura,
    modifier: COUNTER_SHOT_PENALTY,
    save: params.save,
    saveAura: params.saveAura,
  });

  return { passChance, passRoll: params.passRoll, passSuccess, shotDuel, goal };
}
