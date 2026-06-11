"use client";

import { useState } from "react";
import {
  ATTRIBUTE_LABELS,
  POSITION_ATTRIBUTES,
  getAttribute,
  type PlayerAttributes,
  type PlayerCard,
} from "@/lib/game-engine";

const STEP = 10;

/**
 * Painel de edição dos 2 atributos da posição.
 * Modelo de soma zero: aumentar um atributo reduz o outro,
 * mantendo o total sempre igual ao baseScore.
 */
export function AttributeEditor({
  card,
  onSave,
  onRemove,
  onClose,
}: {
  card: PlayerCard;
  onSave: (changes: PlayerAttributes) => void;
  onRemove?: () => void;
  onClose: () => void;
}) {
  const [firstKey, secondKey] = POSITION_ATTRIBUTES[card.position];
  const [firstValue, setFirstValue] = useState(getAttribute(card, firstKey));
  const secondValue = card.baseScore - firstValue;

  const adjust = (delta: number) =>
    setFirstValue((v) => Math.min(Math.max(v + delta, 0), card.baseScore));

  const rows = [
    {
      key: firstKey,
      value: firstValue,
      inc: () => adjust(STEP),
      dec: () => adjust(-STEP),
    },
    {
      key: secondKey,
      value: secondValue,
      inc: () => adjust(-STEP),
      dec: () => adjust(STEP),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="rise-in w-full max-w-md rounded-t-3xl bg-white p-6 pb-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight">{card.name}</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Ajustar atributos
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-100 px-3 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Total
            </p>
            <p className="text-lg font-black">{card.baseScore}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
            >
              <span className="text-sm font-bold uppercase tracking-widest">
                {ATTRIBUTE_LABELS[row.key]}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={row.dec}
                  disabled={row.value <= 0}
                  className="h-10 w-10 rounded-full border-2 border-zinc-300 text-xl font-black text-zinc-600 transition active:scale-90 disabled:opacity-30"
                  aria-label={`Diminuir ${ATTRIBUTE_LABELS[row.key]}`}
                >
                  −
                </button>
                <span className="w-10 text-center text-2xl font-black tabular-nums">
                  {row.value}
                </span>
                <button
                  onClick={row.inc}
                  disabled={row.value >= card.baseScore}
                  className="h-10 w-10 rounded-full border-2 border-aura bg-aura/10 text-xl font-black text-aura transition active:scale-90 disabled:opacity-30"
                  aria-label={`Aumentar ${ATTRIBUTE_LABELS[row.key]}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            onSave({ [firstKey]: firstValue });
            onClose();
          }}
          className="mt-6 h-14 w-full rounded-full bg-foreground text-base font-black tracking-[0.25em] text-white transition active:scale-95"
        >
          SALVAR
        </button>

        {onRemove && (
          <button
            onClick={() => {
              onRemove();
              onClose();
            }}
            className="mt-3 w-full text-center text-sm font-semibold text-red-500"
          >
            Remover da escalação
          </button>
        )}
      </div>
    </div>
  );
}
