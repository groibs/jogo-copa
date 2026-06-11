"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  advanceMatchState,
  createInitialMatchState,
  generateBotLineup,
  generatePack,
  updateCardAttributes,
  type AttackSide,
  type AuraAllocation,
  type Lineup,
  type MatchState,
  type PlayerAttributes,
  type PlayerCard,
} from "@/lib/game-engine";

// ===========================================================================
// Estado global do jogo (Zustand + localStorage)
// Persistimos: pack atual, seleção/cartas customizadas e estado da partida.
// ===========================================================================

export interface PickedIds {
  atk: string | null;
  zags: string[]; // [zagLeft, zagRight] na ordem de seleção
  gol: string | null;
}

const EMPTY_PICKED: PickedIds = { atk: null, zags: [], gol: null };

interface GameStore {
  pack: PlayerCard[] | null;
  picked: PickedIds;
  match: MatchState | null;

  startNewRun: () => void;
  openBooster: () => void;
  togglePick: (cardId: string) => void;
  saveAttributes: (cardId: string, changes: PlayerAttributes) => void;
  confirmLineup: () => boolean;
  playLance: (input: { aura: AuraAllocation; side: AttackSide | null }) => void;
  resetAll: () => void;
}

function isLineupComplete(picked: PickedIds): boolean {
  return Boolean(picked.atk && picked.gol && picked.zags.length === 2);
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      pack: null,
      picked: EMPTY_PICKED,
      match: null,

      startNewRun: () => set({ pack: null, picked: EMPTY_PICKED, match: null }),

      openBooster: () => {
        const seed = Date.now() % 2147483647;
        set({ pack: generatePack(seed), picked: EMPTY_PICKED, match: null });
      },

      togglePick: (cardId) => {
        const { pack, picked } = get();
        const card = pack?.find((c) => c.id === cardId);
        if (!card) return;

        const next: PickedIds = {
          atk: picked.atk,
          zags: [...picked.zags],
          gol: picked.gol,
        };

        if (card.position === "ATK") {
          next.atk = picked.atk === cardId ? null : picked.atk ? picked.atk : cardId;
        } else if (card.position === "GOL") {
          next.gol = picked.gol === cardId ? null : picked.gol ? picked.gol : cardId;
        } else {
          if (next.zags.includes(cardId)) {
            next.zags = next.zags.filter((id) => id !== cardId);
          } else if (next.zags.length < 2) {
            next.zags.push(cardId);
          }
        }
        set({ picked: next });
      },

      saveAttributes: (cardId, changes) => {
        const { pack } = get();
        if (!pack) return;
        set({
          pack: pack.map((card) =>
            card.id === cardId ? updateCardAttributes(card, changes) : card
          ),
        });
      },

      confirmLineup: () => {
        const { pack, picked } = get();
        if (!pack || !isLineupComplete(picked)) return false;

        const byId = (id: string | null) => pack.find((c) => c.id === id);
        const atk = byId(picked.atk);
        const zagLeft = byId(picked.zags[0]);
        const zagRight = byId(picked.zags[1]);
        const gol = byId(picked.gol);
        if (!atk || !zagLeft || !zagRight || !gol) return false;

        const playerLineup: Lineup = { atk, zagLeft, zagRight, gol };
        const botLineup = generateBotLineup((Date.now() + 31) % 2147483647);
        const match = createInitialMatchState({
          playerLineup,
          botLineup,
          seed: (Date.now() + 97) % 2147483647,
        });
        set({ match });
        return true;
      },

      playLance: ({ aura, side }) => {
        const { match } = get();
        if (!match || match.finished) return;
        if (match.possession === "player" && !side) return;
        set({
          match: advanceMatchState({
            state: match,
            playerAura: aura,
            playerSide: side ?? undefined,
          }),
        });
      },

      resetAll: () => set({ pack: null, picked: EMPTY_PICKED, match: null }),
    }),
    {
      name: "egol-aura-v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage
      ),
    }
  )
);

const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

export { isLineupComplete };
