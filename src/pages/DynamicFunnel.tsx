import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FunnelConfigSchema, type FunnelConfig } from "@/lib/funnels/schema";
import FunnelEngine from "@/components/funnel/FunnelEngine";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface State {
  loading: boolean;
  config: FunnelConfig | null;
  name: string;
  notFound: boolean;
}

export default function DynamicFunnel() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<State>({ loading: true, config: null, name: "", notFound: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) {
        setState({ loading: false, config: null, name: "", notFound: true });
        return;
      }
      const { data, error } = await supabase
        .from("funnels")
        .select("name, config, is_active")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setState({ loading: false, config: null, name: "", notFound: true });
        return;
      }
      const parsed = FunnelConfigSchema.safeParse(data.config);
      if (!parsed.success) {
        setState({ loading: false, config: null, name: data.name as string, notFound: true });
        return;
      }
      setState({ loading: false, config: parsed.data, name: data.name as string, notFound: false });
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state.notFound || !state.config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Funnel not found</h1>
        <p className="text-muted-foreground">This funnel is unavailable or has been removed.</p>
      </div>
    );
  }

  const { branding } = state.config;

  return (
    <>
      <Helmet>
        <title>{state.name} | InstallPros</title>
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-[hsl(var(--dark-bg))] text-white pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto text-center space-y-3 mb-6">
          {branding.badge && (
            <span className="inline-block text-xs font-medium text-white bg-white/10 px-3 py-1 rounded-full">
              {branding.badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{branding.headline}</h1>
          {branding.subheadline && (
            <p className="text-sm text-white/70">{branding.subheadline}</p>
          )}
        </div>
        <FunnelEngine config={state.config} variantId={slug} />
      </main>
      <Footer />
    </>
  );
}
