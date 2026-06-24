// One rural location per state (49 states: lower 48 + Alaska)
// Percentages calibrated for usa-map-hires.png via:
// x = 15 + (124.7 - |lng|) / 57.7 * 72, y = 6 + (49 - lat) / 24 * 64

export interface CityLocation {
  x: number;
  y: number;
  label: string;
}

export const cityLocations: CityLocation[] = [
  { x: 61.0, y: 49.9, label: "Demopolis, AL" },
  { x: 31.7, y: 45.4, label: "Payson, AZ" },
  { x: 55.7, y: 41.0, label: "Mountain View, AR" },
  { x: 22.9, y: 37.0, label: "Bishop, CA" },
  { x: 38.3, y: 33.9, label: "Salida, CO" },
  { x: 79.3, y: 25.3, label: "Litchfield, CT" },
  { x: 76.5, y: 32.9, label: "Milford, DE" },
  { x: 68.1, y: 58.8, label: "Ocala, FL" },
  { x: 65.8, y: 44.6, label: "Dahlonega, GA" },
  { x: 28.5, y: 16.2, label: "Salmon, ID" },
  { x: 60.6, y: 31.3, label: "Charleston, IL" },
  { x: 62.7, y: 33.0, label: "Bedford, IN" },
  { x: 56.1, y: 21.2, label: "Decorah, IA" },
  { x: 46.7, y: 33.0, label: "Hays, KS" },
  { x: 65.0, y: 37.8, label: "Somerset, KY" },
  { x: 54.4, y: 52.0, label: "Natchitoches, LA" },
  { x: 84.8, y: 17.2, label: "Bangor, ME" },
  { x: 72.3, y: 30.9, label: "Cumberland, MD" },
  { x: 80.0, y: 23.1, label: "Greenfield, MA" },
  { x: 64.0, y: 18.7, label: "Cadillac, MI" },
  { x: 53.1, y: 13.0, label: "Brainerd, MN" },
  { x: 58.9, y: 45.0, label: "Oxford, MS" },
  { x: 56.1, y: 35.5, label: "Rolla, MO" },
  { x: 32.0, y: 14.9, label: "Bozeman, MT" },
  { x: 44.9, y: 27.0, label: "North Platte, NE" },
  { x: 26.2, y: 27.8, label: "Elko, NV" },
  { x: 81.9, y: 19.4, label: "Conway, NH" },
  { x: 77.2, y: 28.6, label: "Flemington, NJ" },
  { x: 38.9, y: 39.6, label: "Taos, NM" },
  { x: 75.1, y: 23.5, label: "Ithaca, NY" },
  { x: 68.7, y: 40.1, label: "Boone, NC" },
  { x: 44.2, y: 8.1, label: "Minot, ND" },
  { x: 68.2, y: 31.8, label: "Athens, OH" },
  { x: 49.5, y: 40.3, label: "Stillwater, OK" },
  { x: 19.2, y: 19.2, label: "Bend, OR" },
  { x: 73.4, y: 27.9, label: "State College, PA" },
  { x: 81.0, y: 26.3, label: "Westerly, RI" },
  { x: 68.6, y: 47.2, label: "Aiken, SC" },
  { x: 45.4, y: 18.3, label: "Pierre, SD" },
  { x: 63.9, y: 40.2, label: "Cookeville, TN" },
  { x: 47.2, y: 55.9, label: "Fredericksburg, TX" },
  { x: 33.9, y: 33.8, label: "Moab, UT" },
  { x: 80.0, y: 18.6, label: "Montpelier, VT" },
  { x: 70.3, y: 37.4, label: "Blacksburg, VA" },
  { x: 20.2, y: 11.3, label: "Ellensburg, WA" },
  { x: 70.2, y: 35.9, label: "Lewisburg, WV" },
  { x: 56.4, y: 17.2, label: "Eau Claire, WI" },
  { x: 37.1, y: 17.2, label: "Sheridan, WY" },
  { x: 11.0, y: 82.0, label: "Wasilla, AK" },
];
