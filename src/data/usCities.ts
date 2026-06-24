// One rural town per state (49 states: lower 48 + Alaska).
// Coordinates are percentages of the USA map image (usa-map-hires.webp),
// hand-calibrated against the actual map silhouette so every dot lands on land
// inside its state.

export interface CityLocation {
  x: number;
  y: number;
  label: string;
}

export const cityLocations: CityLocation[] = [
  // West
  { x: 22, y: 14, label: "Ellensburg, WA" },
  { x: 20, y: 22, label: "Bend, OR" },
  { x: 22, y: 44, label: "Bishop, CA" },
  { x: 22, y: 33, label: "Elko, NV" },
  { x: 28, y: 22, label: "Salmon, ID" },
  { x: 32, y: 18, label: "Bozeman, MT" },
  { x: 36, y: 24, label: "Sheridan, WY" },
  { x: 32, y: 38, label: "Moab, UT" },
  { x: 30, y: 53, label: "Payson, AZ" },
  { x: 38, y: 48, label: "Taos, NM" },
  { x: 38, y: 40, label: "Salida, CO" },

  // Plains
  { x: 45, y: 14, label: "Minot, ND" },
  { x: 46, y: 22, label: "Pierre, SD" },
  { x: 47, y: 29, label: "North Platte, NE" },
  { x: 48, y: 37, label: "Hays, KS" },
  { x: 52, y: 50, label: "Stillwater, OK" },
  { x: 51, y: 73, label: "Fredericksburg, TX" },

  // Upper Midwest
  { x: 55, y: 18, label: "Brainerd, MN" },
  { x: 58, y: 28, label: "Decorah, IA" },
  { x: 60, y: 22, label: "Eau Claire, WI" },
  { x: 58, y: 40, label: "Rolla, MO" },
  { x: 60, y: 50, label: "Mountain View, AR" },
  { x: 57, y: 73, label: "Natchitoches, LA" },

  // Great Lakes / Midwest
  { x: 69, y: 24, label: "Cadillac, MI" },
  { x: 64, y: 36, label: "Charleston, IL" },
  { x: 68, y: 38, label: "Bedford, IN" },
  { x: 73, y: 36, label: "Athens, OH" },
  { x: 71, y: 43, label: "Somerset, KY" },
  { x: 69, y: 48, label: "Cookeville, TN" },

  // Deep South
  { x: 65, y: 58, label: "Oxford, MS" },
  { x: 69, y: 60, label: "Demopolis, AL" },
  { x: 74, y: 58, label: "Dahlonega, GA" },
  { x: 76, y: 72, label: "Ocala, FL" },

  // Mid-Atlantic / Appalachia
  { x: 74, y: 55, label: "Aiken, SC" },
  { x: 75, y: 49, label: "Boone, NC" },
  { x: 77, y: 43, label: "Blacksburg, VA" },
  { x: 76, y: 40, label: "Lewisburg, WV" },
  { x: 80, y: 33, label: "State College, PA" },
  { x: 79, y: 36, label: "Cumberland, MD" },
  { x: 84, y: 36, label: "Milford, DE" },
  { x: 84, y: 33, label: "Flemington, NJ" },

  // Northeast
  { x: 82, y: 28, label: "Ithaca, NY" },
  { x: 86, y: 29, label: "Litchfield, CT" },
  { x: 88, y: 28, label: "Westerly, RI" },
  { x: 87, y: 27, label: "Greenfield, MA" },
  { x: 86, y: 22, label: "Montpelier, VT" },
  { x: 88, y: 24, label: "Conway, NH" },
  { x: 91, y: 16, label: "Bangor, ME" },

  // Alaska
  { x: 15, y: 78, label: "Wasilla, AK" },
];
