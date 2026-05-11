import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; cpc_bid_micros: string }) => void;
}

export function AdGroupFormDialog({ open, onOpenChange, onSubmit }: AdGroupFormDialogProps) {
  const [name, setName] = useState("");
  const [cpcBid, setCpcBid] = useState("1.00");

  const handleSubmit = () => {
    onSubmit({
      name,
      cpc_bid_micros: (parseFloat(cpcBid) * 1_000_000).toString(),
    });
    setName("");
    setCpcBid("1.00");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Ad Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Ad Group Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Starlink Keywords" size="sm" />
          </div>
          <div className="space-y-2">
            <Label>Default CPC Bid ($)</Label>
            <Input type="number" value={cpcBid} onChange={(e) => setCpcBid(e.target.value)} min="0.01" step="0.01" size="sm" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
