// Curated vehicle catalog for the garage/fitment selector.
// Only vehicles the shop actually stocks parts for. Keywords are matched
// as token sequences against products.compatible_cars strings (see matching.ts).

export interface VehicleModel {
  id: string;
  make: string;
  name: string;           // display name, e.g. "3 Series (E46)"
  years: [number, number];
  keywords: string[];     // any hit (as whole tokens) counts as a model match
}

export const VEHICLE_CATALOG: VehicleModel[] = [
  // ── BMW ──
  { id: "bmw-e30",      make: "BMW", name: "3 Series (E30)",      years: [1982, 1994], keywords: ["E30"] },
  { id: "bmw-e36",      make: "BMW", name: "3 Series (E36)",      years: [1991, 1999], keywords: ["E36"] },
  { id: "bmw-z3",       make: "BMW", name: "Z3",                  years: [1996, 2002], keywords: ["Z3"] },
  { id: "bmw-e46",      make: "BMW", name: "3 Series (E46)",      years: [1998, 2006], keywords: ["E46"] },
  { id: "bmw-e9x",      make: "BMW", name: "3 Series (E90-E93)",  years: [2005, 2013], keywords: ["E90", "E91", "E92", "E93", "335i", "328i", "330i"] },
  { id: "bmw-m3-e9x",   make: "BMW", name: "M3 (E90/E92/E93)",    years: [2007, 2013], keywords: ["M3", "E90", "E92", "E93"] },
  { id: "bmw-135i",     make: "BMW", name: "1 Series (E82/E88)",  years: [2007, 2013], keywords: ["135i", "E82", "E88"] },
  { id: "bmw-f2x",      make: "BMW", name: "M135i/M235i (F20/F22)", years: [2012, 2016], keywords: ["M135i", "M235i", "F20", "F22"] },
  { id: "bmw-f3x",      make: "BMW", name: "3/4 Series (F30/F32)", years: [2012, 2019], keywords: ["F30", "F32", "328i", "330i", "335i", "435i", "N20"] },
  { id: "bmw-m2",       make: "BMW", name: "M2 (F87)",            years: [2016, 2020], keywords: ["M2"] },
  { id: "bmw-m3-f8x",   make: "BMW", name: "M3/M4 (F80/F82)",     years: [2014, 2019], keywords: ["M3", "M4", "S55", "F80", "F82"] },
  { id: "bmw-m5-m6",    make: "BMW", name: "M5/M6 (F10/F06)",     years: [2011, 2018], keywords: ["M5", "M6", "S63"] },
  { id: "bmw-x5-x6",    make: "BMW", name: "X5/X6 (F15/F16)",     years: [2013, 2019], keywords: ["X5", "X6", "N63"] },

  // ── Nissan ──
  { id: "nissan-350z",  make: "Nissan", name: "350Z",             years: [2003, 2008], keywords: ["350Z"] },
  { id: "nissan-370z",  make: "Nissan", name: "370Z",             years: [2009, 2020], keywords: ["370Z"] },
  { id: "nissan-r35",   make: "Nissan", name: "GT-R (R35)",       years: [2009, 2024], keywords: ["R35", "GTR", "GT R"] },
  { id: "nissan-s14",   make: "Nissan", name: "200SX/Silvia (S14)", years: [1995, 1999], keywords: ["S14", "200SX", "Silvia"] },

  // ── Infiniti ──
  { id: "infiniti-g35", make: "Infiniti", name: "G35",            years: [2003, 2008], keywords: ["G35"] },

  // ── Subaru ──
  { id: "subaru-gd",    make: "Subaru", name: "Impreza WRX/STI (GD)", years: [2001, 2007], keywords: ["WRX", "STI"] },
  { id: "subaru-gr",    make: "Subaru", name: "Impreza WRX/STI (GR/GV)", years: [2008, 2014], keywords: ["WRX", "STI"] },

  // ── Mitsubishi ──
  { id: "evo-6",        make: "Mitsubishi", name: "Lancer Evolution 6", years: [1999, 2001], keywords: ["6"] },
  { id: "evo-7",        make: "Mitsubishi", name: "Lancer Evolution 7", years: [2001, 2003], keywords: ["7"] },
  { id: "evo-8",        make: "Mitsubishi", name: "Lancer Evolution 8", years: [2003, 2005], keywords: ["8"] },
  { id: "evo-9",        make: "Mitsubishi", name: "Lancer Evolution 9", years: [2005, 2007], keywords: ["9"] },
  { id: "evo-x",        make: "Mitsubishi", name: "Lancer Evolution X", years: [2008, 2016], keywords: ["X"] },

  // ── Toyota ──
  { id: "toyota-supra",   make: "Toyota", name: "Supra (2JZ)",    years: [1993, 2002], keywords: ["Supra", "2JZ"] },
  { id: "toyota-chaser",  make: "Toyota", name: "Chaser (1JZ)",   years: [1992, 2001], keywords: ["Chaser", "1JZ"] },
  { id: "toyota-starlet", make: "Toyota", name: "Starlet (EP82/EP91)", years: [1989, 1999], keywords: ["Starlet", "EP82", "EP91"] },

  // ── Honda ──
  { id: "honda-civic",  make: "Honda", name: "Civic (EF/EG/EK)",  years: [1988, 2000], keywords: ["Civic"] },
  { id: "honda-s2000",  make: "Honda", name: "S2000",             years: [1999, 2009], keywords: ["S2000"] },

  // ── Volkswagen ──
  { id: "vw-mk4",       make: "VW", name: "Golf/Jetta MK4",       years: [1999, 2004], keywords: ["MK4", "Golf", "Jetta"] },
  { id: "vw-mk5",       make: "VW", name: "Golf GTI (MK5)",       years: [2006, 2009], keywords: ["MK5", "Golf", "TFSI"] },
  { id: "vw-mk6",       make: "VW", name: "Golf GTI (MK6)",       years: [2010, 2013], keywords: ["MK6", "Golf", "TFSI"] },
  { id: "vw-mk7",       make: "VW", name: "Golf GTI (MK7)",       years: [2013, 2020], keywords: ["MK7", "Golf", "TFSI"] },
  { id: "vw-jetta",     make: "VW", name: "Jetta",                years: [1999, 2018], keywords: ["Jetta"] },

  // ── Audi ──
  { id: "audi-a4",      make: "Audi", name: "A4/S4 (B6/B7)",      years: [2001, 2008], keywords: ["A4", "S4", "TFSI"] },
];

// Make aliases: a fitment string "counts" for a make if it contains any of these tokens.
export const MAKE_ALIASES: Record<string, string[]> = {
  BMW: ["BMW"],
  Nissan: ["NISSAN"],
  Infiniti: ["INFINITI"],
  Subaru: ["SUBARU"],
  Mitsubishi: ["MITSUBISHI"],
  Toyota: ["TOYOTA"],
  Honda: ["HONDA"],
  VW: ["VW", "VOLKSWAGEN"],
  Audi: ["AUDI"],
};

export const MAKES = Array.from(new Set(VEHICLE_CATALOG.map(v => v.make)));

export function modelsForMake(make: string): VehicleModel[] {
  return VEHICLE_CATALOG.filter(v => v.make === make);
}

export function findModel(make: string, name: string): VehicleModel | undefined {
  return VEHICLE_CATALOG.find(v => v.make === make && v.name === name);
}
