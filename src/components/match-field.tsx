"use client";

import type { Lineup, TeamId } from "@/lib/game-engine";

function FieldCard({
  label,
  rating,
  variant,
  hasBall,
}: {
  label: string;
  rating: number;
  variant: "player" | "bot";
  hasBall?: boolean;
}) {
  return (
    <div
      className={`relative flex h-12 w-14 flex-col items-center justify-center rounded-xl border-2 shadow-sm no-select ${
        variant === "player"
          ? "border-aura bg-white text-foreground"
          : "border-zinc-700 bg-zinc-900 text-white"
      }`}
    >
      <span
        className={`text-[8px] font-bold uppercase tracking-widest ${
          variant === "player" ? "text-aura" : "text-zinc-400"
        }`}
      >
        {label}
      </span>
      <span className="text-base font-black leading-none">{rating}</span>
      {hasBall && (
        <span className="absolute -right-2 -top-2 text-sm" aria-label="posse">
          ⚽
        </span>
      )}
    </div>
  );
}

/** Campo com exatamente 8 jogadores: 4 do jogador (verde) e 4 do bot (preto). */
export function MatchField({
  playerLineup,
  botLineup,
  possession,
}: {
  playerLineup: Lineup;
  botLineup: Lineup;
  possession: TeamId;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/80 px-4 py-3 shadow-sm">
      {/* linha central */}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-emerald-200" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-200" />

      {/* time do bot (ataca para baixo) */}
      <div className="relative flex flex-col items-center gap-1.5">
        <FieldCard label="GOL" rating={botLineup.gol.baseScore} variant="bot" />
        <div className="flex w-full justify-center gap-10">
          <FieldCard label="ZGE" rating={botLineup.zagLeft.baseScore} variant="bot" />
          <FieldCard label="ZGD" rating={botLineup.zagRight.baseScore} variant="bot" />
        </div>
        <FieldCard
          label="ATA"
          rating={botLineup.atk.baseScore}
          variant="bot"
          hasBall={possession === "bot"}
        />
      </div>

      <div className="h-4" />

      {/* time do jogador (ataca para cima) */}
      <div className="relative flex flex-col items-center gap-1.5">
        <FieldCard
          label="ATA"
          rating={playerLineup.atk.baseScore}
          variant="player"
          hasBall={possession === "player"}
        />
        <div className="flex w-full justify-center gap-10">
          <FieldCard label="ZGE" rating={playerLineup.zagLeft.baseScore} variant="player" />
          <FieldCard label="ZGD" rating={playerLineup.zagRight.baseScore} variant="player" />
        </div>
        <FieldCard label="GOL" rating={playerLineup.gol.baseScore} variant="player" />
      </div>
    </div>
  );
}
