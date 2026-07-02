// Fitment matching between products.compatible_cars strings and a garage car.
//
// Fitment strings are human-readable (they render as chips in the mobile app),
// e.g. "BMW 3 Series (E46) 1998-2006", "Subaru WRX/STI", "Universal".
// Matching is: make token present + any model keyword present (as whole
// tokens) + year-range containment when both sides carry years.

import { MAKE_ALIASES, findModel } from "./vehicles";

export interface GarageCar {
  id: string;
  make: string;
  model: string;
  year: number | null;
  nickname: string | null;
}

export type FitmentStatus =
  | "confirmed"   // at least one fitment string matches the car
  | "universal"   // part is universal-fit
  | "no_match"    // has fitment data, none of it matches the car
  | "na";         // no fitment data (apparel etc.)

function normalize(s: string): string[] {
  return s
    .toUpperCase()
    .replace(/[\/\-–().,+]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** True if `phrase` tokens appear as a contiguous subsequence of `tokens`. */
function hasPhrase(tokens: string[], phrase: string): boolean {
  const p = normalize(phrase);
  if (p.length === 0) return false;
  outer: for (let i = 0; i <= tokens.length - p.length; i++) {
    for (let j = 0; j < p.length; j++) {
      if (tokens[i + j] !== p[j]) continue outer;
    }
    return true;
  }
  return false;
}

function extractYearRange(tokens: string[]): [number, number] | null {
  const years = tokens.filter(t => /^(19|20)\d{2}$/.test(t)).map(Number);
  if (years.length === 0) return null;
  return [Math.min(...years), Math.max(...years)];
}

function stringMatchesCar(fitment: string, car: GarageCar): boolean {
  const tokens = normalize(fitment);

  const makeAliases = MAKE_ALIASES[car.make] ?? [car.make.toUpperCase()];
  if (!makeAliases.some(a => hasPhrase(tokens, a))) return false;

  const model = findModel(car.make, car.model);
  const keywords = model?.keywords ?? normalize(car.model);
  if (!keywords.some(k => hasPhrase(tokens, k))) return false;

  const range = extractYearRange(tokens);
  if (range && car.year != null && (car.year < range[0] || car.year > range[1])) return false;

  return true;
}

export function getFitmentStatus(compatibleCars: string[] | null | undefined, car: GarageCar | null): FitmentStatus {
  if (!compatibleCars || compatibleCars.length === 0) return "na";
  if (compatibleCars.some(c => c.trim().toUpperCase().startsWith("UNIVERSAL"))) return "universal";
  if (!car) return "no_match";
  return compatibleCars.some(c => stringMatchesCar(c, car)) ? "confirmed" : "no_match";
}

/** Short display label for a car, e.g. "350Z '05" or the nickname. */
export function carLabel(car: GarageCar): string {
  if (car.nickname) return car.nickname;
  const shortModel = car.model.replace(/\s*\(.*\)$/, "");
  return car.year ? `${shortModel} '${String(car.year).slice(2)}` : shortModel;
}
