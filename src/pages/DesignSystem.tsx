import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sun, Moon, Copy, Check, Palette, Type, LayoutGrid, Square, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

// Color system definitions
const colorSystem = {
  light: {
    backgrounds: [
      { name: "Background 1", hex: "#FFFFFF", usage: "Default page and element background" },
      { name: "Background 2", hex: "#FAFAFA", usage: "Used sparingly for subtle background separation" },
    ],
    components: [
      { name: "Color 1", hex: "#F2F2F2", usage: "Default component background" },
      { name: "Color 2", hex: "#EBEBEB", usage: "Hover background" },
      { name: "Color 3", hex: "#E6E6E6", usage: "Active background" },
    ],
    borders: [
      { name: "Color 4", hex: "#EBEBEB", usage: "Default border" },
      { name: "Color 5", hex: "#C9C9C9", usage: "Hover border" },
      { name: "Color 6", hex: "#A8A8A8", usage: "Active border" },
    ],
    highContrast: [
      { name: "Color 7", hex: "#8F8F8F", usage: "High contrast background" },
      { name: "Color 8", hex: "#7D7D7D", usage: "Hover high contrast background" },
    ],
    text: [
      { name: "Color 9", hex: "#666666", usage: "Secondary text and icons" },
      { name: "Color 10", hex: "#171717", usage: "Primary text and icons" },
    ],
  },
  dark: {
    backgrounds: [
      { name: "Background 1", hex: "#0A0A0A", usage: "Default element and page background" },
      { name: "Background 2", hex: "#000000", usage: "Used sparingly for subtle background separation" },
    ],
    components: [
      { name: "Color 1", hex: "#1A1A1A", usage: "Default component background" },
      { name: "Color 2", hex: "#1F1F1F", usage: "Hover background" },
      { name: "Color 3", hex: "#292929", usage: "Active background" },
    ],
    borders: [
      { name: "Color 4", hex: "#2E2E2E", usage: "Default border" },
      { name: "Color 5", hex: "#454545", usage: "Hover border" },
      { name: "Color 6", hex: "#878787", usage: "Active border" },
    ],
    highContrast: [
      { name: "Color 7", hex: "#8F8F8F", usage: "High contrast background" },
      { name: "Color 8", hex: "#7D7D7D", usage: "Hover high contrast background" },
    ],
    text: [
      { name: "Color 9", hex: "#A1A1A1", usage: "Secondary text and icons" },
      { name: "Color 10", hex: "#EDEDED", usage: "Primary text and icons" },
    ],
  },
};

const typographyScale = [
  {
    name: "Display",
    usage: "Hero only",
    sample: "Aa",
    desktop: { size: "72px", weight: "700", lineHeight: "1.1", letterSpacing: "-0.02em" },
    mobile: { size: "44-48px", weight: "700", lineHeight: "1.15", letterSpacing: "-0.01em" },
    rules: ["Only for hero headlines", "Never for body content", "Letter-spacing slightly negative (large sizes only)"],
  },
  {
    name: "H1",
    usage: "Page title",
    sample: "Heading 1",
    desktop: { size: "48px", weight: "700", lineHeight: "1.15", letterSpacing: "-0.015em" },
    mobile: { size: "32-36px", weight: "700", lineHeight: "1.2", letterSpacing: "0" },
  },
  {
    name: "H2",
    usage: "Section heading",
    sample: "Heading 2",
    desktop: { size: "36px", weight: "700", lineHeight: "1.2", letterSpacing: "-0.01em" },
    mobile: { size: "26-28px", weight: "700", lineHeight: "1.25", letterSpacing: "0" },
  },
  {
    name: "H3",
    usage: "Sub-section",
    sample: "Heading 3",
    desktop: { size: "24px", weight: "700", lineHeight: "1.3", letterSpacing: "0" },
    mobile: { size: "20-22px", weight: "700", lineHeight: "1.3", letterSpacing: "0" },
  },
  {
    name: "H4",
    usage: "Component title",
    sample: "Heading 4",
    desktop: { size: "20px", weight: "700", lineHeight: "1.35", letterSpacing: "0" },
    mobile: { size: "18px", weight: "700", lineHeight: "1.35", letterSpacing: "0" },
  },
  {
    name: "Body Large",
    usage: "optional but recommended",
    sample: "Body text large",
    desktop: { size: "18px", weight: "400", lineHeight: "1.6", letterSpacing: "0" },
    note: "Use for intros / lead paragraphs.",
  },
  {
    name: "Body",
    usage: "default",
    sample: "Body text default",
    desktop: { size: "16px", weight: "400", lineHeight: "1.6", letterSpacing: "0" },
  },
  {
    name: "Body Small",
    usage: "",
    sample: "Body text small",
    desktop: { size: "14px", weight: "400", lineHeight: "1.5", letterSpacing: "0" },
  },
  {
    name: "Caption",
    usage: "Meta / Labels",
    sample: "Caption text",
    desktop: { size: "12px", weight: "500", lineHeight: "1.4", letterSpacing: "+0.02em" },
  },
];

const typographyRules = {
  dont: [
    "No negative letter-spacing below 32px",
    "No Display text outside heroes",
    "No using headings just to \"make text bigger\"",
  ],
  do: [
    "Line-height increases as text size decreases",
    "Body text always prioritizes readability",
  ],
};

const spacingScale = [
  { name: "4", value: "4px", rem: "0.25rem" },
  { name: "8", value: "8px", rem: "0.5rem" },
  { name: "12", value: "12px", rem: "0.75rem" },
  { name: "16", value: "16px", rem: "1rem" },
  { name: "20", value: "20px", rem: "1.25rem" },
  { name: "24", value: "24px", rem: "1.5rem" },
  { name: "32", value: "32px", rem: "2rem" },
  { name: "40", value: "40px", rem: "2.5rem" },
  { name: "48", value: "48px", rem: "3rem" },
  { name: "64", value: "64px", rem: "4rem" },
  { name: "80", value: "80px", rem: "5rem" },
  { name: "96", value: "96px", rem: "6rem" },
];

function ColorSwatch({ name, hex, usage, isDark }: { name: string; hex: string; usage: string; isDark: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isLightColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };

  return (
    <div className={cn(
      "group rounded-lg border overflow-hidden",
      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-white"
    )}>
      <div
        className="h-24 relative cursor-pointer flex items-center justify-center"
        style={{ backgroundColor: hex }}
        onClick={copyHex}
      >
        <span className={cn(
          "text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
          isLightColor(hex) ? "text-black" : "text-white"
        )}>
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : hex}
        </span>
      </div>
      <div className={cn("p-3", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
        <p className="font-medium text-sm">{name}</p>
        <p className={cn("text-xs font-mono", isDark ? "text-[#A1A1A1]" : "text-[#666666]")}>{hex}</p>
        <p className={cn("text-xs mt-1", isDark ? "text-[#A1A1A1]" : "text-[#666666]")}>{usage}</p>
      </div>
    </div>
  );
}

function ColorSection({ title, colors, isDark }: { title: string; colors: typeof colorSystem.light.text; isDark: boolean }) {
  return (
    <div className="mb-10">
      <h3 className={cn(
        "text-sm font-semibold uppercase tracking-wider mb-4",
        isDark ? "text-[#A1A1A1]" : "text-[#666666]"
      )}>
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {colors.map((color) => (
          <ColorSwatch key={color.name} {...color} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function SidebarNav({ activeSection, onSectionChange, isDark }: { 
  activeSection: string; 
  onSectionChange: (section: string) => void;
  isDark: boolean;
}) {
  const foundations = [
    { id: "colors", label: "Colors", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "spacing", label: "Spacing & Layout", icon: LayoutGrid },
  ];

  const components = [
    { id: "buttons", label: "Buttons", icon: Square },
    { id: "forms", label: "Forms", icon: FileText },
    { id: "cards", label: "Cards", icon: CreditCard },
  ];

  const NavItem = ({ item }: { item: { id: string; label: string; icon: React.ElementType } }) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    
    return (
      <button
        onClick={() => onSectionChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          isActive
            ? isDark 
              ? "bg-[#1F1F1F] text-[#EDEDED] font-medium" 
              : "bg-[#F2F2F2] text-[#171717] font-medium"
            : isDark
              ? "text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-[#1F1F1F]"
              : "text-[#666666] hover:text-[#171717] hover:bg-[#F2F2F2]"
        )}
      >
        <Icon className="w-4 h-4" />
        {item.label}
      </button>
    );
  };

  return (
    <nav className="space-y-6">
      <div>
        <p className={cn(
          "text-xs font-semibold uppercase tracking-wider mb-3 px-3",
          isDark ? "text-[#A1A1A1]" : "text-[#666666]"
        )}>
          Foundations
        </p>
        <div className="space-y-1">
          {foundations.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>
      </div>
      
      <div>
        <p className={cn(
          "text-xs font-semibold uppercase tracking-wider mb-3 px-3",
          isDark ? "text-[#A1A1A1]" : "text-[#666666]"
        )}>
          Components
        </p>
        <div className="space-y-1">
          {components.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function DesignSystem() {
  const [theme, setTheme] = useState<Theme>("light");
  const [activeSection, setActiveSection] = useState("colors");

  const isDark = theme === "dark";
  const colors = colorSystem[theme];

  return (
    <>
      <Helmet>
        <title>Design System | InstallPros</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={cn(
        "min-h-screen transition-colors",
        isDark ? "bg-[#0A0A0A]" : "bg-white"
      )}>
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-sm",
          isDark ? "border-[#2E2E2E] bg-[#0A0A0A]/90" : "border-[#EBEBEB] bg-white/90"
        )}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-lg font-bold",
                isDark ? "text-[#EDEDED]" : "text-[#171717]"
              )}>
                InstallPros
              </span>
              <span className={cn(
                "text-sm",
                isDark ? "text-[#A1A1A1]" : "text-[#666666]"
              )}>
                / Design System
              </span>
            </div>

            {/* Theme Toggle */}
            <div className={cn(
              "flex items-center rounded-full p-1 border",
              isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
            )}>
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  theme === "light"
                    ? "bg-white text-[#171717] shadow-sm"
                    : isDark 
                      ? "text-[#A1A1A1] hover:text-[#EDEDED]" 
                      : "text-[#666666] hover:text-[#171717]"
                )}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  theme === "dark"
                    ? "bg-[#1F1F1F] text-[#EDEDED] shadow-sm"
                    : isDark 
                      ? "text-[#A1A1A1] hover:text-[#EDEDED]" 
                      : "text-[#666666] hover:text-[#171717]"
                )}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <SidebarNav 
                activeSection={activeSection} 
                onSectionChange={setActiveSection}
                isDark={isDark}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Colors Section */}
            {activeSection === "colors" && (
              <section>
                <div className="mb-10">
                  <h1 className={cn(
                    "text-3xl font-bold mb-2",
                    isDark ? "text-[#EDEDED]" : "text-[#171717]"
                  )}>
                    Colors
                  </h1>
                  <p className={cn(
                    "text-base",
                    isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                  )}>
                    {isDark 
                      ? "The Dark Theme is used for documentation, future exploration, and consistency."
                      : "The InstallPros color system is designed for clarity, accessibility, and consistency across all touchpoints."
                    }
                    {theme === "dark" && (
                      <span className={cn(
                        "ml-2 px-2 py-0.5 rounded text-xs font-medium",
                        "bg-[#3B9EFF]/20 text-[#3B9EFF]"
                      )}>
                        Documentation Only
                      </span>
                    )}
                  </p>
                  {isDark && (
                    <p className={cn("text-sm mt-2", "text-[#A1A1A1]")}>
                      Light Theme remains the only production website theme.
                    </p>
                  )}
                </div>

                {isDark ? (
                  <>
                    <ColorSection title="Backgrounds" colors={colorSystem.dark.backgrounds} isDark={isDark} />
                    <ColorSection title="Component Backgrounds (Colors 1–3)" colors={colorSystem.dark.components} isDark={isDark} />
                    <ColorSection title="Borders (Colors 4–6)" colors={colorSystem.dark.borders} isDark={isDark} />
                    <ColorSection title="High Contrast Backgrounds (Colors 7–8)" colors={colorSystem.dark.highContrast} isDark={isDark} />
                    <ColorSection title="Text & Icons (Colors 9–10)" colors={colorSystem.dark.text} isDark={isDark} />
                  </>
                ) : (
                  <>
                    <ColorSection title="Backgrounds" colors={colorSystem.light.backgrounds} isDark={isDark} />
                    <ColorSection title="Component Backgrounds (Colors 1–3)" colors={colorSystem.light.components} isDark={isDark} />
                    <ColorSection title="Borders (Colors 4–6)" colors={colorSystem.light.borders} isDark={isDark} />
                    <ColorSection title="High Contrast Backgrounds (Colors 7–8)" colors={colorSystem.light.highContrast} isDark={isDark} />
                    <ColorSection title="Text & Icons (Colors 9–10)" colors={colorSystem.light.text} isDark={isDark} />
                  </>
                )}
              </section>
            )}

            {/* Typography Section */}
            {activeSection === "typography" && (
              <section>
                <div className="mb-10">
                  <h1 className={cn(
                    "text-3xl font-bold mb-2",
                    isDark ? "text-[#EDEDED]" : "text-[#171717]"
                  )}>
                    Typography
                  </h1>
                  <p className={cn(
                    "text-base",
                    isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                  )}>
                    These are correct for a website, readable, and consistent with InstallPros' brand.
                  </p>
                </div>

                <div className="space-y-12">
                  {typographyScale.map((type) => (
                    <div key={type.name} className={cn(
                      "pb-10",
                      isDark ? "border-b border-[#2E2E2E]" : "border-b border-[#EBEBEB]"
                    )}>
                      {/* Header with name and usage */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[#0068D6]">◆</span>
                        <span className={cn(
                          "font-semibold",
                          isDark ? "text-[#EDEDED]" : "text-[#171717]"
                        )}>
                          {type.name}
                        </span>
                        {type.usage && (
                          <span className={isDark ? "text-[#A1A1A1]" : "text-[#666666]"}>
                            — {type.usage}
                          </span>
                        )}
                      </div>

                      {/* Sample text */}
                      <p
                        style={{
                          fontSize: type.desktop.size,
                          fontWeight: parseInt(type.desktop.weight),
                          lineHeight: type.desktop.lineHeight,
                          letterSpacing: type.desktop.letterSpacing,
                        }}
                        className={cn("mb-6", isDark ? "text-[#EDEDED]" : "text-[#171717]")}
                      >
                        {type.sample}
                      </p>

                      {/* Specs table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className={isDark ? "text-[#3B9EFF]" : "text-[#0068D6]"}>
                              <th className="text-left font-normal pb-2 pr-8">Device</th>
                              <th className="text-left font-normal pb-2 pr-8">Size</th>
                              <th className="text-left font-normal pb-2 pr-8">Weight</th>
                              <th className="text-left font-normal pb-2 pr-8">Line-height</th>
                              <th className="text-left font-normal pb-2">Letter-spacing</th>
                            </tr>
                          </thead>
                          <tbody className={isDark ? "text-[#EDEDED]" : "text-[#171717]"}>
                            <tr>
                              <td className="py-1 pr-8 font-medium">Desktop</td>
                              <td className="py-1 pr-8">{type.desktop.size}</td>
                              <td className="py-1 pr-8">{type.desktop.weight}</td>
                              <td className={isDark ? "py-1 pr-8 text-[#3B9EFF]" : "py-1 pr-8 text-[#0068D6]"}>{type.desktop.lineHeight}</td>
                              <td className="py-1">{type.desktop.letterSpacing}</td>
                            </tr>
                            {type.mobile && (
                              <tr>
                                <td className="py-1 pr-8 font-medium">Mobile</td>
                                <td className="py-1 pr-8">{type.mobile.size}</td>
                                <td className="py-1 pr-8">{type.mobile.weight}</td>
                                <td className={isDark ? "py-1 pr-8 text-[#3B9EFF]" : "py-1 pr-8 text-[#0068D6]"}>{type.mobile.lineHeight}</td>
                                <td className="py-1">{type.mobile.letterSpacing}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Rules list */}
                      {type.rules && (
                        <div className="mt-4">
                          <p className={cn(
                            "text-sm font-medium mb-2",
                            isDark ? "text-[#EDEDED]" : "text-[#171717]"
                          )}>
                            Rules
                          </p>
                          <ul className={cn(
                            "list-disc list-inside text-sm space-y-1",
                            isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                          )}>
                            {type.rules.map((rule, i) => (
                              <li key={i}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Note */}
                      {type.note && (
                        <p className={cn(
                          "mt-4 text-sm italic",
                          isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                        )}>
                          {type.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Key Typography Rules Card */}
                <div className={cn(
                  "mt-12 rounded-lg border p-6",
                  isDark ? "border-[#2E2E2E] bg-[#1A1A1A]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                )}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#0068D6] text-white text-xs font-bold px-2 py-1 rounded">3</span>
                    <span className={cn(
                      "font-semibold",
                      isDark ? "text-[#EDEDED]" : "text-[#171717]"
                    )}>
                      Key Typography Rules (don't skip)
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {typographyRules.dont.map((rule, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-red-500">✕</span>
                        <span className={isDark ? "text-[#A1A1A1]" : "text-[#666666]"}>{rule}</span>
                      </li>
                    ))}
                    {typographyRules.do.map((rule, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className={isDark ? "text-[#A1A1A1]" : "text-[#666666]"}>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Spacing Section */}
            {activeSection === "spacing" && (
              <section>
                <div className="mb-10">
                  <h1 className={cn(
                    "text-3xl font-bold mb-2",
                    isDark ? "text-[#EDEDED]" : "text-[#171717]"
                  )}>
                    Spacing & Layout
                  </h1>
                  <p className={cn(
                    "text-base",
                    isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                  )}>
                    A consistent spacing scale ensures visual rhythm and alignment across components.
                  </p>
                </div>

                <div className={cn(
                  "rounded-lg border overflow-hidden",
                  isDark ? "border-[#2E2E2E]" : "border-[#EBEBEB]"
                )}>
                  {spacingScale.map((space, index) => (
                    <div
                      key={space.name}
                      className={cn(
                        "flex items-center gap-6 px-6 py-4",
                        index !== spacingScale.length - 1 && (isDark ? "border-b border-[#2E2E2E]" : "border-b border-[#EBEBEB]"),
                        isDark ? "bg-[#141414]" : "bg-white"
                      )}
                    >
                      <div className="w-20 flex-shrink-0">
                        <p className={cn(
                          "text-sm font-mono font-medium",
                          isDark ? "text-[#EDEDED]" : "text-[#171717]"
                        )}>
                          {space.name}
                        </p>
                      </div>
                      <div className="w-24 flex-shrink-0">
                        <p className={cn(
                          "text-sm font-mono",
                          isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                        )}>
                          {space.value}
                        </p>
                      </div>
                      <div className="flex-1 flex items-center">
                        <div
                          className={cn(
                            "h-4 rounded",
                            isDark ? "bg-[#3B9EFF]" : "bg-[#0068D6]"
                          )}
                          style={{ width: space.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Buttons Section */}
            {activeSection === "buttons" && (
              <section>
                <div className="mb-10">
                  <h1 className={cn(
                    "text-3xl font-bold mb-2",
                    isDark ? "text-[#EDEDED]" : "text-[#171717]"
                  )}>
                    Buttons
                  </h1>
                  <p className={cn(
                    "text-base",
                    isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                  )}>
                    Interactive button variants and states
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Primary */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-1",
                      isDark ? "text-[#3B9EFF]" : "text-[#0068D6]"
                    )}>
                      Primary
                    </h3>
                    <p className={cn(
                      "text-sm mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Default filled button for primary actions
                    </p>
                    <div className={cn(
                      "rounded-lg border p-6 flex flex-wrap gap-4",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <Button>Default</Button>
                      <Button variant="hero">Hero</Button>
                    </div>
                  </div>

                  {/* Secondary */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-1",
                      isDark ? "text-[#3B9EFF]" : "text-[#0068D6]"
                    )}>
                      Secondary
                    </h3>
                    <p className={cn(
                      "text-sm mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Alternative button styles for secondary actions
                    </p>
                    <div className={cn(
                      "rounded-lg border p-6 flex flex-wrap gap-4",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                    </div>
                  </div>

                  {/* Destructive */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-1",
                      isDark ? "text-[#3B9EFF]" : "text-[#0068D6]"
                    )}>
                      Destructive
                    </h3>
                    <p className={cn(
                      "text-sm mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Used for dangerous or irreversible actions
                    </p>
                    <div className={cn(
                      "rounded-lg border p-6 flex flex-wrap gap-4",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Sizes
                    </h3>
                    <div className={cn(
                      "rounded-lg border p-6 flex flex-wrap items-center gap-4",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </div>

                  {/* States */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      States
                    </h3>
                    <div className={cn(
                      "rounded-lg border p-6 flex flex-wrap items-center gap-4",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <Button>Normal</Button>
                      <Button disabled>Disabled</Button>
                    </div>
                  </div>

                  {/* Specs Bar */}
                  <div className={cn(
                    "rounded-lg border p-4 grid grid-cols-4 gap-4",
                    isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                  )}>
                    <div>
                      <p className={cn(
                        "text-xs mb-1",
                        isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                      )}>
                        Height
                      </p>
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-[#EDEDED]" : "text-[#171717]"
                      )}>
                        48px <span className={isDark ? "text-[#A1A1A1]" : "text-[#666666]"}>(default)</span>
                      </p>
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs mb-1",
                        isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                      )}>
                        Padding
                      </p>
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-[#EDEDED]" : "text-[#171717]"
                      )}>
                        12px 24px
                      </p>
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs mb-1",
                        isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                      )}>
                        Font
                      </p>
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-[#EDEDED]" : "text-[#171717]"
                      )}>
                        14px / 700
                      </p>
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs mb-1",
                        isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                      )}>
                        Radius
                      </p>
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-[#EDEDED]" : "text-[#171717]"
                      )}>
                        12px
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Forms Section */}
            {activeSection === "forms" && (
              <section>
                <div className="mb-10">
                  <h1 className={cn(
                    "text-3xl font-bold mb-2",
                    isDark ? "text-[#EDEDED]" : "text-[#171717]"
                  )}>
                    Forms
                  </h1>
                  <p className={cn(
                    "text-base",
                    isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                  )}>
                    Form elements for user input and data collection. All form components support three sizes: small, default, and large.
                  </p>
                </div>

                <div className="space-y-12">
                  {/* Input Sizes */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Input Sizes
                    </h3>
                    <div className={cn(
                      "rounded-lg border p-6 space-y-6",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <Label size="sm" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Small
                          </Label>
                          <Input size="sm" placeholder="Small input" />
                        </div>
                        <div>
                          <Label size="default" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Default
                          </Label>
                          <Input size="default" placeholder="Default input" />
                        </div>
                        <div>
                          <Label size="lg" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Large
                          </Label>
                          <Input size="lg" placeholder="Large input" />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Select Sizes */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Select Sizes
                    </h3>
                    <div className={cn(
                      "rounded-lg border p-6",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <Label size="sm" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Small
                          </Label>
                          <Select>
                            <SelectTrigger size="sm">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="option1">Option 1</SelectItem>
                              <SelectItem value="option2">Option 2</SelectItem>
                              <SelectItem value="option3">Option 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label size="default" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Default
                          </Label>
                          <Select>
                            <SelectTrigger size="default">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="option1">Option 1</SelectItem>
                              <SelectItem value="option2">Option 2</SelectItem>
                              <SelectItem value="option3">Option 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label size="lg" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Large
                          </Label>
                          <Select>
                            <SelectTrigger size="lg">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="option1">Option 1</SelectItem>
                              <SelectItem value="option2">Option 2</SelectItem>
                              <SelectItem value="option3">Option 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Textarea Sizes */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Textarea Sizes
                    </h3>
                    <div className={cn(
                      "rounded-lg border p-6",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <Label size="sm" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Small
                          </Label>
                          <Textarea size="sm" placeholder="Small textarea..." />
                        </div>
                        <div>
                          <Label size="default" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Default
                          </Label>
                          <Textarea size="default" placeholder="Default textarea..." />
                        </div>
                        <div>
                          <Label size="lg" className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Large
                          </Label>
                          <Textarea size="lg" placeholder="Large textarea..." />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input States */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Input States
                    </h3>
                    <div className={cn(
                      "rounded-lg border p-6",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <Label className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Normal
                          </Label>
                          <Input placeholder="Normal input" />
                        </div>
                        <div>
                          <Label className={cn("mb-1.5 block", isDark ? "text-[#EDEDED]" : "text-[#171717]")}>
                            Disabled
                          </Label>
                          <Input placeholder="Disabled input" disabled />
                        </div>
                        <div>
                          <Label className="mb-1.5 block text-destructive">
                            Error
                          </Label>
                          <Input placeholder="Error input" className="border-destructive focus-visible:ring-destructive" />
                          <p className="text-destructive text-xs mt-1">This field is required</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Label Sizes */}
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider mb-4",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Label Sizes
                    </h3>
                    <div className={cn(
                      "rounded-lg border p-6 flex flex-wrap items-end gap-8",
                      isDark ? "border-[#2E2E2E] bg-[#141414]" : "border-[#EBEBEB] bg-[#FAFAFA]"
                    )}>
                      <div>
                        <Label size="sm" className={isDark ? "text-[#EDEDED]" : "text-[#171717]"}>Small Label (12px)</Label>
                      </div>
                      <div>
                        <Label size="default" className={isDark ? "text-[#EDEDED]" : "text-[#171717]"}>Default Label (14px)</Label>
                      </div>
                      <div>
                        <Label size="lg" className={isDark ? "text-[#EDEDED]" : "text-[#171717]"}>Large Label (16px)</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Cards Section */}
            {activeSection === "cards" && (
              <section>
                <div className="mb-10">
                  <h1 className={cn(
                    "text-3xl font-bold mb-2",
                    isDark ? "text-[#EDEDED]" : "text-[#171717]"
                  )}>
                    Cards
                  </h1>
                  <p className={cn(
                    "text-base",
                    isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                  )}>
                    Card components for grouping related content.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Basic Card */}
                  <div className={cn(
                    "rounded-xl border p-6",
                    isDark 
                      ? "border-[#2E2E2E] bg-[#141414]" 
                      : "border-[#EBEBEB] bg-white shadow-sm"
                  )}>
                    <h4 className={cn(
                      "text-lg font-semibold mb-2",
                      isDark ? "text-[#EDEDED]" : "text-[#171717]"
                    )}>
                      Basic Card
                    </h4>
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      A simple card with padding, border, and subtle shadow.
                    </p>
                  </div>

                  {/* Interactive Card */}
                  <div className={cn(
                    "rounded-xl border p-6 transition-all cursor-pointer",
                    isDark 
                      ? "border-[#2E2E2E] bg-[#141414] hover:border-[#454545] hover:bg-[#1F1F1F]" 
                      : "border-[#EBEBEB] bg-white shadow-sm hover:shadow-md hover:border-[#C9C9C9]"
                  )}>
                    <h4 className={cn(
                      "text-lg font-semibold mb-2",
                      isDark ? "text-[#EDEDED]" : "text-[#171717]"
                    )}>
                      Interactive Card
                    </h4>
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                    )}>
                      Hover to see the interaction state with elevated shadow.
                    </p>
                  </div>

                  {/* Feature Card */}
                  <div className={cn(
                    "rounded-xl border p-6 md:col-span-2",
                    isDark 
                      ? "border-[#2E2E2E] bg-gradient-to-br from-[#141414] to-[#1F1F1F]" 
                      : "border-[#EBEBEB] bg-gradient-to-br from-white to-[#FAFAFA] shadow-sm"
                  )}>
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        isDark ? "bg-[#3B9EFF]/20" : "bg-[#0068D6]/10"
                      )}>
                        <span className={isDark ? "text-[#3B9EFF]" : "text-[#0068D6]"}>★</span>
                      </div>
                      <div>
                        <h4 className={cn(
                          "text-lg font-semibold mb-2",
                          isDark ? "text-[#EDEDED]" : "text-[#171717]"
                        )}>
                          Feature Card
                        </h4>
                        <p className={cn(
                          "text-sm",
                          isDark ? "text-[#A1A1A1]" : "text-[#666666]"
                        )}>
                          A larger card with icon, gradient background, and more content area for featuring important information.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
