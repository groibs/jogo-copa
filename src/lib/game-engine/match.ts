import { allocateBotAura, chooseBotAttackSide } from "./bot";
import { getAttribute } from "./cards";
import {
  resolveCounterAttack,
  resolveDribbleDuel,
  resolveGoalkeeperReflexDuel,
  resolveShot,
} from "./duels";
import { mulberry32, type Rng } from "./rng";
import type {
  AttackSide,
  AuraAllocation,
  LanceEvent,
  LanceResult,
  Lineup,
  MatchResult,
  MatchState,
  MatchStats,
  TeamId,
} from "./types";

// ===========================================================================
// Partida — resolução de lances e avanço do estado
// ===========================================================================

export const TOTAL_LANCES = 7;

export function createInitialMatchState(params: {
  playerLineup: Lineup;
  botLineup: Lineup;
  seed: number;
}): MatchState {
  return {
    seed: params.seed,
    currentLance: 1,
    totalLances: TOTAL_LANCES,
    score: { player: 0, bot: 0 },
    possession: "player",
    playerLineup: params.playerLineup,
    botLineup: params.botLineup,
    lances: [],
    finished: false,
  };
}

function opponent(team: TeamId): TeamId {
  return team === "player" ? "bot" : "player";
}

/**
 * Resolve um lance completo.
 * As alocações de aura de cada lado referenciam a PRÓPRIA escalação
 * (ex.: "zagLeft-desarme" do defensor é o zagueiro esquerdo dele).
 * O lado de ataque escolhe qual zagueiro do DEFENSOR será enfrentado.
 */
export function resolveLance(params: {
  lanceNumber: number;
  attackingTeam: TeamId;
  attackingLineup: Lineup;
  defendingLineup: Lineup;
  attackerAura: AuraAllocation;
  defenderAura: AuraAllocation;
  side: AttackSide;
  scoreBefore: { player: number; bot: number };
  rng: Rng;
}): LanceResult {
  const {
    lanceNumber,
    attackingTeam,
    attackingLineup,
    defendingLineup,
    attackerAura,
    defenderAura,
    side,
    scoreBefore,
    rng,
  } = params;

  const defendingTeam = opponent(attackingTeam);
  const events: LanceEvent[] = [];
  const score = { ...scoreBefore };

  const zagSlot = side === "left" ? "zagLeft" : "zagRight";
  const zag = defendingLineup[zagSlot];

  // 1) Drible do atacante vs Desarme do zagueiro do lado atacado
  const dribbleDuel = resolveDribbleDuel({
    dribble: getAttribute(attackingLineup.atk, "drible"),
    dribbleAura: attackerAura["atk-drible"] ?? 0,
    tackle: getAttribute(zag, "desarme"),
    tackleAura: defenderAura[`${zagSlot}-desarme`] ?? 0,
  });

  let goalTeam: TeamId | null = null;
  let possessionAfter: TeamId = defendingTeam;
  let reflexDuel: LanceResult["reflexDuel"] = null;
  let shotModifier = 0;
  let shotDuel: LanceResult["shotDuel"] = null;
  let counter: LanceResult["counter"] = null;

  if (dribbleDuel.winner === "attacker") {
    // 2) Passou pelo zagueiro → duelo contra o Reflexo do goleiro
    events.push({ type: "dribble-pass", text: "Passou pelo zagueiro", team: attackingTeam });

    const reflex = resolveGoalkeeperReflexDuel({
      dribble: getAttribute(attackingLineup.atk, "drible"),
      dribbleAura: attackerAura["atk-drible"] ?? 0,
      reflex: getAttribute(defendingLineup.gol, "reflexo"),
      reflexAura: defenderAura["gol-reflexo"] ?? 0,
    });
    reflexDuel = reflex.duel;
    shotModifier = reflex.shotModifier;

    if (shotModifier > 0) {
      events.push({ type: "angle-open", text: `Abriu ângulo (Chute +${shotModifier})`, team: attackingTeam });
    } else if (shotModifier < 0) {
      events.push({ type: "angle-closed", text: `Goleiro fechou o ângulo (Chute ${shotModifier})`, team: defendingTeam });
    } else {
      events.push({ type: "angle-neutral", text: "Cara a cara com o goleiro", team: attackingTeam });
    }

    // 3) Finalização: Chute (+modificador) vs Defesa
    const shot = resolveShot({
      shot: getAttribute(attackingLineup.atk, "chute"),
      shotAura: attackerAura["atk-chute"] ?? 0,
      modifier: shotModifier,
      save: getAttribute(defendingLineup.gol, "defesa"),
      saveAura: defenderAura["gol-defesa"] ?? 0,
    });
    shotDuel = shot.duel;

    if (shot.goal) {
      goalTeam = attackingTeam;
      score[attackingTeam] += 1;
      events.push({ type: "goal", text: "Gol", team: attackingTeam });
      possessionAfter = defendingTeam; // posse vai para quem sofreu o gol
    } else {
      events.push({ type: "save", text: "Defesa", team: defendingTeam });
      possessionAfter = defendingTeam; // posse vai para quem defendeu
    }
  } else {
    // 2') Zagueiro roubou → tentativa de contra-ataque
    events.push({ type: "steal", text: "Zagueiro roubou", team: defendingTeam });
    events.push({ type: "counter", text: "Contra-ataque", team: defendingTeam });

    counter = resolveCounterAttack({
      pass: getAttribute(zag, "passe"),
      passAura: defenderAura[`${zagSlot}-passe`] ?? 0,
      stealMargin: -dribbleDuel.margin, // total do zagueiro - total do atacante
      passRoll: rng() * 100,
      counterShot: getAttribute(defendingLineup.atk, "chute"),
      counterShotAura: defenderAura["atk-chute"] ?? 0,
      save: getAttribute(attackingLineup.gol, "defesa"),
      saveAura: attackerAura["gol-defesa"] ?? 0,
    });

    if (!counter.passSuccess) {
      events.push({ type: "pass-fail", text: "Passe falhou", team: defendingTeam });
      possessionAfter = defendingTeam; // posse fica com quem roubou
    } else if (counter.goal) {
      goalTeam = defendingTeam;
      score[defendingTeam] += 1;
      events.push({ type: "counter-goal", text: "Gol", team: defendingTeam });
      possessionAfter = attackingTeam; // posse vai para quem sofreu o gol
    } else {
      events.push({ type: "counter-blocked", text: "Finalização bloqueada", team: attackingTeam });
      possessionAfter = attackingTeam; // posse vai para quem defendeu
    }
  }

  return {
    lanceNumber,
    attackingTeam,
    attackSide: side,
    events,
    dribbleDuel,
    reflexDuel,
    shotModifier,
    shotDuel,
    counter,
    goalTeam,
    possessionAfter,
    scoreAfter: score,
    playerAura: attackingTeam === "player" ? attackerAura : defenderAura,
    botAura: attackingTeam === "bot" ? attackerAura : defenderAura,
  };
}

/**
 * Avança a partida em 1 lance: gera as decisões do bot, resolve o lance
 * e retorna um novo estado (imutável).
 */
export function advanceMatchState(params: {
  state: MatchState;
  playerAura: AuraAllocation;
  /** Obrigatório quando o jogador tem a posse. */
  playerSide?: AttackSide;
}): MatchState {
  const { state, playerAura, playerSide } = params;
  if (state.finished) return state;

  const rng = mulberry32(state.seed + state.currentLance * 7919);
  const botAura = allocateBotAura(state, rng);

  const playerAttacking = state.possession === "player";
  const side: AttackSide = playerAttacking
    ? playerSide ?? "left"
    : chooseBotAttackSide(rng);

  const lance = resolveLance({
    lanceNumber: state.currentLance,
    attackingTeam: state.possession,
    attackingLineup: playerAttacking ? state.playerLineup : state.botLineup,
    defendingLineup: playerAttacking ? state.botLineup : state.playerLineup,
    attackerAura: playerAttacking ? playerAura : botAura,
    defenderAura: playerAttacking ? botAura : playerAura,
    side,
    scoreBefore: state.score,
    rng,
  });

  const lances = [...state.lances, lance];
  const finished = lances.length >= state.totalLances;

  return {
    ...state,
    currentLance: Math.min(state.currentLance + 1, state.totalLances),
    score: lance.scoreAfter,
    possession: lance.possessionAfter,
    lances,
    finished,
  };
}

export function calculateMatchStats(matchState: MatchState): MatchStats {
  const possessionCount = { player: 0, bot: 0 };
  const shots = { player: 0, bot: 0 };
  const onTarget = { player: 0, bot: 0 };

  for (const lance of matchState.lances) {
    possessionCount[lance.attackingTeam] += 1;

    if (lance.shotDuel) {
      shots[lance.attackingTeam] += 1;
      if (lance.goalTeam === lance.attackingTeam) onTarget[lance.attackingTeam] += 1;
    }
    if (lance.counter?.shotDuel) {
      const counterTeam = opponent(lance.attackingTeam);
      shots[counterTeam] += 1;
      if (lance.goalTeam === counterTeam) onTarget[counterTeam] += 1;
    }
  }

  const totalLances = Math.max(matchState.lances.length, 1);
  const playerPossession = Math.round((possessionCount.player / totalLances) * 100);

  const { player, bot } = matchState.score;
  const result: MatchResult =
    player > bot ? "victory" : player < bot ? "defeat" : "draw";

  return {
    result,
    goals: { ...matchState.score },
    possession: { player: playerPossession, bot: 100 - playerPossession },
    shots,
    onTarget,
  };
}
