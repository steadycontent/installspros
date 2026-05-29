import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FunnelConfigSchema, slugify, SLUG_RE, type FunnelConfig } from "@/lib/funnels/schema";
import { useCreateFunnel } from "@/hooks/useFunnels";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  primaryConfig: FunnelConfig | null;
}

export default function NewFunnelDialog({ open, onOpenChange, primaryConfig }: Props) {
  const [tab, setTab] = useState<"blank" | "import">("blank");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [name, setName] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const createFunnel = useCreateFunnel();

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (!open) {
      setTab("blank");
      setSlug("");
      setSlugTouched(false);
      setName("");
      setJsonText("");
      setJsonError(null);
    }
  }, [open]);

  const submit = async () => {
    if (!SLUG_RE.test(slug)) {
      toast({ title: "Invalid slug", description: "Lowercase letters, numbers, and dashes only.", variant: "destructive" });
      return;
    }
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }

    let config: FunnelConfig | null = null;

    if (tab === "blank") {
      if (!primaryConfig) {
        toast({ title: "No primary funnel available to copy", variant: "destructive" });
        return;
      }
      config = primaryConfig;
    } else {
      try {
        const parsed = JSON.parse(jsonText);
        const valid = FunnelConfigSchema.safeParse(parsed);
        if (!valid.success) {
          setJsonError(valid.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n"));
          return;
        }
        config = valid.data;
        setJsonError(null);
      } catch (e) {
        setJsonError(e instanceof Error ? e.message : "Invalid JSON");
        return;
      }
    }

    try {
      const row = await createFunnel.mutateAsync({ slug, name: name.trim(), config: config! });
      toast({
        title: "Funnel created",
        description: (
          <div className="flex items-center gap-2">
            <span>Live at /f/{row.slug}</span>
            <a
              href={`/f/${row.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline"
            >
              Open <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) as unknown as string,
      });
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "Failed to create funnel",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New funnel</DialogTitle>
          <DialogDescription>Deploy a new data-collection funnel to its own URL.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "blank" | "import")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="blank">From primary</TabsTrigger>
            <TabsTrigger value="import">Import JSON</TabsTrigger>
          </TabsList>

          <div className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="funnel-name">Funnel name</Label>
              <Input
                id="funnel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Solar Texas Q1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="funnel-slug">URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">/f/</span>
                <Input
                  id="funnel-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="solar-texas"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Lowercase letters, numbers, and dashes. This becomes the URL.
              </p>
            </div>
          </div>

          <TabsContent value="blank" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Creates a copy of the current primary funnel. You can edit it later via Import JSON.
            </p>
          </TabsContent>

          <TabsContent value="import" className="mt-3 space-y-2">
            <Label htmlFor="funnel-json">Funnel JSON</Label>
            <Textarea
              id="funnel-json"
              value={jsonText}
              onChange={(e) => {
                const text = e.target.value;
                setJsonText(text);
                setJsonError(null);
                // Auto-prefill name/slug from meta if present
                try {
                  const parsed = JSON.parse(text);
                  const metaName = parsed?.meta?.name;
                  const metaSlug = parsed?.meta?.slug;
                  if (metaName && !name) setName(String(metaName));
                  if (metaSlug && !slug) {
                    setSlug(slugify(String(metaSlug)));
                    setSlugTouched(true);
                  }
                } catch {
                  /* ignore — user is still typing */
                }
              }}
              rows={10}
              placeholder='{"version":1,"meta":{"name":"...","slug":"..."},"branding":{...},"steps":[...],"submit":{...}}'
              className="font-mono text-xs"
            />
            {jsonError && (
              <pre className="text-xs text-destructive whitespace-pre-wrap">{jsonError}</pre>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={createFunnel.isPending}>
            {createFunnel.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Create funnel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
