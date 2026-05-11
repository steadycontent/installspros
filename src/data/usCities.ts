// Cities across 49 US states (excluding North Dakota) with percentage-based map coordinates
// Calibrated for the USA silhouette map image (usa-map-hires.png)
// Continental US formula: x = 15 + (124.7 - |lng|) / 57.7 * 72, y = 6 + (49 - lat) / 24 * 64

export interface CityLocation {
  x: number;
  y: number;
  label: string;
}

export const cityLocations: CityLocation[] = [
  // Major metros
  { x: 78.3, y: 28.1, label: "New York" },
  { x: 23.1, y: 45.9, label: "Los Angeles" },
  { x: 61.3, y: 25.0, label: "Chicago" },
  { x: 51.6, y: 57.3, label: "Houston" },
  { x: 30.8, y: 47.5, label: "Phoenix" },
  { x: 76.8, y: 30.1, label: "Philadelphia" },
  { x: 47.7, y: 58.2, label: "San Antonio" },
  { x: 24.4, y: 49.4, label: "San Diego" },
  { x: 49.8, y: 49.3, label: "Dallas" },
  { x: 18.5, y: 37.1, label: "San Jose" },

  // More large cities
  { x: 48.6, y: 56.0, label: "Austin" },
  { x: 68.7, y: 55.8, label: "Jacksonville" },
  { x: 67.0, y: 30.1, label: "Columbus" },
  { x: 63.1, y: 30.6, label: "Indianapolis" },
  { x: 69.7, y: 42.7, label: "Charlotte" },
  { x: 17.8, y: 35.9, label: "San Francisco" },
  { x: 18.0, y: 9.7, label: "Seattle" },
  { x: 39.6, y: 30.7, label: "Denver" },
  { x: 74.5, y: 32.9, label: "Washington DC" },

  // Mid-size cities
  { x: 62.3, y: 40.2, label: "Nashville" },
  { x: 48.9, y: 42.1, label: "Oklahoma City" },
  { x: 37.7, y: 52.0, label: "El Paso" },
  { x: 82.0, y: 23.7, label: "Boston" },
  { x: 17.5, y: 15.3, label: "Portland" },
  { x: 26.9, y: 40.2, label: "Las Vegas" },
  { x: 58.2, y: 42.9, label: "Memphis" },
  { x: 63.6, y: 34.7, label: "Louisville" },
  { x: 75.0, y: 31.9, label: "Baltimore" },
  { x: 60.9, y: 21.9, label: "Milwaukee" },

  { x: 37.5, y: 43.1, label: "Albuquerque" },
  { x: 32.1, y: 50.7, label: "Tucson" },
  { x: 21.1, y: 38.7, label: "Fresno" },
  { x: 19.0, y: 33.8, label: "Sacramento" },
  { x: 65.3, y: 46.7, label: "Atlanta" },
  { x: 52.6, y: 32.4, label: "Kansas City" },
  { x: 50.9, y: 26.6, label: "Omaha" },
  { x: 39.8, y: 33.1, label: "Colorado Springs" },
  { x: 72.5, y: 41.3, label: "Raleigh" },
  { x: 75.8, y: 38.4, label: "Virginia Beach" },

  { x: 70.6, y: 68.0, label: "Miami" },
  { x: 54.2, y: 16.7, label: "Minneapolis" },
  { x: 67.7, y: 62.1, label: "Tampa" },
  { x: 50.8, y: 40.3, label: "Tulsa" },
  { x: 58.2, y: 56.8, label: "New Orleans" },
  { x: 49.2, y: 36.2, label: "Wichita" },
  { x: 68.6, y: 26.0, label: "Cleveland" },
  { x: 28.0, y: 82.0, label: "Honolulu" },

  { x: 65.2, y: 35.3, label: "Lexington" },
  { x: 65.1, y: 32.4, label: "Cincinnati" },
  { x: 70.7, y: 28.8, label: "Pittsburgh" },
  { x: 71.0, y: 40.5, label: "Greensboro" },
  { x: 12.0, y: 80.0, label: "Anchorage" },
  { x: 49.9, y: 27.8, label: "Lincoln" },
  { x: 69.1, y: 60.6, label: "Orlando" },

  { x: 58.0, y: 33.7, label: "St. Louis" },
  { x: 67.0, y: 23.8, label: "Detroit" },
  { x: 72.2, y: 22.3, label: "Buffalo" },
  { x: 25.6, y: 20.4, label: "Boise" },
  { x: 21.1, y: 31.3, label: "Reno" },
  { x: 59.0, y: 21.8, label: "Madison" },
  { x: 24.1, y: 9.6, label: "Spokane" },
  { x: 56.8, y: 55.5, label: "Baton Rouge" },
  { x: 74.0, y: 36.6, label: "Richmond" },

  // Additional cities for missing state coverage (49 states, no North Dakota)
  { x: 62.3, y: 47.3, label: "Birmingham" },       // Alabama
  { x: 55.4, y: 44.0, label: "Little Rock" },       // Arkansas
  { x: 79.9, y: 25.3, label: "Hartford" },          // Connecticut
  { x: 76.3, y: 30.7, label: "Wilmington" },        // Delaware
  { x: 53.8, y: 25.8, label: "Des Moines" },        // Iowa
  { x: 83.0, y: 20.2, label: "Portland, ME" },      // Maine
  { x: 58.1, y: 50.5, label: "Jackson" },           // Mississippi
  { x: 35.2, y: 14.6, label: "Billings" },          // Montana
  { x: 81.4, y: 22.0, label: "Manchester" },        // New Hampshire
  { x: 78.0, y: 28.0, label: "Newark" },            // New Jersey
  { x: 70.8, y: 49.3, label: "Charleston, SC" },    // South Carolina
  { x: 49.9, y: 20.5, label: "Sioux Falls" },       // South Dakota
  { x: 31.0, y: 28.0, label: "Salt Lake City" },    // Utah
  { x: 79.2, y: 18.1, label: "Burlington" },        // Vermont
  { x: 68.7, y: 34.4, label: "Charleston, WV" },    // West Virginia
  { x: 39.8, y: 27.0, label: "Cheyenne" },          // Wyoming
  { x: 81.5, y: 25.1, label: "Providence" },        // Rhode Island
];
