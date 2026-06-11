"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AttributeEditor } from "@/components/attribute-editor";
import { AuraSphere } from "@/components/aura-sphere";
import { Logo } from "@/components/logo";
import {
  ATTRIBUTE_LABELS,
  POSITION_ATTRIBUTES,
  getAttribute,
  type PlayerCard,
  type Position,
  type Rarity,
} from "@/lib/game-engine";
import { useHydrated } from "@/lib/use-hydrated";
import { useGameStore } from "@/store/game-store";

const GROUPS: { title: string; position: Position }[] = [
  { title: "ATACANTES", position: "ATK" },
  { title: "ZAGUEIROS", position: "ZAG" },
  { title: "GOLEIROS", position: "GOL" },
];

const RARITY_STYLES: Record<Rarity, string> = {
  lendario: "bg-amber-100 text-amber-700",
  epico: "bg-purple-100 text-purple-700",
  raro: "bg-blue-100 text-blue-700",
  comum: "bg-emerald-100 text-emerald-700",
};

const RARITY_LABELS: Record<Rarity, string> = {
  lendario: "Lendário",
  epico: "Épico",
  raro: "Raro",
  comum: "Comum",
};

export default function DraftPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const pack = useGameStore((s) => s.pack);
  const picked = useGameStore((s) => s.picked);
  const openBooster = useGameStore((s) => s.openBooster);
  const togglePick = useGameStore((s) => s.togglePick);
  const saveAttributes = useGameStore((s) => s.saveAttributes);
  const confirmLineup = useGameStore((s) => s.confirmLineup);

  const [editingId, setEditingId] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span className="animate-pulse text-5xl">🗿</span>
      </main>
    );
  }

  // ----------------------------------------------------------- pack fechado
  if (!pack) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-12 text-center">
        <Logo size="md" />

        <div className="card-reveal relative flex h-72 w-52 flex-col items-center justify-center gap-4 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-700 shadow-2xl shadow-zinc-400">
          <span className="text-6xl no-select">🗿</span>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white">
            Booster
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            3 ATK · 4 ZAG · 2 GOL
          </p>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <AuraSphere size={26} className="aura-float" />
          </div>
        </div>

        <button
          onClick={openBooster}
          className="h-16 w-full max-w-xs rounded-full bg-aura text-lg font-black tracking-[0.2em] text-white shadow-lg shadow-emerald-200 transition active:scale-95"
        >
          ABRIR BOOSTER
        </button>
      </main>
    );
  }

  // -------------------------------------------------------- pack aberto
  const byId = (id: string | null | undefined): PlayerCard | undefined =>
    pack.find((c) => c.id === id);

  const isPicked = (card: PlayerCard) =>
    picked.atk === card.id ||
    picked.gol === card.id ||
    picked.zags.includes(card.id);

  const capacityFull = (card: PlayerCard) =>
    card.position === "ATK"
      ? picked.atk !== null
      : card.position === "GOL"
        ? picked.gol !== null
        : picked.zags.length >= 2;

  const nextNeed = !picked.atk
    ? "atk"
    : picked.zags.length === 0
      ? "zagLeft"
      : picked.zags.length === 1
        ? "zagRight"
        : !picked.gol
          ? "gol"
          : null;

  const instruction =
    nextNeed === "atk"
      ? "Escolha 1 atacante"
      : nextNeed === "zagLeft"
        ? "Escolha 2 zagueiros (0/2)"
        : nextNeed === "zagRight"
          ? "Escolha 2 zagueiros (1/2)"
          : nextNeed === "gol"
            ? "Escolha 1 goleiro"
            : "Tudo pronto! Toque em um escalado para ajustar atributos.";

  const slots = [
    { key: "atk", label: "ATK", card: byId(picked.atk) },
    { key: "zagLeft", label: "ZAG", card: byId(picked.zags[0]) },
    { key: "zagRight", label: "ZAG", card: byId(picked.zags[1]) },
    { key: "gol", label: "GOL", card: byId(picked.gol) },
  ];

  const complete = nextNeed === null;
  const editingCard = byId(editingId);

  const handleRowTap = (card: PlayerCard) => {
    if (isPicked(card)) {
      setEditingId(card.id);
    } else if (!capacityFull(card)) {
      togglePick(card.id);
    }
  };

  const handleConfirm = () => {
    if (confirmLineup()) router.push("/match");
  };

  return (
    <main className="flex flex-1 flex-col px-4 pb-64 pt-6">
      <header className="mb-4 flex items-center justify-between">
        <Logo size="sm" />
        <span className="rounded-full bg-zinc-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Escalação
        </span>
      </header>

      {GROUPS.map((group) => {
        const cards = pack.filter((c) => c.position === group.position);
        return (
          <section key={group.position} className="mb-5">
            <h2 className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
              {group.title} ({cards.length})
            </h2>
            <div className="flex flex-col gap-2">
              {cards.map((card, i) => {
                const selected = isPicked(card);
                const dimmed = !selected && capacityFull(card);
                const [a, b] = POSITION_ATTRIBUTES[card.position];
                return (
                  <button
                    key={card.id}
                    onClick={() => handleRowTap(card)}
                    className={`card-reveal flex items-center justify-between rounded-2xl border-2 bg-white px-4 py-3 text-left shadow-sm transition active:scale-[0.98] ${
                      selected
                        ? "border-aura aura-glow"
                        : dimmed
                          ? "border-zinc-100 opacity-40"
                          : "border-zinc-100"
                    }`}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black tracking-tight">
                        {card.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          {card.position}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${RARITY_STYLES[card.rarity]}`}
                        >
                          {RARITY_LABELS[card.rarity]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-3">
                      <div className="text-right text-[10px] font-semibold uppercase leading-4 tracking-wider text-zinc-500">
                        <p>
                          {ATTRIBUTE_LABELS[a].slice(0, 3)}{" "}
                          <b className="text-foreground">{getAttribute(card, a)}</b>
                        </p>
                        <p>
                          {ATTRIBUTE_LABELS[b].slice(0, 3)}{" "}
                          <b className="text-foreground">{getAttribute(card, b)}</b>
                        </p>
                      </div>
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black ${
                          selected ? "bg-aura text-white" : "bg-zinc-100"
                        }`}
                      >
                        {card.baseScore}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ------------------------------------------- campo + confirmar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-background/95 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4">
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            {instruction}
          </p>

          <div className="mb-3 grid grid-cols-4 gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-2">
            {slots.map((slot) => {
              const highlighted = nextNeed === slot.key;
              return (
                <button
                  key={slot.key}
                  onClick={() => slot.card && setEditingId(slot.card.id)}
                  className={`flex h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 transition ${
                    slot.card
                      ? "border-aura bg-white shadow-sm active:scale-95"
                      : highlighted
                        ? "slot-pulse border-aura border-dashed bg-white/60"
                        : "border-dashed border-zinc-300 bg-white/40"
                  }`}
                >
                  {slot.card ? (
                    <>
                      <span className="text-lg font-black leading-none">
                        {slot.card.baseScore}
                      </span>
                      <span className="max-w-full truncate px-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        {slot.card.name.split(" ").at(-1)}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-aura">
                        {slot.label}
                      </span>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-black uppercase tracking-widest ${
                        highlighted ? "text-aura" : "text-zinc-400"
                      }`}
                    >
                      {slot.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!complete}
            className="h-14 w-full rounded-full bg-foreground text-base font-black tracking-[0.2em] text-white shadow-lg transition active:scale-95 disabled:bg-zinc-300 disabled:shadow-none"
          >
            CONFIRMAR ESCALAÇÃO
          </button>
        </div>
      </div>

      {editingCard && (
        <AttributeEditor
          card={editingCard}
          onSave={(changes) => saveAttributes(editingCard.id, changes)}
          onRemove={() => togglePick(editingCard.id)}
          onClose={() => setEditingId(null)}
        />
      )}
    </main>
  );
}
