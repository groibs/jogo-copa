# TODO — 🗿 ÉGOL+AURA

## Feito (MVP)

- [x] Projeto Next.js (App Router, TypeScript, Tailwind v4, src/, mobile-first)
- [x] Motor puro em `src/lib/game-engine` (pack, duelos, contra-ataque, bot, partida, stats)
- [x] Pool de 70 jogadores (`src/data/players.ts`)
- [x] Home → Draft (booster + escalação + edição de atributos) → Partida → Resultado
- [x] HUD de Aura agrupada por jogador (ATA/ZGE/ZGD/GOL, 2 atributos + slot cada)
- [x] Pool de esferas no canto inferior direito com drag-and-drop real
  (pointer events + esfera fantasma) e fallback por toque
- [x] Persistência local (Zustand + localStorage): pack, escalação, partida
- [x] Smoke test do motor (`scripts/simulate.ts`, 500 partidas)
- [x] `npm run lint` e `npm run build` passando

## Próximos passos

### Balanceamento (ver medições em GAME_SPEC.md)

- [ ] Reduzir taxa de empates 0x0. Knobs candidatos (decisão de design):
  - empate no duelo de drible favorecer o **atacante** (ou desempate por rating)
  - bônus de ataque fixo (+5) na finalização
  - permitir 2 pontos de Aura no mesmo atributo (mais variância)
  - bot às vezes "errar" o lado da defesa com peso maior
- [ ] Mostrar (ou não) atributos do bot no campo — hoje só rating; decidir
  quanto de informação revela leitura tática
- [ ] Sortear posse inicial (hoje o jogador sempre começa)

### Produto / UX

- [ ] Animações de revelação do booster (flip de cartas)
- [ ] Animação do lance (bola percorrendo o campo, shake no gol)
- [ ] Sons curtos (gol, defesa, roubo) com toggle de mudo
- [ ] Haptics em mobile (navigator.vibrate) ao soltar Aura e no gol
- [ ] Tela de "como jogar" (3 cards de onboarding)
- [ ] Trocar nomes reais por fictícios (basta editar `src/data/players.ts`)

### Técnica

- [ ] Testes unitários formais (Vitest) substituindo/complementando o simulador
- [ ] Extrair textos para um dicionário (i18n simples pt-BR)
- [ ] Acessibilidade: navegação por teclado na HUD de aura, aria-live no feedback

### Fora de escopo do MVP (não criar agora)

Loja, coleção, ranking, moedas, XP, gemas, card de treinador, login,
backend, banco, multiplayer online, pagamento, deploy.
