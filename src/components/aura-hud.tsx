"use client";

import {
  ATTRIBUTE_LABELS,
  LINEUP_SLOT_LABELS,
  POSITION_ATTRIBUTES,
  type AuraAllocation,
  type AuraTarget,
  type Lineup,
  type LineupSlot,
} from "@/lib/game-engine";

const HUD_SLOTS: LineupSlot[] = ["atk", "zagLeft", "zagRight", "gol"];

/**
 * HUD de Aura agrupada por jogador da lineup:
 * 4 colunas (ATA / ZGE / ZGD / GOL), cada uma com os 2 atributos
 * do jogador e 1 slot circular de Aura ao lado de cada atributo.
 *
 * Cada linha de atributo é um alvo de drop (data-aura-target) e também
 * responde a toque: toca para preencher, toca de novo para devolver ao pool.
 */
export function AuraHud({
  lineup,
  allocation,
  highlightEmpty,
  onSlotTap,
}: {
  lineup: Lineup;
  allocation: AuraAllocation;
  /** Realça slots vazios enquanto o jogador segura/arrasta uma esfera. */
  highlightEmpty: boolean;
  onSlotTap: (target: AuraTarget) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {HUD_SLOTS.map((slot) => {
        const card = lineup[slot];
        const [a, b] = POSITION_ATTRIBUTES[card.position];
        return (
          <div
            key={slot}
            className="rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-sm"
          >
            <div className="mb-1 flex items-baseline justify-between px-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider">
                {LINEUP_SLOT_LABELS[slot]}
              </span>
              <span className="text-[9px] font-bold text-zinc-400">
                {card.baseScore}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {[a, b].map((attr) => {
                const target = `${slot}-${attr}` as AuraTarget;
                const filled = (allocation[target] ?? 0) > 0;
                return (
                  <button
                    key={attr}
                    data-aura-target={target}
                    onClick={() => onSlotTap(target)}
                    className={`flex items-center justify-between gap-1 rounded-lg px-1 py-0.5 transition active:scale-95 ${
                      filled ? "bg-emerald-50" : "bg-zinc-50"
                    }`}
                  >
                    <span className="text-[8px] font-bold uppercase tracking-wide text-zinc-500">
                      {ATTRIBUTE_LABELS[attr]}
                    </span>
                    <span
                      className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
                        filled
                          ? "aura-sphere aura-glow"
                          : `border-2 bg-white ${
                              highlightEmpty
                                ? "slot-pulse border-aura"
                                : "border-zinc-300"
                            }`
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
