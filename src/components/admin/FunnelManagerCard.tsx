import { useState } from "react";
import { Copy, Plus, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useFunnels, usePrimaryFunnel, useDeleteFunnel } from "@/hooks/useFunnels";
import NewFunnelDialog from "./NewFunnelDialog";

export default function FunnelManagerCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: primary } = usePrimaryFunnel();
  const { data: funnels, isLoading } = useFunnels();
  const deleteFunnel = useDeleteFunnel();

  const copyPrimary = async () => {
    if (!primary) {
      toast({ title: "No primary funnel found", variant: "destructive" });
      return;
    }
    try {
      const payload = {
        ...primary.config,
        meta: { name: primary.name, slug: primary.slug },
      };
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      toast({ title: "Copied", description: "Primary funnel JSON copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Clipboard unavailable.", variant: "destructive" });
    }
  };

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete funnel "${name}"? This cannot be undone.`)) return;
    try {
      await deleteFunnel.mutateAsync(id);
      toast({ title: "Funnel deleted" });
    } catch (e) {
      toast({
        title: "Delete failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const customFunnels = (funnels || []).filter((f) => !f.is_primary);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-lg">Funnels</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyPrimary}>
              <Copy className="h-4 w-4 mr-1.5" />
              Copy JSON
            </Button>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              New Funnel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : customFunnels.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              No custom funnels yet. Click <strong>New Funnel</strong> to create one — it will go live at
              <code className="mx-1 px-1.5 py-0.5 bg-muted rounded">/f/your-slug</code>.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {customFunnels.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      /f/{f.slug} · {new Date(f.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const payload = { ...f.config, meta: { name: f.name, slug: f.slug } };
                        await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                        toast({ title: "Copied", description: `${f.name} JSON copied.` });
                      }}
                      title="Copy JSON"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild title="Open">
                      <a href={`/f/${f.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(f.id, f.name)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <NewFunnelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        primaryConfig={primary?.config ?? null}
      />
    </>
  );
}
