# 🗿 ÉGOL+AURA

Cardgame casual de futebol, mobile-first, com partidas rápidas de 7 lances.
**Monte seu time. Distribua Aura. Faça 7x0.**

Protótipo web local — sem backend, sem login, sem loja, sem moedas. Só o jogo.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — de preferência no modo
mobile do navegador (o jogo é mobile-first).

Outros comandos:

```bash
npm run lint               # ESLint
npm run build              # build de produção
npx tsx scripts/simulate.ts # smoke test do motor (500 partidas simuladas)
```

## Fluxo do jogo

```
Home (/) → Booster + Escalação (/draft) → Partida (/match) → Resultado (/result)
```

1. **Home** — toque em **JOGAR**.
2. **Draft** — abra o booster (3 ATK, 4 ZAG, 2 GOL), escolha 1 atacante,
   2 zagueiros e 1 goleiro. Toque em um escalado para ajustar os 2 atributos
   da posição (passos de 10, total fixo = baseScore). Confirme a escalação.
3. **Partida** — 7 lances contra o bot. A cada lance, arraste (ou toque)
   suas 3 esferas de Aura para os atributos dos seus 4 jogadores
   (cada ponto vale +5). Se a posse for sua, escolha o lado do ataque
   (ESQUERDA/DIREITA) e toque em **REVELAR JOGADA**.
4. **Resultado** — vitória/derrota/empate, placar e estatísticas.
   Jogue de novo ou volte ao início.

As regras completas estão em [`GAME_SPEC.md`](./GAME_SPEC.md).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- Zustand + localStorage (estado e persistência local)
- Sem backend — tudo roda no navegador

## Arquitetura

```
src/
├── app/                  # Rotas: / , /draft , /match , /result
├── components/           # UI (campo, HUD de aura, pool de esferas, editor…)
├── data/players.ts       # Pool com 70 jogadores (nomes de referência)
├── lib/game-engine/      # Motor do jogo: funções puras e testáveis
│   ├── types.ts          # Tipos do domínio
│   ├── rng.ts            # RNG determinístico por seed
│   ├── cards.ts          # Pack, pool e atributos
│   ├── duels.ts          # Drible, reflexo, chute, contra-ataque
│   ├── bot.ts            # Lineup, aura e lado do bot
│   └── match.ts          # Estado da partida, lances e estatísticas
└── store/game-store.ts   # Zustand + persist (pack, escalação, partida)
```

Mais detalhes em [`CLAUDE.md`](./CLAUDE.md). Próximos passos em
[`TODO.md`](./TODO.md).
