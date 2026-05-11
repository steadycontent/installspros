import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampaignFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; budget_amount_micros: string; bidding_strategy_type: string }) => void;
}

export function CampaignFormDialog({ open, onOpenChange, onSubmit }: CampaignFormDialogProps) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("50");
  const [biddingStrategy, setBiddingStrategy] = useState("MANUAL_CPC");

  const handleSubmit = () => {
    onSubmit({
      name,
      budget_amount_micros: (parseFloat(budget) * 1_000_000).toString(),
      bidding_strategy_type: biddingStrategy,
    });
    setName("");
    setBudget("50");
    setBiddingStrategy("MANUAL_CPC");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Campaign Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Starlink Install - Dallas" size="sm" />
          </div>
          <div className="space-y-2">
            <Label>Daily Budget ($)</Label>
            <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min="1" step="1" size="sm" />
          </div>
          <div className="space-y-2">
            <Label>Bidding Strategy</Label>
            <Select value={biddingStrategy} onValueChange={setBiddingStrategy}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MANUAL_CPC">Manual CPC</SelectItem>
                <SelectItem value="MAXIMIZE_CLICKS">Maximize Clicks</SelectItem>
                <SelectItem value="MAXIMIZE_CONVERSIONS">Maximize Conversions</SelectItem>
                <SelectItem value="TARGET_CPA">Target CPA</SelectItem>
                <SelectItem value="TARGET_ROAS">Target ROAS</SelectItem>
              </SelectContent>
            </Select>
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
