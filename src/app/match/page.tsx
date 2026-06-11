"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuraHud } from "@/components/aura-hud";
import { AuraPool } from "@/components/aura-pool";
import { LanceOverlay } from "@/components/lance-overlay";
import { Logo } from "@/components/logo";
import { MatchField } from "@/components/match-field";
import {
  AURA_POINTS_PER_LANCE,
  MAX_AURA_PER_TARGET,
  type AttackSide,
  type AuraAllocation,
  type AuraTarget,
} from "@/lib/game-engine";
import { useHydrated } from "@/lib/use-hydrated";
import { useGameStore } from "@/store/game-store";

export default function MatchPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const match = useGameStore((s) => s.match);
  const playLance = useGameStore((s) => s.playLance);

  const [allocation, setAllocation] = useState<AuraAllocation>({});
  const [side, setSide] = useState<AttackSide | null>(null);
  const [carrying, setCarrying] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!match) {
      router.replace("/draft");
    } else if (match.finished && !overlayOpen) {
      router.replace("/result");
    }
  }, [hydrated, match, overlayOpen, router]);

  if (!hydrated || !match || (match.finished && !overlayOpen)) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span className="animate-pulse text-5xl">🗿</span>
      </main>
    );
  }

  const used = Object.values(allocation).reduce((sum, v) => sum + (v ?? 0), 0);
  const remaining = AURA_POINTS_PER_LANCE - used;
  const playerAttacking = match.possession === "player";
  const lastLance = match.lances[match.lances.length - 1];
  const canReveal = !playerAttacking || side !== null;

  const placeAura = (target: AuraTarget) => {
    if ((allocation[target] ?? 0) >= MAX_AURA_PER_TARGET || remaining <= 0) return;
    setAllocation((a) => ({ ...a, [target]: 1 }));
    setCarrying(false);
  };

  const handleSlotTap = (target: AuraTarget) => {
    if ((allocation[target] ?? 0) > 0) {
      // devolve a esfera ao pool
      setAllocation((a) => ({ ...a, [target]: 0 }));
    } else {
      placeAura(target);
    }
  };

  const handleReveal = () => {
    if (!canReveal || match.finished) return;
    playLance({ aura: allocation, side });
    setAllocation({});
    setSide(null);
    setCarrying(false);
    setOverlayOpen(true);
  };

  const handleContinue = () => {
    setOverlayOpen(false);
    if (match.finished) router.push("/result");
  };

  return (
    <main className="flex flex-1 flex-col px-4 pb-44 pt-4">
      {/* ----------------------------------------------------------- topo */}
      <header className="mb-3 flex flex-col items-center gap-2">
        <Logo size="sm" />
        <div className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-2 shadow-sm">
          <span className="text-xs font-black uppercase tracking-widest text-aura">
            Você
          </span>
          <span className="text-2xl font-black tabular-nums tracking-tight">
            {match.score.player} × {match.score.bot}
          </span>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
            Rival
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Lance {match.currentLance}/{match.totalLances}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
              playerAttacking ? "bg-aura text-white" : "bg-zinc-900 text-white"
            }`}
          >
            {playerAttacking ? "Sua posse" : "Posse do rival"}
          </span>
        </div>
      </header>

      {/* ---------------------------------------------------------- campo */}
      <MatchField
        playerLineup={match.playerLineup}
        botLineup={match.botLineup}
        possession={match.possession}
      />

      {/* ------------------------------------------------------ aura HUD */}
      <section className="mt-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.25em]">
            Distribuir Aura
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {remaining} restante{remaining === 1 ? "" : "s"}
          </span>
        </div>
        <p className="mb-2 text-[11px] font-medium text-zinc-500">
          Arraste suas esferas de Aura para os atributos
        </p>
        <AuraHud
          lineup={match.playerLineup}
          allocation={allocation}
          highlightEmpty={carrying && remaining > 0}
          onSlotTap={handleSlotTap}
        />
      </section>

      {/* ------------------------------------------------- lado do ataque */}
      <section className="mt-4">
        {playerAttacking ? (
          <>
            <h2 className="mb-2 text-xs font-black uppercase tracking-[0.25em]">
              Lado do ataque
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["left", "ESQUERDA"],
                  ["right", "DIREITA"],
                ] as [AttackSide, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setSide(value)}
                  className={`h-12 rounded-2xl border-2 text-sm font-black tracking-[0.15em] transition active:scale-95 ${
                    side === value
                      ? "border-aura bg-aura text-white shadow-md shadow-emerald-200"
                      : "border-zinc-200 bg-white text-zinc-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-xs font-semibold text-zinc-500">
            O rival escolherá o lado do ataque. Reforce sua defesa com Aura!
          </div>
        )}
      </section>

      {/* --------------------------------------- barra fixa: revelar + pool */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-background/95 pb-[max(env(safe-area-inset-bottom),14px)] pt-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-end gap-3 px-4">
          <div className="flex-1">
            {playerAttacking && side === null && (
              <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Escolha o lado do ataque
              </p>
            )}
            <button
              onClick={handleReveal}
              disabled={!canReveal}
              className="h-14 w-full rounded-full bg-foreground text-base font-black tracking-[0.18em] text-white shadow-lg transition active:scale-95 disabled:bg-zinc-300 disabled:shadow-none"
            >
              REVELAR JOGADA
            </button>
          </div>
          <AuraPool
            remaining={remaining}
            carrying={carrying}
            disabled={overlayOpen}
            onTapPick={() => setCarrying((c) => !c)}
            onDropOnTarget={placeAura}
          />
        </div>
      </div>

      {overlayOpen && lastLance && (
        <LanceOverlay
          lance={lastLance}
          finished={match.finished}
          onContinue={handleContinue}
        />
      )}
    </main>
  );
}
