# CLAUDE.md — 🗿 ÉGOL+AURA

Guia do projeto para sessões de desenvolvimento (humanas ou com IA).

## O que é

Protótipo web local de um cardgame casual de futebol, mobile-first.
Partidas de 7 lances contra bot. **Sem** backend, login, banco, loja,
coleção, ranking, moedas, XP, gemas ou deploy — não adicionar nada disso
sem decisão explícita do dono do projeto.

- Regras completas: `GAME_SPEC.md`
- Próximos passos: `TODO.md`
- Notas do Next.js gerado: `AGENTS.md`

## Comandos

```bash
npm run dev                 # dev server (Turbopack)
npm run lint                # ESLint (deve passar limpo)
npm run build               # build de produção (deve passar limpo)
npx tsx scripts/simulate.ts # smoke test do motor — rode após mexer no engine
```

## Arquitetura e convenções

- **Motor = funções puras** em `src/lib/game-engine/`. Nada de React, DOM ou
  I/O ali. Toda aleatoriedade entra por seed/`Rng` injetado (mulberry32) —
  isso mantém partidas reproduzíveis e o simulador confiável.
- `src/data/players.ts`: pool de 70 cartas. Nomes reais só como referência
  de protótipo; trocar por fictícios = editar `name`. A soma dos 2 atributos
  de cada carta DEVE ser igual ao `baseScore` (o simulador valida).
- **Estado** em `src/store/game-store.ts` (Zustand + persist/localStorage,
  chave `egol-aura-v1`). Persistimos pack, seleção e partida. Páginas que
  leem o store usam o gate `useHydrated()` para evitar mismatch de SSR.
- **Páginas** são client components finos; a lógica de jogo fica no engine,
  a orquestração no store. Rotas: `/`, `/draft`, `/match`, `/result`
  (apenas essas).
- **UI**: Tailwind v4 (tokens em `src/app/globals.css` — off-white,
  preto/cinza, verde `--aura`). Visual minimalista premium: cards
  arredondados, sombras suaves, tipografia black/italic. Sem fotos, escudos
  ou logos reais.
- Aura: alvos são `"<slotDaLineup>-<atributo>"` (`AuraTarget`). O drop do
  drag-and-drop é resolvido por `document.elementFromPoint` + atributo
  `data-aura-target` nos slots da HUD (`aura-hud.tsx` / `aura-pool.tsx`).

## Cuidados ao mudar regras

Os duelos seguem `GAME_SPEC.md` à risca (empate favorece a defesa; reflexo
gera modificador, não gol; contra-ataque com Chute -10 e passe 20%–80%).
Mudanças de balanceamento devem: (1) atualizar o spec, (2) rodar o
simulador e registrar os novos números, (3) manter as funções puras.
