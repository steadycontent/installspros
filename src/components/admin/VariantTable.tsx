import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VariantData } from "@/lib/analytics/types";

interface VariantTableProps {
  data: VariantData[];
  className?: string;
}

const variantDescriptions: Record<string, { label: string; elements: string[] }> = {
  control: {
    label: "Baseline",
    elements: ["No trust badges", "Clean hero"],
  },
  credibility: {
    label: "Trust Signals",
    elements: ["Google 5.0 ⭐", "Trustpilot", "7,000+ installs"],
  },
  default: {
    label: "Unassigned",
    elements: ["No variant set"],
  },
};

export function VariantTable({ data, className }: VariantTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("text-center text-muted-foreground py-12", className)}>
        No variant data available for this period
      </div>
    );
  }

  // Sort by sessions descending
  const sortedData = [...data].sort((a, b) => b.sessions - a.sessions);

  return (
    <div className={cn("rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Variant</TableHead>
            <TableHead className="text-right">Sessions</TableHead>
            <TableHead className="text-right">Leads</TableHead>
            <TableHead className="text-right">Conversion Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((variant) => {
            const desc = variantDescriptions[variant.variant] || { label: variant.variant, elements: [] };
            return (
              <TableRow key={variant.variant}>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">
                        {variant.variant}
                      </code>
                      <span className="text-xs text-muted-foreground">{desc.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {desc.elements.map((el) => (
                        <Badge key={el} variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                          {el}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {variant.sessions.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {variant.leads.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-mono font-medium",
                    variant.conversionRate >= 5 ? "text-green-600" : 
                    variant.conversionRate >= 2 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {variant.conversionRate}%
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
