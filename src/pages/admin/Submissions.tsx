import { useState } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ClipboardList, FileCheck, FileMinus, Percent, Smartphone, Globe } from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { DateRangeFilter, type DateRange } from "@/components/admin/DateRangeFilter";
import { useSubmissions, type TypeFilter } from "@/hooks/useSubmissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const PER_PAGE = 25;

export default function Submissions() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSubmissions({
    startDate: dateRange.from.toISOString(),
    endDate: dateRange.to.toISOString(),
    typeFilter,
    page,
    perPage: PER_PAGE,
  });

  const totalPages = data ? Math.ceil(data.filteredTotal / PER_PAGE) : 1;
  const completionRate = data && data.total > 0
    ? Math.round((data.fullCount / data.total) * 100)
    : 0;

  const handleTypeChange = (t: TypeFilter) => {
    setTypeFilter(t);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Submissions</h2>
          <p className="text-sm text-muted-foreground">Full and partial leads from the quote form</p>
        </div>
        <DateRangeFilter
          value={dateRange}
          onChange={(r) => { setDateRange(r); setPage(1); }}
        />
      </div>

      {/* Domain breakdown — today */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Submissions by domain</h3>
        </div>
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : !data?.domainsToday || data.domainsToday.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions in this range.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.domainsToday.map((d) => (
              <div
                key={d.host}
                className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
              >
                <span
                  className="text-sm font-medium text-foreground truncate mr-2"
                  title={d.host}
                >
                  {d.host === "unknown" ? "Unknown (legacy)" : d.host}
                </span>
                <span className="text-lg font-bold text-primary tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))
        ) : (
          <>
            <MetricCard title="Total Submissions" value={data?.total ?? 0} icon={ClipboardList} />
            <MetricCard title="Full Submissions" value={data?.fullCount ?? 0} icon={FileCheck} />
            <MetricCard title="Partial Submissions" value={data?.partialCount ?? 0} icon={FileMinus} />
            <MetricCard title="Completion Rate" value={`${completionRate}%`} icon={Percent} />
            <MetricCard
              title="Mobile vs Desktop"
              value={`${data?.mobileCount ?? 0} / ${data?.desktopCount ?? 0}`}
              subtitle={
                ((data?.mobileCount ?? 0) + (data?.desktopCount ?? 0)) > 0
                  ? `${Math.round(((data?.mobileCount ?? 0) / ((data?.mobileCount ?? 0) + (data?.desktopCount ?? 0))) * 100)}% mobile`
                  : "No device data"
              }
              icon={Smartphone}
            />
          </>
        )}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 w-fit">
        {(["all", "full", "partial"] as TypeFilter[]).map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? "secondary" : "ghost"}
            size="sm"
            className="text-xs capitalize"
            onClick={() => handleTypeChange(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Device</TableHead>
              <TableHead className="hidden lg:table-cell">UTM Source</TableHead>
              <TableHead className="hidden xl:table-cell">Variant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No submissions found for this period
                </TableCell>
              </TableRow>
            ) : (
              data?.submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {format(new Date(s.created_at), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>{s.name || "—"}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{s.email || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">{s.phone || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {[s.street, s.city, s.state, s.zip].filter(Boolean).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.is_partial ? "secondary" : "default"} className="text-xs">
                      {s.is_partial ? "Partial" : "Full"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {s.device_type ? (
                      <Badge variant="outline" className="text-xs capitalize">
                        {s.device_type}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{s.utm_source || "—"}</TableCell>
                  <TableCell className="hidden xl:table-cell text-xs">{s.variant_id || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({data?.filteredTotal} results)
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
