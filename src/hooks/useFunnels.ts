import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FunnelConfig } from "@/lib/funnels/schema";

export interface FunnelRow {
  id: string;
  slug: string;
  name: string;
  config: FunnelConfig;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useFunnels() {
  return useQuery({
    queryKey: ["funnels"],
    queryFn: async (): Promise<FunnelRow[]> => {
      const { data, error } = await supabase
        .from("funnels")
        .select("*")
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as FunnelRow[]) ?? [];
    },
  });
}

export function usePrimaryFunnel() {
  return useQuery({
    queryKey: ["funnels", "primary"],
    queryFn: async (): Promise<FunnelRow | null> => {
      const { data, error } = await supabase
        .from("funnels")
        .select("*")
        .eq("is_primary", true)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as FunnelRow) ?? null;
    },
  });
}

export function useCreateFunnel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { slug: string; name: string; config: FunnelConfig }) => {
      const payload = {
        slug: input.slug,
        name: input.name,
        config: input.config as unknown as never,
        is_primary: false,
        is_active: true,
      };
      const { data, error } = await supabase
        .from("funnels")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw error;
      return data as unknown as FunnelRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["funnels"] });
    },
  });
}

export function useDeleteFunnel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("funnels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["funnels"] });
    },
  });
}
