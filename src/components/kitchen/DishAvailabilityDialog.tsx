import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DishAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dishName: string;
  currentAvailability: DishAvailability;
  onSave: (availability: DishAvailability) => void;
}

export interface DishAvailability {
  type: "all-day" | "custom";
  morningEnabled?: boolean;
  morningStart?: string;
  morningEnd?: string;
  eveningEnabled?: boolean;
  eveningStart?: string;
  eveningEnd?: string;
}

export function DishAvailabilityDialog({
  open,
  onOpenChange,
  dishName,
  currentAvailability,
  onSave,
}: DishAvailabilityDialogProps) {
  const [availability, setAvailability] = useState<DishAvailability>(currentAvailability);

  const handleSave = () => {
    onSave(availability);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Availability - {dishName}</DialogTitle>
          <DialogDescription>
            Configure when this dish is available to customers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Morning Session */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="morning"
                checked={availability.morningEnabled}
                onCheckedChange={(checked) =>
                  setAvailability({ ...availability, morningEnabled: !!checked })
                }
              />
              <Label htmlFor="morning" className="font-semibold">
                Morning Session
              </Label>
            </div>

            {availability.morningEnabled && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div>
                  <Label className="text-xs">Start Time</Label>
                  <Input
                    type="time"
                    value={availability.morningStart || "08:00"}
                    onChange={(e) =>
                      setAvailability({ ...availability, morningStart: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">End Time</Label>
                  <Input
                    type="time"
                    value={availability.morningEnd || "12:00"}
                    onChange={(e) =>
                      setAvailability({ ...availability, morningEnd: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-sm font-medium text-muted-foreground py-1 border-y">
            BREAK
          </div>

          {/* Evening Session */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="evening"
                checked={availability.eveningEnabled}
                onCheckedChange={(checked) =>
                  setAvailability({ ...availability, eveningEnabled: !!checked })
                }
              />
              <Label htmlFor="evening" className="font-semibold">
                Evening Session
              </Label>
            </div>

            {availability.eveningEnabled && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div>
                  <Label className="text-xs">Start Time</Label>
                  <Input
                    type="time"
                    value={availability.eveningStart || "17:00"}
                    onChange={(e) =>
                      setAvailability({ ...availability, eveningStart: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">End Time</Label>
                  <Input
                    type="time"
                    value={availability.eveningEnd || "22:00"}
                    onChange={(e) =>
                      setAvailability({ ...availability, eveningEnd: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
