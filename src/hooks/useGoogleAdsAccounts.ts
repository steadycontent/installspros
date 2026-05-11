import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ⚠️ TECH DEBT: Google Ads credentials (client_secret, refresh_token, developer_token)
// are stored as plain text in the google_ads_accounts table. When this feature is
// activated for production use, migrate these to Supabase Vault or edge function secrets.
// See: adversarial audit finding #3.

interface GoogleAdsAccount {
  id: string;
  account_name: string;
  customer_id: string;
  developer_token: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useGoogleAdsAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ["google-ads-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_ads_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GoogleAdsAccount[];
    },
  });

  const createAccount = useMutation({
    mutationFn: async (account: Partial<GoogleAdsAccount>) => {
      const { data, error } = await supabase
        .from("google_ads_accounts")
        .insert(account)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["google-ads-accounts"] }),
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GoogleAdsAccount> & { id: string }) => {
      const { data, error } = await supabase
        .from("google_ads_accounts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["google-ads-accounts"] }),
  });

  return {
    accounts: accountsQuery.data ?? [],
    isLoading: accountsQuery.isLoading,
    error: accountsQuery.error,
    createAccount,
    updateAccount,
  };
}
