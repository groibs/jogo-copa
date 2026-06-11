"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Evita mismatch de hidratação: retorna false no servidor/primeiro paint
 * e true no cliente, sem disparar renders em cascata.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
