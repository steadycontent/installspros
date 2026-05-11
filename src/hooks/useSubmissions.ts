import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TypeFilter = "all" | "full" | "partial";

interface SubmissionsParams {
  startDate: string;
  endDate: string;
  typeFilter: TypeFilter;
  page: number;
  perPage: number;
}

interface Submission {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  is_partial: boolean | null;
  utm_source: string | null;
  variant_id: string | null;
  installation_type: string | null;
  device_type: string | null;
}

export interface DomainCount {
  host: string;
  count: number;
}

interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  fullCount: number;
  partialCount: number;
  mobileCount: number;
  desktopCount: number;
  filteredTotal: number;
  domainsToday: DomainCount[];
  page: number;
  perPage: number;
}

export function useSubmissions(params: SubmissionsParams) {
  return useQuery<SubmissionsResponse>({
    queryKey: ["admin-submissions", params],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-submissions", {
        body: {
          start_date: params.startDate,
          end_date: params.endDate,
          type_filter: params.typeFilter,
          page: params.page,
          per_page: params.perPage,
        },
      });
      if (error) throw error;
      return data as SubmissionsResponse;
    },
  });
}
