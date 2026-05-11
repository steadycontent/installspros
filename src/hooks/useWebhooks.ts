import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Webhook {
  id: string;
  name: string;
  url: string;
  description: string | null;
  is_active: boolean;
  trigger_event: string;
  created_at: string;
  updated_at: string;
}

export type WebhookInsert = Omit<Webhook, "id" | "created_at" | "updated_at">;

export function useWebhooks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const webhooksQuery = useQuery({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webhooks" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Webhook[];
    },
  });

  const createWebhook = useMutation({
    mutationFn: async (webhook: WebhookInsert) => {
      const { data, error } = await supabase
        .from("webhooks" as any)
        .insert(webhook as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Webhook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({ title: "Webhook created", description: "The webhook has been added successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating webhook", description: error.message, variant: "destructive" });
    },
  });

  const updateWebhook = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Webhook> & { id: string }) => {
      const { data, error } = await supabase
        .from("webhooks" as any)
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Webhook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({ title: "Webhook updated", description: "The webhook has been updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating webhook", description: error.message, variant: "destructive" });
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("webhooks" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({ title: "Webhook deleted", description: "The webhook has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting webhook", description: error.message, variant: "destructive" });
    },
  });

  const toggleWebhook = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("webhooks" as any)
        .update({ is_active } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({ title: "Status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error toggling webhook", description: error.message, variant: "destructive" });
    },
  });

  return {
    webhooks: webhooksQuery.data ?? [],
    isLoading: webhooksQuery.isLoading,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    toggleWebhook,
  };
}
