import { PageHeader } from "@/components/shared/PageHeader";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Download, Printer, QrCode } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function CounterDetails() {
  const { counterName } = useParams<{ counterName: string }>();
  const navigate = useNavigate();
  const [staffCount, setStaffCount] = useState(1);
  const [assignedStaff, setAssignedStaff] = useState<{ id: string; name: string }[]>([]);
  const [displayMode, setDisplayMode] = useState(false);

  // Mock dishes data
  const [assignedDishes] = useState([
    { id: "1", name: "Filter Coffee", icon: "☕" },
    { id: "2", name: "Masala Dosa", icon: "🥙" },
    { id: "3", name: "Idli Vada", icon: "🍽️" },
  ]);

  const counterIcons: Record<string, string> = {
    "Main Counter": "🍽️",
    "Chaat Counter": "🥙",
    "Coffee & Tea Counter": "☕",
  };

  const handleSaveChanges = () => {
    toast.success("Counter settings saved successfully");
  };

  const handleDeleteCounter = () => {
    toast.success("Counter deleted successfully");
    navigate("/kitchen-management");
  };

  const removeStaff = (staffId: string) => {
    setAssignedStaff(assignedStaff.filter((s) => s.id !== staffId));
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title={`${counterIcons[counterName || ""] || "🍽️"} ${counterName}`} />
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Section 1: Staff Positions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Staff for this Counter</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="staffCount" className="whitespace-nowrap">Number of staff positions</Label>
              <Input
                id="staffCount"
                type="number"
                min="1"
                max="20"
                value={staffCount}
                onChange={(e) => setStaffCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {Array.from({ length: staffCount }).map((_, index) => {
                const staff = assignedStaff[index];
                return (
                  <Card key={index} className="p-4 border-dashed border-2">
                    {staff ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {staff.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{staff.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeStaff(staff.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-8 text-muted-foreground text-sm">
                        Empty Spot
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <Button variant="link" className="p-0" onClick={() => navigate("/staff-management")}>
              Manage Staff →
            </Button>
          </div>
        </Card>

        {/* Section 2: Connect Staff via QR Code */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Counter Access QR</h2>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
              <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print QR
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Staff can scan this QR in the Staff App to join this counter.
            </p>
          </div>
        </Card>

        {/* Section 3: Dishes served here */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Items</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {assignedDishes.map((dish) => (
              <Card key={dish.id} className="p-4 text-center">
                <div className="text-3xl mb-2">{dish.icon}</div>
                <p className="text-sm font-medium">{dish.name}</p>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add/Remove Items
            </Button>
            <Button variant="outline">
              Reset to AI Suggestions
            </Button>
          </div>
        </Card>

        {/* Section 4: Display Mode Option */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Display Mode</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="space-y-1">
                <div className="font-medium">
                  {displayMode ? "Dedicated Display Mode" : "Mobile KDS Mode"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {displayMode 
                    ? "Orders appear on a dedicated display device" 
                    : "Orders appear on staff mobile phones"}
                </p>
              </div>
              <Switch
                checked={displayMode}
                onCheckedChange={setDisplayMode}
              />
            </div>
            
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              💡 Dedicated Display Mode requires a tablet/display with the staff app installed
            </p>
          </div>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Counter
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the {counterName} and remove all associated staff assignments and dish configurations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCounter}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={handleSaveChanges} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
