import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VariantData } from "@/lib/analytics/types";

interface VariantComparisonChartProps {
  data: VariantData[];
}

const VARIANT_COLORS: Record<string, string> = {
  control: "hsl(215, 70%, 55%)",
  credibility: "hsl(150, 60%, 45%)",
  default: "hsl(260, 50%, 55%)",
};

function getColor(variant: string): string {
  return VARIANT_COLORS[variant] || VARIANT_COLORS.default;
}

export function VariantComparisonChart({ data }: VariantComparisonChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sessions & Leads Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessions & Leads</CardTitle>
          <CardDescription>Volume comparison by variant</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="variant" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend />
              <Bar dataKey="sessions" name="Sessions" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.variant} fill={getColor(entry.variant)} fillOpacity={0.7} />
                ))}
              </Bar>
              <Bar dataKey="leads" name="Leads" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.variant} fill={getColor(entry.variant)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversion Rate</CardTitle>
          <CardDescription>Lead conversion % by variant</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="variant" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(value: number) => [`${value}%`, "Conversion"]}
              />
              <Bar dataKey="conversionRate" name="Conversion %" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.variant} fill={getColor(entry.variant)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
