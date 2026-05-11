import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface BudgetEditPopoverProps {
  currentBudgetMicros: string;
  onSave: (budgetMicros: string) => void;
}

export function BudgetEditPopover({ currentBudgetMicros, onSave }: BudgetEditPopoverProps) {
  const currentDollars = (parseInt(currentBudgetMicros) / 1_000_000).toFixed(2);
  const [value, setValue] = useState(currentDollars);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    const micros = (parseFloat(value) * 1_000_000).toString();
    onSave(micros);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="font-mono">
          ${currentDollars}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-3">
          <Label>Daily Budget</Label>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="0.01"
              min="0"
              size="sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
