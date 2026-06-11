"use client";

import { useRef, useState } from "react";
import type { AuraTarget } from "@/lib/game-engine";

const DRAG_THRESHOLD = 10;

interface DragState {
  startX: number;
  startY: number;
  moved: boolean;
}

/**
 * Pool de Aura no canto inferior direito: 1 esfera principal + esferas
 * menores atrás, representando os pontos restantes do lance.
 *
 * Interações:
 * - Arrastar a esfera principal até um alvo (data-aura-target) solta a Aura lá.
 * - Toque curto na esfera "pega" a Aura (modo carregando) — o próximo toque
 *   em um slot a solta.
 *
 * A lógica do gesto vive em ref (imune a atrasos de render); o estado React
 * só controla a esfera fantasma que segue o dedo.
 */
export function AuraPool({
  remaining,
  carrying,
  disabled,
  onTapPick,
  onDropOnTarget,
}: {
  remaining: number;
  carrying: boolean;
  disabled: boolean;
  onTapPick: () => void;
  onDropOnTarget: (target: AuraTarget) => void;
}) {
  const dragRef = useRef<DragState | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || remaining <= 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (
      !drag.moved &&
      Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) >
        DRAG_THRESHOLD
    ) {
      drag.moved = true;
    }
    if (drag.moved) setGhost({ x: e.clientX, y: e.clientY });
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.moved) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const targetEl = el?.closest<HTMLElement>("[data-aura-target]");
      const target = targetEl?.dataset.auraTarget as AuraTarget | undefined;
      if (target) onDropOnTarget(target);
    } else {
      onTapPick();
    }
    dragRef.current = null;
    setGhost(null);
  };

  const handlePointerCancel = () => {
    dragRef.current = null;
    setGhost(null);
  };

  return (
    <>
      <div
        className="relative h-16 w-24 shrink-0 no-select"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerCancel}
        role="button"
        aria-label={`Aura restante: ${remaining}`}
      >
        {/* esferas menores atrás */}
        {remaining >= 3 && (
          <div className="aura-sphere absolute bottom-9 right-16 h-[20px] w-[20px] opacity-90" />
        )}
        {remaining >= 2 && (
          <div className="aura-sphere absolute bottom-10 right-9 h-[28px] w-[28px] opacity-95" />
        )}

        {/* esfera principal */}
        {remaining >= 1 ? (
          <div
            className={`aura-sphere aura-float absolute bottom-0 right-1 h-12 w-12 transition ${
              carrying ? "aura-glow scale-110" : ""
            } ${ghost ? "opacity-30" : ""}`}
          />
        ) : (
          <div className="absolute bottom-0 right-1 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 text-sm font-black text-zinc-300">
            0
          </div>
        )}

        <span className="absolute -bottom-4 right-1 w-12 text-center text-[9px] font-black uppercase tracking-widest text-zinc-400">
          ×{remaining}
        </span>
      </div>

      {/* esfera fantasma seguindo o dedo durante o arrasto */}
      {ghost && (
        <div
          className="aura-sphere aura-glow pointer-events-none fixed z-[60] h-9 w-9"
          style={{
            left: ghost.x,
            top: ghost.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
}
