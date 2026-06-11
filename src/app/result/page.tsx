"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { calculateMatchStats } from "@/lib/game-engine";
import { useHydrated } from "@/lib/use-hydrated";
import { useGameStore } from "@/store/game-store";

const RESULT_CONFIG = {
  victory: { label: "VITÓRIA", className: "text-aura" },
  defeat: { label: "DERROTA", className: "text-zinc-900" },
  draw: { label: "EMPATE", className: "text-zinc-400" },
} as const;

export default function ResultPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const match = useGameStore((s) => s.match);
  const startNewRun = useGameStore((s) => s.startNewRun);
  const resetAll = useGameStore((s) => s.resetAll);

  // Sai para "/" se não houver partida finalizada — exceto quando o próprio
  // usuário acabou de iniciar outra navegação (JOGAR NOVAMENTE limpa o match
  // e o redirect venceria a corrida contra o push para /draft).
  const leavingRef = useRef(false);

  useEffect(() => {
    if (leavingRef.current) return;
    if (hydrated && (!match || !match.finished)) {
      router.replace("/");
    }
  }, [hydrated, match, router]);

  if (!hydrated || !match || !match.finished) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span className="animate-pulse text-5xl">🗿</span>
      </main>
    );
  }

  const stats = calculateMatchStats(match);
  const config = RESULT_CONFIG[stats.result];

  const rows = [
    {
      label: "Posse de bola",
      player: `${stats.possession.player}%`,
      bot: `${stats.possession.bot}%`,
    },
    {
      label: "Finalizações",
      player: stats.shots.player,
      bot: stats.shots.bot,
    },
    {
      label: "Acertos no gol",
      player: stats.onTarget.player,
      bot: stats.onTarget.bot,
    },
  ];

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <Logo size="sm" />

      <div className="card-reveal flex flex-col items-center gap-2">
        <h1
          className={`text-5xl font-black italic tracking-tighter ${config.className}`}
        >
          {config.label}
        </h1>
        <p className="text-6xl font-black tabular-nums tracking-tight">
          {match.score.player}
          <span className="px-2 text-zinc-300">×</span>
          {match.score.bot}
        </p>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          <span>Você</span>
          <span>Rival</span>
        </div>
      </div>

      <div className="w-full max-w-xs rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 ${
              i > 0 ? "border-t border-zinc-100" : ""
            }`}
          >
            <span className="w-12 text-left text-lg font-black tabular-nums text-aura">
              {row.player}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {row.label}
            </span>
            <span className="w-12 text-right text-lg font-black tabular-nums">
              {row.bot}
            </span>
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={() => {
            leavingRef.current = true;
            startNewRun();
            router.push("/draft");
          }}
          className="h-14 w-full rounded-full bg-aura text-base font-black tracking-[0.2em] text-white shadow-lg shadow-emerald-200 transition active:scale-95"
        >
          JOGAR NOVAMENTE
        </button>
        <button
          onClick={() => {
            leavingRef.current = true;
            resetAll();
            router.push("/");
          }}
          className="h-14 w-full rounded-full border-2 border-zinc-300 bg-white text-base font-black tracking-[0.2em] text-zinc-600 transition active:scale-95"
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    </main>
  );
}
