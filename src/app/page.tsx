"use client";

import { useRouter } from "next/navigation";
import { AuraSphere } from "@/components/aura-sphere";
import { useGameStore } from "@/store/game-store";

export default function HomePage() {
  const router = useRouter();
  const startNewRun = useGameStore((s) => s.startNewRun);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-7xl no-select">🗿</span>
        <h1 className="text-5xl font-black italic tracking-tighter">
          ÉGOL<span className="text-aura">+</span>AURA
        </h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Monte seu time. Distribua Aura. Faça 7x0.
        </p>
      </div>

      <div className="flex items-end gap-2" aria-hidden>
        <AuraSphere size={18} className="aura-float [animation-delay:0.4s]" />
        <AuraSphere size={28} className="aura-float" />
        <AuraSphere size={18} className="aura-float [animation-delay:0.8s]" />
      </div>

      <button
        onClick={() => {
          startNewRun();
          router.push("/draft");
        }}
        className="h-16 w-full max-w-xs rounded-full bg-foreground text-xl font-black tracking-[0.3em] text-white shadow-lg shadow-zinc-300 transition active:scale-95"
      >
        JOGAR
      </button>

      <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
        Abra boosters, escale 4 jogadores e jogue uma partida rápida de 7
        lances.
      </p>
    </main>
  );
}
