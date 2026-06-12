import rvParks from "@/assets/commercial/industry-rv-parks.jpg";
import campgrounds from "@/assets/commercial/industry-campgrounds.jpg";
import motorcoach from "@/assets/commercial/industry-motorcoach-resorts.jpg";
import marinas from "@/assets/commercial/industry-marinas.jpg";
import mobileHome from "@/assets/commercial/industry-mobile-home-parks.jpg";
import largeProps from "@/assets/commercial/industry-large-properties.jpg";

export type IndustrySlug =
  | "rv-parks"
  | "campgrounds"
  | "motorcoach-resorts"
  | "marinas"
  | "mobile-home-parks"
  | "large-properties";

export interface Industry {
  slug: IndustrySlug;
  label: string;
  shortLabel: string;
  image: string;
  tagline: string;
  headline: string;
  intro: string;
  painPoints: string[];
  challenges: string[];
  revenueImpact: string[];
  roiExample: { label: string; value: string }[];
  ctaLabel: string;
  seoTitle: string;
  seoDescription: string;
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "rv-parks",
    label: "RV Parks",
    shortLabel: "RV Parks",
    image: rvParks,
    tagline: "Property-wide WiFi that fills sites and lifts reviews.",
    headline: "Property-Wide WiFi for RV Parks",
    intro:
      "Guests pick their next stop on bandwidth. Deliver coverage to every site, every amenity, and the back forty — so you stop losing bookings to the park down the road.",
    painPoints: [
      "WiFi complaints dominate your reviews",
      "Remote workers leave after one bad day on Zoom",
      "Coverage drops past the office and pool",
      "Peak-season congestion crashes the network",
    ],
    challenges: [
      "Multi-acre coverage across trees and metal RVs",
      "Hundreds of devices per site at peak occupancy",
      "Rural ISPs that cap speed and uptime",
      "No on-site IT to babysit the network",
    ],
    revenueImpact: [
      "Higher nightly rates for premium connectivity tiers",
      "Longer average stays from monthly remote workers",
      "Better ratings on Campendium, Good Sam, and Google",
      "Fewer refunds and chargebacks tied to WiFi",
    ],
    roiExample: [
      { label: "Sites", value: "120" },
      { label: "Avg lift / month", value: "+$4,800" },
      { label: "Payback", value: "8–14 months" },
    ],
    ctaLabel: "Get Free RV Park Assessment",
    seoTitle: "RV Park WiFi & Starlink Installation | InstallPros",
    seoDescription:
      "Commercial WiFi and Starlink Business infrastructure for RV parks. Property-wide coverage that raises reviews, lengthens stays, and unlocks premium revenue.",
  },
  {
    slug: "campgrounds",
    label: "Campgrounds",
    shortLabel: "Campgrounds",
    image: campgrounds,
    tagline: "Connectivity through trees, terrain, and tent sites.",
    headline: "Campground Internet That Reaches Every Loop",
    intro:
      "Trees, hills, and gravel loops are not an excuse anymore. Engineered coverage with Starlink Business backhaul and outdoor mesh keeps every loop online.",
    painPoints: [
      "Office WiFi that dies past the bathhouse",
      "Tent sites with zero usable signal",
      "Camp store POS dropouts during peak hours",
      "Negative reviews citing connectivity",
    ],
    challenges: [
      "Dense tree canopy and elevation changes",
      "Long distances between amenities",
      "Seasonal traffic spikes",
      "Backhaul in rural service areas",
    ],
    revenueImpact: [
      "Higher repeat-visit rate",
      "Confidence to advertise WiFi as an amenity",
      "Unlocks remote-worker demographic",
      "Smoother camp-store and check-in operations",
    ],
    roiExample: [
      { label: "Loops covered", value: "6" },
      { label: "Review lift", value: "+0.4 stars" },
      { label: "Payback", value: "10–16 months" },
    ],
    ctaLabel: "Get Free Campground Assessment",
    seoTitle: "Campground Internet & WiFi Installation | InstallPros",
    seoDescription:
      "Outdoor commercial WiFi and Starlink Business for campgrounds. Loop-by-loop coverage engineered for trees, terrain, and peak-season traffic.",
  },
  {
    slug: "motorcoach-resorts",
    label: "Motorcoach Resorts",
    shortLabel: "Motorcoach",
    image: motorcoach,
    tagline: "Luxury connectivity for Class A motorcoach resorts.",
    headline: "Luxury Connectivity for Class A Motorcoach Resorts",
    intro:
      "Million-dollar coaches expect home-office bandwidth on day one. We design redundant networks worthy of the property — and the lot prices.",
    painPoints: [
      "Owners working remotely from their coach",
      "Smart-home hardware tied to the lot",
      "HOA pressure to match the property's price point",
      "Streaming demand on every coach",
    ],
    challenges: [
      "High device count per lot",
      "Property-value expectations",
      "Redundant uplinks for SLA-grade uptime",
      "Aesthetic-sensitive equipment placement",
    ],
    revenueImpact: [
      "Defends lot resale value",
      "Justifies premium HOA fees",
      "Reduces board complaints to zero",
      "Differentiates against neighboring resorts",
    ],
    roiExample: [
      { label: "Lots", value: "85" },
      { label: "Value defended / lot", value: "$15k+" },
      { label: "Payback", value: "Immediate (capex)" },
    ],
    ctaLabel: "Schedule Resort Connectivity Review",
    seoTitle: "Motorcoach Resort WiFi & Connectivity | InstallPros",
    seoDescription:
      "Enterprise-grade WiFi and Starlink Business for Class A motorcoach resorts. SLA-ready networks built for million-dollar coaches and high-value HOAs.",
  },
  {
    slug: "marinas",
    label: "Marinas",
    shortLabel: "Marinas",
    image: marinas,
    tagline: "Dock-to-dock WiFi that holds up in salt air.",
    headline: "Marina WiFi Built for Salt, Steel, and Slips",
    intro:
      "Cabin cruisers, liveaboards, and dockside diners all want reliable connectivity. Marine-rated APs and Starlink Business cover every slip without rusting out by season two.",
    painPoints: [
      "Slip WiFi that quits at the end of the pier",
      "Liveaboards canceling for connectivity",
      "Restaurant Wi-Fi crashing on Saturday nights",
      "Failed Wi-Fi at the fuel dock POS",
    ],
    challenges: [
      "Salt-air corrosion on consumer gear",
      "Steel hulls blocking signal",
      "Long, linear dock layouts",
      "Shoreline obstructions",
    ],
    revenueImpact: [
      "Higher slip occupancy",
      "Liveaboard retention",
      "Smoother restaurant and fuel-dock POS",
      "Premium for wired-tier slips",
    ],
    roiExample: [
      { label: "Slips", value: "180" },
      { label: "Annual retention", value: "+$22k" },
      { label: "Payback", value: "9–14 months" },
    ],
    ctaLabel: "Get Free Marina Assessment",
    seoTitle: "Marina WiFi & Starlink Installation | InstallPros",
    seoDescription:
      "Marine-grade WiFi and Starlink Business for marinas. Dock-to-dock coverage engineered for salt air, steel hulls, and liveaboard bandwidth demand.",
  },
  {
    slug: "mobile-home-parks",
    label: "Winery / Equestrian",
    shortLabel: "Winery / Equestrian",
    image: mobileHome,
    tagline: "Property-wide internet as a community amenity.",
    headline: "Internet Infrastructure for Mobile Home Communities",
    intro:
      "Turn connectivity into a managed amenity. Residents get reliable internet without contracting separately — and operators get a new revenue line and happier tenants.",
    painPoints: [
      "Residents paying premium prices to last-mile ISPs",
      "Spotty cell signal across the community",
      "Office IT pulled into resident complaints",
      "Aging copper infrastructure",
    ],
    challenges: [
      "Multi-block coverage at low cost-per-home",
      "Billing and tenant onboarding",
      "Resident-grade support",
      "Buried-conduit logistics",
    ],
    revenueImpact: [
      "Bundled internet as a monthly fee line",
      "Increased lot demand and renewal rate",
      "Reduced office support load",
      "Higher property valuation multiples",
    ],
    roiExample: [
      { label: "Homes", value: "200" },
      { label: "New monthly revenue", value: "+$6,000" },
      { label: "Payback", value: "12–18 months" },
    ],
    ctaLabel: "Get Free Community Assessment",
    seoTitle: "Mobile Home Park Internet & WiFi | InstallPros",
    seoDescription:
      "Property-wide internet and managed WiFi for mobile home communities. Turn connectivity into a billable amenity that lifts NOI and tenant retention.",
  },
  {
    slug: "large-properties",
    label: "Other Large Property",
    shortLabel: "Other Large Property",
    image: largeProps,
    tagline: "Resorts, wineries, retreats, venues, and acreage.",
    headline: "Connectivity for Large Properties That Refuse to Compromise",
    intro:
      "Wineries, glamping resorts, wedding venues, retreat centers, golf courses, and large-acreage operators. We engineer the whole stack — backhaul, point-to-point links, outdoor APs, and 24/7 monitoring.",
    painPoints: [
      "Guest expectations exceeding local ISP capability",
      "Event WiFi failing under load",
      "Operations split across multiple buildings",
      "No reliable connectivity for staff",
    ],
    challenges: [
      "Multi-building, multi-acre layouts",
      "Outdoor coverage in all weather",
      "Hospitality-grade reliability",
      "Compliance and guest-network isolation",
    ],
    revenueImpact: [
      "Higher booking conversion",
      "Smooth event execution and upsell",
      "Operational efficiency across staff",
      "Reduced complaint volume",
    ],
    roiExample: [
      { label: "Buildings", value: "5+" },
      { label: "Coverage", value: "Whole property" },
      { label: "Uptime target", value: "99.9%" },
    ],
    ctaLabel: "Schedule Property Assessment",
    seoTitle: "Commercial WiFi for Resorts & Large Properties | InstallPros",
    seoDescription:
      "Enterprise WiFi, Starlink Business, and point-to-point links for resorts, wineries, venues, retreats, and large-acreage properties.",
  },
];

export const getIndustry = (slug: string) =>
  INDUSTRIES.find((i) => i.slug === slug);
