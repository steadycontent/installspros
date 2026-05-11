import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Webhook, WebhookInsert } from "@/hooks/useWebhooks";

const TRIGGER_OPTIONS = [
  { value: "lead_created", label: "Lead Created" },
  { value: "contact_form_submitted", label: "Contact Form Submitted" },
  { value: "lighting_lead_created", label: "Lighting Lead Created" },
  { value: "lead_partial_submitted", label: "Partial Lead Submitted" },
];

interface WebhookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WebhookInsert) => void;
  webhook?: Webhook | null;
  isPending?: boolean;
}

export function WebhookFormDialog({ open, onOpenChange, onSubmit, webhook, isPending }: WebhookFormDialogProps) {
  const isEdit = !!webhook;
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (webhook) {
      setName(webhook.name);
      setUrl(webhook.url);
      setTriggerEvent(webhook.trigger_event);
      setDescription(webhook.description ?? "");
      setIsActive(webhook.is_active);
    } else {
      setName("");
      setUrl("");
      setTriggerEvent("");
      setDescription("");
      setIsActive(true);
    }
  }, [webhook, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      url,
      trigger_event: triggerEvent,
      description: description || null,
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Webhook" : "Add Webhook"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wh-name">Name</Label>
            <Input id="wh-name" size="sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zapier Lead Sync" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wh-url">Webhook URL</Label>
            <Input id="wh-url" size="sm" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.example.com/..." required />
          </div>
          <div className="space-y-2">
            <Label>Trigger Event</Label>
            <Select value={triggerEvent} onValueChange={setTriggerEvent} required>
              <SelectTrigger size="sm">
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wh-desc">Description (optional)</Label>
            <Textarea id="wh-desc" size="sm" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this webhook do?" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending || !name || !url || !triggerEvent}>
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Webhook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
