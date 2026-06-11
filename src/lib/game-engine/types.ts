// ===========================================================================
// 🗿 ÉGOL+AURA — Tipos do motor do jogo
// ===========================================================================

export type Position = "ATK" | "ZAG" | "GOL";

export type AttributeKey =
  | "drible"
  | "chute"
  | "desarme"
  | "passe"
  | "reflexo"
  | "defesa";

export type BaseScore = 60 | 70 | 80 | 90 | 100;

export type Rarity = "comum" | "raro" | "epico" | "lendario";

export type ColorTheme = "green" | "blue" | "red" | "black" | "gold" | "purple";

/**
 * Cada carta tem exatamente os 2 atributos da sua posição.
 * ATK: drible + chute | ZAG: desarme + passe | GOL: reflexo + defesa
 * A soma dos 2 atributos é sempre igual ao baseScore.
 */
export type PlayerAttributes = Partial<Record<AttributeKey, number>>;

export interface PlayerCard {
  id: string;
  name: string;
  position: Position;
  referenceOverall: number;
  baseScore: BaseScore;
  attributes: PlayerAttributes;
  rarity: Rarity;
  colorTheme: ColorTheme;
}

/** Os 2 atributos de cada posição, na ordem de exibição. */
export const POSITION_ATTRIBUTES: Record<Position, [AttributeKey, AttributeKey]> = {
  ATK: ["chute", "drible"],
  ZAG: ["desarme", "passe"],
  GOL: ["reflexo", "defesa"],
};

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  drible: "Drible",
  chute: "Chute",
  desarme: "Desarme",
  passe: "Passe",
  reflexo: "Reflexo",
  defesa: "Defesa",
};

// ---------------------------------------------------------------------------
// Escalação
// ---------------------------------------------------------------------------

export type LineupSlot = "atk" | "zagLeft" | "zagRight" | "gol";

export interface Lineup {
  atk: PlayerCard;
  zagLeft: PlayerCard;
  zagRight: PlayerCard;
  gol: PlayerCard;
}

export const LINEUP_SLOT_LABELS: Record<LineupSlot, string> = {
  atk: "ATA",
  zagLeft: "ZGE",
  zagRight: "ZGD",
  gol: "GOL",
};

// ---------------------------------------------------------------------------
// Aura
// ---------------------------------------------------------------------------

/** Alvo de Aura = slot da escalação + atributo daquele jogador. */
export type AuraTarget =
  | "atk-drible"
  | "atk-chute"
  | "zagLeft-desarme"
  | "zagLeft-passe"
  | "zagRight-desarme"
  | "zagRight-passe"
  | "gol-reflexo"
  | "gol-defesa";

export const AURA_TARGETS: AuraTarget[] = [
  "atk-chute",
  "atk-drible",
  "zagLeft-desarme",
  "zagLeft-passe",
  "zagRight-desarme",
  "zagRight-passe",
  "gol-reflexo",
  "gol-defesa",
];

/** Quantos pontos de Aura estão em cada alvo (0 ou 1 no MVP). */
export type AuraAllocation = Partial<Record<AuraTarget, number>>;

export const AURA_POINTS_PER_LANCE = 3;
export const AURA_POINT_VALUE = 5;
export const MAX_AURA_PER_TARGET = 1;

// ---------------------------------------------------------------------------
// Partida
// ---------------------------------------------------------------------------

export type TeamId = "player" | "bot";

export type AttackSide = "left" | "right";

export interface DuelResult {
  attackerTotal: number;
  defenderTotal: number;
  /** attackerTotal - defenderTotal */
  margin: number;
  winner: "attacker" | "defender";
}

export type LanceEventType =
  | "side"
  | "dribble-pass"
  | "steal"
  | "angle-open"
  | "angle-neutral"
  | "angle-closed"
  | "goal"
  | "save"
  | "counter"
  | "pass-fail"
  | "counter-goal"
  | "counter-blocked";

export interface LanceEvent {
  type: LanceEventType;
  text: string;
  /** Time favorecido/protagonista do evento (para colorir o feedback). */
  team: TeamId;
}

export interface CounterAttackResult {
  passChance: number;
  passRoll: number;
  passSuccess: boolean;
  shotDuel: DuelResult | null;
  goal: boolean;
}

export interface LanceResult {
  lanceNumber: number;
  attackingTeam: TeamId;
  attackSide: AttackSide;
  events: LanceEvent[];
  dribbleDuel: DuelResult;
  reflexDuel: DuelResult | null;
  shotModifier: number;
  shotDuel: DuelResult | null;
  counter: CounterAttackResult | null;
  /** Time que marcou gol neste lance (ou null). */
  goalTeam: TeamId | null;
  possessionAfter: TeamId;
  scoreAfter: { player: number; bot: number };
  playerAura: AuraAllocation;
  botAura: AuraAllocation;
}

export interface MatchState {
  seed: number;
  /** Próximo lance a ser jogado (1-based). */
  currentLance: number;
  totalLances: number;
  score: { player: number; bot: number };
  possession: TeamId;
  playerLineup: Lineup;
  botLineup: Lineup;
  lances: LanceResult[];
  finished: boolean;
}

export type MatchResult = "victory" | "defeat" | "draw";

export interface MatchStats {
  result: MatchResult;
  goals: { player: number; bot: number };
  /** % de lances em que cada time começou com a posse. */
  possession: { player: number; bot: number };
  /** Finalizações: chutes a gol (normais + contra-ataques). */
  shots: { player: number; bot: number };
  /** Acertos no gol: finalizações que terminaram em gol. */
  onTarget: { player: number; bot: number };
}
