"use client";

import type { LanceResult } from "@/lib/game-engine";

/** Feedback textual curto do lance recém-resolvido. */
export function LanceOverlay({
  lance,
  finished,
  onContinue,
}: {
  lance: LanceResult;
  finished: boolean;
  onContinue: () => void;
}) {
  const playerAttacked = lance.attackingTeam === "player";
  const sideLabel = lance.attackSide === "left" ? "esquerda" : "direita";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="rise-in w-full max-w-md rounded-t-3xl bg-white p-6 pb-10 shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Lance {lance.lanceNumber}
        </p>
        <h2 className="mt-1 text-lg font-black tracking-tight">
          {playerAttacked
            ? `Você atacou pela ${sideLabel}`
            : `O rival atacou pela ${sideLabel}`}
        </h2>

        <div className="mt-4 flex flex-col gap-2">
          {lance.events.map((event, i) => (
            <div
              key={i}
              className="card-reveal flex items-center gap-3"
              style={{ animationDelay: `${i * 220}ms` }}
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  event.team === "player" ? "bg-aura" : "bg-zinc-800"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  event.type === "goal" || event.type === "counter-goal"
                    ? "text-base font-black"
                    : "text-zinc-600"
                }`}
              >
                {event.text}
              </span>
            </div>
          ))}
        </div>

        {lance.goalTeam && (
          <div
            className={`card-reveal mt-4 rounded-2xl py-3 text-center text-2xl font-black italic tracking-tight text-white ${
              lance.goalTeam === "player" ? "bg-aura" : "bg-zinc-900"
            }`}
            style={{ animationDelay: `${lance.events.length * 220}ms` }}
          >
            {lance.goalTeam === "player" ? "GOL SEU! 🗿" : "GOL DO RIVAL"}
          </div>
        )}

        <div className="mt-4 text-center text-sm font-bold uppercase tracking-widest text-zinc-500">
          Você {lance.scoreAfter.player} × {lance.scoreAfter.bot} Rival
        </div>

        <button
          onClick={onContinue}
          className="mt-5 h-14 w-full rounded-full bg-foreground text-base font-black tracking-[0.2em] text-white transition active:scale-95"
        >
          {finished ? "VER RESULTADO" : "CONTINUAR"}
        </button>
      </div>
    </div>
  );
}
