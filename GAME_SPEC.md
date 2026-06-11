# 🗿 ÉGOL+AURA — Especificação do jogo (MVP)

Cardgame casual de futebol. Partidas de **7 lances** contra um bot.
Mobile-first, local, sem backend.

## Loop principal

```
Home → Booster/Escalação → Partida (7 lances) → Resultado
```

## Booster (pack)

Cada booster gera exatamente, sem repetição:

| Posição | Quantidade |
| ------- | ---------- |
| ATK     | 3          |
| ZAG     | 4          |
| GOL     | 2          |

## Escalação

O jogador (e o bot) escalam **4 jogadores**: 1 ATK, 2 ZAG (esquerdo e
direito) e 1 GOL. Os zagueiros ocupam os slots na ordem de seleção
(1º = ZGE, 2º = ZGD).

## Atributos por posição

| Posição | Atributos        |
| ------- | ---------------- |
| ATK     | Drible, Chute    |
| ZAG     | Desarme, Passe   |
| GOL     | Reflexo, Defesa  |

### Score

- `referenceOverall`: rating aproximado de referência (inspirado em ratings
  públicos de jogos de futebol).
- `baseScore`: arredondamento para o jogo, somente {60, 70, 80, 90, 100}:
  - `>= 90` → 100 | `84–89` → 90 | `78–83` → 80 | `70–77` → 70 | `< 70` → 60
- O `baseScore` é o **total de pontos** distribuível entre os 2 atributos.
- Edição no draft: passos de **10**, soma sempre igual ao `baseScore`
  (modelo de soma zero: aumentar um reduz o outro).

### Raridade e cor

| baseScore | Raridade | colorTheme |
| --------- | -------- | ---------- |
| 100       | Lendário | gold       |
| 90        | Épico    | purple     |
| 80        | Raro     | blue       |
| 70 / 60   | Comum    | green      |

## Aura

- **3 pontos** de Aura por lance, para cada lado, sem acumular entre lances.
- Cada ponto vale **+5** no atributo onde foi colocado.
- Distribuída **antes** de revelar a jogada; pode ser removida/devolvida ao
  pool até o REVELAR JOGADA.
- **Máximo de 1 ponto por atributo** no MVP.

### Alvos (HUD agrupada por jogador)

```
ATA            ZGE            ZGD            GOL
├ Chute   ○    ├ Desarme ○    ├ Desarme ○    ├ Reflexo ○
└ Drible  ○    └ Passe   ○    └ Passe   ○    └ Defesa  ○
```

8 alvos no total (2 por jogador da lineup). O pool aparece como esferas
verdes no canto inferior direito (1 principal + menores atrás), que diminuem
conforme a Aura é usada. Interações:

- **Arrastar** a esfera até um slot de atributo (drag-and-drop por pointer
  events, com esfera fantasma seguindo o dedo).
- **Tocar** na esfera "pega" a Aura; tocar em um slot solta.
- Tocar em um slot **preenchido** devolve a esfera ao pool.
- Tocar em um slot **vazio** com Aura disponível também preenche (atalho).

A Aura colocada em alvos que não participam do lance é perdida — faz parte
da leitura de jogo (ex.: aurar a defesa quando você tem a posse é seguro
contra contra-ataques, mas desperdiça ataque).

## Partida

- 7 lances. O **jogador começa com a posse**.
- Quem tem a posse ataca; o atacante escolhe o lado: **ESQUERDA** enfrenta o
  zagueiro esquerdo do rival, **DIREITA** o direito.
- O bot distribui Aura e escolhe lado de forma semi-aleatória (pesos:
  atacando investe no atacante; defendendo alterna zagueiros/goleiro e às
  vezes guarda Chute para contra-ataque).

### Fluxo do lance

```
1) DUELO DE DRIBLE
   Drible do ATK (+aura) vs Desarme do ZAG do lado atacado (+aura)
   ├─ zagueiro vence OU empata → ROUBO → contra-ataque (4)
   └─ atacante vence → segue (2)

2) DUELO DE REFLEXO (não gera gol — gera modificador)
   Drible do ATK (+aura) vs Reflexo do GOL (+aura)
   margem >= +20 → Chute +10      | margem +10..+19 → Chute +5
   margem -9..+9 → Chute normal   | margem -10..-19 → Chute -5
   margem <= -20 → Chute -10

3) FINALIZAÇÃO
   Chute do ATK (+aura +modificador) vs Defesa do GOL (+aura)
   ├─ atacante vence → GOL
   └─ goleiro vence OU empata → DEFESA (empate favorece a defesa)

4) CONTRA-ATAQUE (após roubo)
   margem = total do zagueiro - total do atacante (do duelo de drible)
   chance de passe = Passe do zagueiro (+aura) + margem, limitada a 20%–80%
   ├─ passe encaixa → ATK do time que roubou finaliza:
   │     Chute -10 (+aura) vs Defesa do goleiro adversário (+aura)
   │     (sem duelo de reflexo; empate favorece a defesa) → lance acaba
   └─ passe falha → lance acaba, posse fica com quem roubou
```

### Posse após o lance

| Evento                      | Posse vai para…           |
| --------------------------- | ------------------------- |
| Gol (normal ou contra)      | quem sofreu o gol         |
| Defesa do goleiro           | quem defendeu             |
| Roubo + passe falhou        | quem roubou               |
| Contra-ataque finalizado    | o time que atacou primeiro |

### Feedback textual

"Passou pelo zagueiro", "Zagueiro roubou", "Abriu ângulo",
"Goleiro fechou o ângulo", "Cara a cara com o goleiro", "Gol", "Defesa",
"Contra-ataque", "Passe falhou", "Finalização bloqueada".

## Resultado e estatísticas

- **Vitória / Derrota / Empate** + placar final.
- **Posse de bola**: % de lances iniciados com a posse de cada time.
- **Finalizações**: chutes a gol (normais + contra-ataques).
- **Acertos no gol**: finalizações que terminaram em gol.

## Determinismo

Todo o motor é puro e seedado (mulberry32): mesma seed ⇒ mesmo pack, mesma
lineup do bot e mesmas decisões. A única rolagem aleatória do lance é o
passe do contra-ataque, derivada da seed da partida + número do lance.

## Notas de balanceamento (medições do simulador)

`npx tsx scripts/simulate.ts` simula 500 partidas. Resultados atuais:

- Jogador aleatório: ~19% vitórias / ~34% derrotas / ~47% empates.
- Jogador estratégico (aura coerente com a posse): ~34% V / ~13% D / ~53% E.
- Estratégia "drible máximo + muralha": quase não perde, mas empata 0x0
  (~78% empates) — pouco gol.

Leitura: estratégia é recompensada, mas o empate favorecendo a defesa em
todos os duelos torna o 0x0 comum. Knobs sugeridos para a próxima iteração
estão em `TODO.md` (não alteram este spec sem decisão de design).
