import { useState } from "react";
import { Webhook as WebhookIcon, Plus, ExternalLink, Pencil, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useWebhooks, type Webhook, type WebhookInsert } from "@/hooks/useWebhooks";
import { WebhookFormDialog } from "@/components/admin/WebhookFormDialog";

const TRIGGER_LABELS: Record<string, string> = {
  lead_created: "Lead Created",
  contact_form_submitted: "Contact Form Submitted",
  lighting_lead_created: "Lighting Lead Created",
  lead_partial_submitted: "Partial Lead Submitted",
};

export default function WebhooksPage() {
  const { webhooks, isLoading, createWebhook, updateWebhook, deleteWebhook, toggleWebhook } = useWebhooks();
  const [addOpen, setAddOpen] = useState(false);
  const [editWebhook, setEditWebhook] = useState<Webhook | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = (data: WebhookInsert) => {
    createWebhook.mutate(data, { onSuccess: () => setAddOpen(false) });
  };

  const handleUpdate = (data: WebhookInsert) => {
    if (!editWebhook) return;
    updateWebhook.mutate({ id: editWebhook.id, ...data }, { onSuccess: () => setEditWebhook(null) });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteWebhook.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Webhooks</h1>
          <p className="text-sm text-muted-foreground">Manage webhook endpoints for lead and event notifications</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Webhook
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <WebhookIcon className="h-5 w-5" /> Configured Webhooks
          </CardTitle>
          <CardDescription>Webhooks are triggered automatically when the specified events occur.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : webhooks.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              No webhooks configured yet. Click "Add Webhook" to create one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((wh) => (
                  <TableRow key={wh.id}>
                    <TableCell className="font-medium">{wh.name}</TableCell>
                    <TableCell>
                      <a href={wh.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground max-w-[200px] truncate">
                        {wh.url.replace(/^https?:\/\//, "").slice(0, 30)}…
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{TRIGGER_LABELS[wh.trigger_event] ?? wh.trigger_event}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={wh.is_active}
                        onCheckedChange={(checked) => toggleWebhook.mutate({ id: wh.id, is_active: checked })}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditWebhook(wh)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(wh.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <WebhookFormDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} isPending={createWebhook.isPending} />

      {/* Edit Dialog */}
      <WebhookFormDialog open={!!editWebhook} onOpenChange={(o) => !o && setEditWebhook(null)} onSubmit={handleUpdate} webhook={editWebhook} isPending={updateWebhook.isPending} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The webhook will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
