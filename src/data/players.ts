import type { PlayerCard } from "../lib/game-engine/types";

// ===========================================================================
// 🗿 ÉGOL+AURA — Pool de jogadores (protótipo)
//
// Nomes reais usados APENAS como referência de protótipo.
// Sem fotos, sem escudos, sem logos de clubes.
// Para trocar por nomes fictícios depois, basta editar o campo `name`.
//
// Regras:
// - baseScore ∈ {60, 70, 80, 90, 100} (arredondado a partir do referenceOverall)
// - soma dos 2 atributos === baseScore
// - rarity: 100 = lendário | 90 = épico | 80 = raro | 70/60 = comum
// - colorTheme: lendário = gold | épico = purple | raro = blue | comum = green
// ===========================================================================

export const PLAYER_POOL: PlayerCard[] = [
  // ------------------------------------------------------------- ATACANTES
  { id: "atk-mbappe", name: "Kylian Mbappé", position: "ATK", referenceOverall: 91, baseScore: 100, attributes: { drible: 50, chute: 50 }, rarity: "lendario", colorTheme: "gold" },
  { id: "atk-haaland", name: "Erling Haaland", position: "ATK", referenceOverall: 91, baseScore: 100, attributes: { drible: 40, chute: 60 }, rarity: "lendario", colorTheme: "gold" },
  { id: "atk-vinicius", name: "Vinícius Jr.", position: "ATK", referenceOverall: 90, baseScore: 100, attributes: { drible: 60, chute: 40 }, rarity: "lendario", colorTheme: "gold" },
  { id: "atk-salah", name: "Mohamed Salah", position: "ATK", referenceOverall: 89, baseScore: 90, attributes: { drible: 50, chute: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-kane", name: "Harry Kane", position: "ATK", referenceOverall: 89, baseScore: 90, attributes: { drible: 30, chute: 60 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-dembele", name: "Ousmane Dembélé", position: "ATK", referenceOverall: 90, baseScore: 100, attributes: { drible: 60, chute: 40 }, rarity: "lendario", colorTheme: "gold" },
  { id: "atk-messi", name: "Lionel Messi", position: "ATK", referenceOverall: 88, baseScore: 90, attributes: { drible: 60, chute: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-lewandowski", name: "Robert Lewandowski", position: "ATK", referenceOverall: 88, baseScore: 90, attributes: { drible: 30, chute: 60 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-griezmann", name: "Antoine Griezmann", position: "ATK", referenceOverall: 88, baseScore: 90, attributes: { drible: 50, chute: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-lautaro", name: "Lautaro Martínez", position: "ATK", referenceOverall: 88, baseScore: 90, attributes: { drible: 40, chute: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-neymar", name: "Neymar Jr.", position: "ATK", referenceOverall: 87, baseScore: 90, attributes: { drible: 60, chute: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-son", name: "Son Heung-min", position: "ATK", referenceOverall: 87, baseScore: 90, attributes: { drible: 40, chute: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-saka", name: "Bukayo Saka", position: "ATK", referenceOverall: 87, baseScore: 90, attributes: { drible: 50, chute: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-foden", name: "Phil Foden", position: "ATK", referenceOverall: 87, baseScore: 90, attributes: { drible: 60, chute: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-rodrygo", name: "Rodrygo", position: "ATK", referenceOverall: 86, baseScore: 90, attributes: { drible: 50, chute: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-leao", name: "Rafael Leão", position: "ATK", referenceOverall: 86, baseScore: 90, attributes: { drible: 60, chute: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-osimhen", name: "Victor Osimhen", position: "ATK", referenceOverall: 86, baseScore: 90, attributes: { drible: 40, chute: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-alvarez", name: "Julián Álvarez", position: "ATK", referenceOverall: 85, baseScore: 90, attributes: { drible: 40, chute: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-ronaldo", name: "Cristiano Ronaldo", position: "ATK", referenceOverall: 85, baseScore: 90, attributes: { drible: 30, chute: 60 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-dybala", name: "Paulo Dybala", position: "ATK", referenceOverall: 85, baseScore: 90, attributes: { drible: 50, chute: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-martinelli", name: "Gabriel Martinelli", position: "ATK", referenceOverall: 84, baseScore: 90, attributes: { drible: 50, chute: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-gjesus", name: "Gabriel Jesus", position: "ATK", referenceOverall: 83, baseScore: 80, attributes: { drible: 40, chute: 40 }, rarity: "raro", colorTheme: "blue" },
  { id: "atk-raphinha", name: "Raphinha", position: "ATK", referenceOverall: 84, baseScore: 90, attributes: { drible: 50, chute: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "atk-richarlison", name: "Richarlison", position: "ATK", referenceOverall: 81, baseScore: 80, attributes: { drible: 30, chute: 50 }, rarity: "raro", colorTheme: "blue" },

  // ------------------------------------------------------------- ZAGUEIROS
  { id: "zag-vandijk", name: "Virgil van Dijk", position: "ZAG", referenceOverall: 90, baseScore: 100, attributes: { desarme: 60, passe: 40 }, rarity: "lendario", colorTheme: "gold" },
  { id: "zag-dias", name: "Rúben Dias", position: "ZAG", referenceOverall: 88, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-rudiger", name: "Antonio Rüdiger", position: "ZAG", referenceOverall: 88, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-saliba", name: "William Saliba", position: "ZAG", referenceOverall: 87, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-bastoni", name: "Alessandro Bastoni", position: "ZAG", referenceOverall: 87, baseScore: 90, attributes: { desarme: 50, passe: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-marquinhos", name: "Marquinhos", position: "ZAG", referenceOverall: 87, baseScore: 90, attributes: { desarme: 50, passe: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-gabriel", name: "Gabriel Magalhães", position: "ZAG", referenceOverall: 86, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-araujo", name: "Ronald Araújo", position: "ZAG", referenceOverall: 86, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-militao", name: "Éder Militão", position: "ZAG", referenceOverall: 86, baseScore: 90, attributes: { desarme: 50, passe: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-kounde", name: "Jules Koundé", position: "ZAG", referenceOverall: 85, baseScore: 90, attributes: { desarme: 50, passe: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-deligt", name: "Matthijs de Ligt", position: "ZAG", referenceOverall: 85, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-stones", name: "John Stones", position: "ZAG", referenceOverall: 85, baseScore: 90, attributes: { desarme: 40, passe: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-romero", name: "Cristian Romero", position: "ZAG", referenceOverall: 85, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-theo", name: "Theo Hernández", position: "ZAG", referenceOverall: 85, baseScore: 90, attributes: { desarme: 40, passe: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-hakimi", name: "Achraf Hakimi", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 40, passe: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-cancelo", name: "João Cancelo", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 30, passe: 60 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-robertson", name: "Andrew Robertson", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 40, passe: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-trent", name: "Trent Alexander-Arnold", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 30, passe: 60 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-walker", name: "Kyle Walker", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 50, passe: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-upamecano", name: "Dayot Upamecano", position: "ZAG", referenceOverall: 83, baseScore: 80, attributes: { desarme: 50, passe: 30 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-kim", name: "Kim Min-jae", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-alaba", name: "David Alaba", position: "ZAG", referenceOverall: 83, baseScore: 80, attributes: { desarme: 40, passe: 40 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-lisandro", name: "Lisandro Martínez", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 50, passe: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-lucas", name: "Lucas Hernández", position: "ZAG", referenceOverall: 83, baseScore: 80, attributes: { desarme: 50, passe: 30 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-ake", name: "Nathan Aké", position: "ZAG", referenceOverall: 82, baseScore: 80, attributes: { desarme: 40, passe: 40 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-bremer", name: "Bremer", position: "ZAG", referenceOverall: 84, baseScore: 90, attributes: { desarme: 60, passe: 30 }, rarity: "epico", colorTheme: "purple" },
  { id: "zag-danilo", name: "Danilo", position: "ZAG", referenceOverall: 81, baseScore: 80, attributes: { desarme: 40, passe: 40 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-thiagosilva", name: "Thiago Silva", position: "ZAG", referenceOverall: 83, baseScore: 80, attributes: { desarme: 50, passe: 30 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-otamendi", name: "Nicolás Otamendi", position: "ZAG", referenceOverall: 81, baseScore: 80, attributes: { desarme: 50, passe: 30 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-konate", name: "Ibrahima Konaté", position: "ZAG", referenceOverall: 82, baseScore: 80, attributes: { desarme: 50, passe: 30 }, rarity: "raro", colorTheme: "blue" },
  { id: "zag-benwhite", name: "Ben White", position: "ZAG", referenceOverall: 80, baseScore: 80, attributes: { desarme: 40, passe: 40 }, rarity: "raro", colorTheme: "blue" },

  // --------------------------------------------------------------- GOLEIROS
  { id: "gol-courtois", name: "Thibaut Courtois", position: "GOL", referenceOverall: 90, baseScore: 100, attributes: { reflexo: 50, defesa: 50 }, rarity: "lendario", colorTheme: "gold" },
  { id: "gol-alisson", name: "Alisson Becker", position: "GOL", referenceOverall: 89, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-ederson", name: "Ederson", position: "GOL", referenceOverall: 88, baseScore: 90, attributes: { reflexo: 40, defesa: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-terstegen", name: "Marc-André ter Stegen", position: "GOL", referenceOverall: 89, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-oblak", name: "Jan Oblak", position: "GOL", referenceOverall: 88, baseScore: 90, attributes: { reflexo: 40, defesa: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-maignan", name: "Mike Maignan", position: "GOL", referenceOverall: 87, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-donnarumma", name: "Gianluigi Donnarumma", position: "GOL", referenceOverall: 87, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-kobel", name: "Gregor Kobel", position: "GOL", referenceOverall: 87, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-emiliano", name: "Emiliano Martínez", position: "GOL", referenceOverall: 85, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-neuer", name: "Manuel Neuer", position: "GOL", referenceOverall: 86, baseScore: 90, attributes: { reflexo: 40, defesa: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-sommer", name: "Yann Sommer", position: "GOL", referenceOverall: 84, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-diogocosta", name: "Diogo Costa", position: "GOL", referenceOverall: 84, baseScore: 90, attributes: { reflexo: 50, defesa: 40 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-szczesny", name: "Wojciech Szczęsny", position: "GOL", referenceOverall: 84, baseScore: 90, attributes: { reflexo: 40, defesa: 50 }, rarity: "epico", colorTheme: "purple" },
  { id: "gol-unaisimon", name: "Unai Simón", position: "GOL", referenceOverall: 83, baseScore: 80, attributes: { reflexo: 40, defesa: 40 }, rarity: "raro", colorTheme: "blue" },
  { id: "gol-pickford", name: "Jordan Pickford", position: "GOL", referenceOverall: 83, baseScore: 80, attributes: { reflexo: 40, defesa: 40 }, rarity: "raro", colorTheme: "blue" },
];
