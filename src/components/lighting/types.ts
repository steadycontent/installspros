export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  zip?: string | null;
}

export interface PlaceDetails {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface LightSegment {
  id: string;
  x1: number; // percentage 0-1
  y1: number;
  x2: number;
  y2: number;
}

export interface LightConfig {
  segments: LightSegment[];
  spacingInches: number;
  colorPreset: string;
}

export interface PropertyData {
  squareFootage: number | null;
  stories: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
}

export interface LightingLeadData {
  address: AddressData;
  photoUrls: string[];
  lightConfig: LightConfig;
  propertyData: PropertyData | null;
  estimatedLinearFeet: number;
  estimatedRangeLow: number;
  estimatedRangeHigh: number;
  name: string;
  email: string;
  phone: string;
  preferredTimeframe: string;
  wantsNighttimeRender: boolean;
  wantsStarlinkBundle: boolean;
}

export type DesignStep = 1 | 2 | 3 | 4 | 5 | 6;

export const HOLIDAY_PRESETS: { id: string; label: string; emoji: string; colors: string[] }[] = [
  { id: "warm-white", label: "Warm White", emoji: "💡", colors: ["#fef3c7", "#fde68a", "#fcd34d"] },
  { id: "4th-of-july", label: "4th of July", emoji: "🇺🇸", colors: ["#ef4444", "#ffffff", "#3b82f6"] },
  { id: "valentines", label: "Valentine's", emoji: "❤️", colors: ["#ef4444", "#ec4899", "#f472b6"] },
  { id: "thanksgiving", label: "Thanksgiving", emoji: "🦃", colors: ["#f59e0b", "#d97706", "#92400e"] },
  { id: "st-patricks", label: "St. Patrick's", emoji: "🍀", colors: ["#22c55e", "#16a34a", "#15803d"] },
  { id: "new-years", label: "New Year's", emoji: "🎆", colors: ["#fbbf24", "#e5e7eb", "#d4d4d8"] },
];

// Placeholder pricing — user will provide exact rates
export const PRICING = {
  basePerFoot: 22,         // $/linear foot
  storyMultiplier: {       // multiplier by story count
    1: 1.0,
    2: 1.15,
    3: 1.35,
  } as Record<number, number>,
  complexityFactor: 1.0,   // adjusted by sqft proxy
  variancePercent: 0.20,   // +/- 20%
};
