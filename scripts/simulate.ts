// ===========================================================================
// Smoke test do motor: simula centenas de partidas completas e valida
// invariantes das regras. Rodar com: npx tsx scripts/simulate.ts
// ===========================================================================

import {
  AURA_TARGETS,
  advanceMatchState,
  calculateMatchStats,
  createInitialMatchState,
  generateBotLineup,
  generatePack,
  getPlayerPool,
  mulberry32,
  updateCardAttributes,
  type AuraAllocation,
  type Lineup,
  type MatchState,
} from "../src/lib/game-engine";

let failures = 0;

function check(condition: boolean, message: string) {
  if (!condition) {
    failures++;
    console.error(`✗ ${message}`);
  }
}

// ----------------------------------------------------------------- pool
const pool = getPlayerPool();
check(pool.length === 70, `pool tem 70 jogadores (tem ${pool.length})`);
check(pool.filter((p) => p.position === "ATK").length === 24, "pool tem 24 ATK");
check(pool.filter((p) => p.position === "ZAG").length === 31, "pool tem 31 ZAG");
check(pool.filter((p) => p.position === "GOL").length === 15, "pool tem 15 GOL");

for (const card of pool) {
  const sum = Object.values(card.attributes).reduce((a, b) => a + b, 0);
  check(
    sum === card.baseScore,
    `${card.name}: atributos somam ${sum}, esperado ${card.baseScore}`
  );
  const ids = pool.filter((p) => p.id === card.id);
  check(ids.length === 1, `id duplicado: ${card.id}`);
}

// ----------------------------------------------------------------- packs
for (let seed = 1; seed <= 200; seed++) {
  const pack = generatePack(seed);
  check(pack.length === 9, `pack ${seed}: 9 cartas`);
  check(pack.filter((p) => p.position === "ATK").length === 3, `pack ${seed}: 3 ATK`);
  check(pack.filter((p) => p.position === "ZAG").length === 4, `pack ${seed}: 4 ZAG`);
  check(pack.filter((p) => p.position === "GOL").length === 2, `pack ${seed}: 2 GOL`);
  check(new Set(pack.map((p) => p.id)).size === 9, `pack ${seed}: sem repetição`);
}

// ------------------------------------------------------------ atributos
const sampleAtk = pool.find((p) => p.id === "atk-mbappe")!;
const boosted = updateCardAttributes(sampleAtk, { drible: 80 });
check(boosted.attributes.drible === 80, "updateCardAttributes aplica mudança");
check(
  boosted.attributes.drible! + boosted.attributes.chute! === boosted.baseScore,
  "updateCardAttributes mantém soma = baseScore"
);
const overflow = updateCardAttributes(sampleAtk, { drible: 999 });
check(overflow.attributes.drible === 100 && overflow.attributes.chute === 0, "clamp no máximo");

// ------------------------------------------------------------- partidas
function randomAura(rng: () => number): AuraAllocation {
  const allocation: AuraAllocation = {};
  const targets = [...AURA_TARGETS].sort(() => rng() - 0.5).slice(0, 3);
  for (const t of targets) allocation[t] = 1;
  return allocation;
}

const totals = { victory: 0, defeat: 0, draw: 0 };
let totalGoals = 0;

for (let seed = 1; seed <= 500; seed++) {
  const rng = mulberry32(seed * 31);
  const pack = generatePack(seed);
  const playerLineup: Lineup = {
    atk: pack.filter((p) => p.position === "ATK")[0],
    zagLeft: pack.filter((p) => p.position === "ZAG")[0],
    zagRight: pack.filter((p) => p.position === "ZAG")[1],
    gol: pack.filter((p) => p.position === "GOL")[0],
  };
  const botLineup = generateBotLineup(seed + 1000);

  let state: MatchState = createInitialMatchState({ playerLineup, botLineup, seed });
  check(state.possession === "player", `seed ${seed}: jogador começa com a posse`);

  for (let lance = 1; lance <= 7; lance++) {
    check(state.currentLance === lance, `seed ${seed}: lance atual ${lance}`);
    const prevScore = { ...state.score };
    state = advanceMatchState({
      state,
      playerAura: randomAura(rng),
      playerSide: rng() < 0.5 ? "left" : "right",
    });
    const last = state.lances[state.lances.length - 1];

    const goals =
      state.score.player + state.score.bot - prevScore.player - prevScore.bot;
    check(goals === 0 || goals === 1, `seed ${seed}: no máximo 1 gol por lance`);
    check(
      (goals === 1) === (last.goalTeam !== null),
      `seed ${seed}: goalTeam consistente com placar`
    );
    check(state.possession === last.possessionAfter, `seed ${seed}: posse consistente`);

    // regras de posse
    if (last.goalTeam) {
      const conceded = last.goalTeam === "player" ? "bot" : "player";
      check(
        last.possessionAfter === conceded,
        `seed ${seed}: posse vai para quem sofreu o gol`
      );
    }
    if (last.counter) {
      check(
        last.counter.passChance >= 20 && last.counter.passChance <= 80,
        `seed ${seed}: chance de passe ${last.counter.passChance} fora de 20–80`
      );
      if (!last.counter.passSuccess) {
        const stealer = last.attackingTeam === "player" ? "bot" : "player";
        check(
          last.possessionAfter === stealer,
          `seed ${seed}: passe falhou, posse fica com quem roubou`
        );
      }
    }
    // aura dentro do limite
    for (const alloc of [last.playerAura, last.botAura]) {
      const sum = Object.values(alloc).reduce((a, b) => a + (b ?? 0), 0);
      check(sum <= 3, `seed ${seed}: alocação de aura ${sum} > 3`);
    }
  }

  check(state.finished, `seed ${seed}: partida termina após 7 lances`);
  check(state.lances.length === 7, `seed ${seed}: 7 lances registrados`);

  // avançar partida finalizada não muda nada
  const frozen = advanceMatchState({ state, playerAura: {}, playerSide: "left" });
  check(frozen === state, `seed ${seed}: partida finalizada é imutável`);

  const stats = calculateMatchStats(state);
  check(
    stats.possession.player + stats.possession.bot === 100,
    `seed ${seed}: posse soma 100%`
  );
  check(
    stats.onTarget.player <= stats.shots.player &&
      stats.onTarget.bot <= stats.shots.bot,
    `seed ${seed}: acertos <= finalizações`
  );
  check(
    stats.goals.player === state.score.player && stats.goals.bot === state.score.bot,
    `seed ${seed}: gols das stats = placar`
  );

  totals[stats.result]++;
  totalGoals += state.score.player + state.score.bot;
}

console.log("\n--- Simulação de 500 partidas ---");
console.log(`Vitórias: ${totals.victory} | Derrotas: ${totals.defeat} | Empates: ${totals.draw}`);
console.log(`Média de gols por partida: ${(totalGoals / 500).toFixed(2)}`);

if (failures > 0) {
  console.error(`\n${failures} verificações falharam.`);
  process.exit(1);
}
console.log("\n✓ Todas as verificações passaram.");
