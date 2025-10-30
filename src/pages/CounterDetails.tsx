import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, QrCode, Download, Share2, Utensils, Save, Trash2, X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";
import { DishOrderTable } from "@/components/kitchen/DishOrderTable";
import { cn } from "@/lib/utils";

export default function CounterDetails() {
  const { counterName } = useParams<{ counterName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [staffCount, setStaffCount] = useState(1);
  const [assignedStaff, setAssignedStaff] = useState<{ id: string; name: string }[]>([]);
  const [displayMode, setDisplayMode] = useState(false);
  const [mobileKDSMode, setMobileKDSMode] = useState(true);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentTab, setCurrentTab] = useState("orders");

  // Mock dishes data
  const [assignedDishes] = useState([
    { id: "1", name: "Filter Coffee", icon: "☕" },
    { id: "2", name: "Masala Dosa", icon: "🥙" },
    { id: "3", name: "Idli Vada", icon: "🍽️" },
  ]);

  const counterImages: Record<string, string> = {
    "Main Counter": "/images/counter-main.png",
    "Snacks Counter": "/images/counter-snacks.png",
    "Coffee/Tea Counter": "/images/counter-coffee.png",
  };

  const counterImage = counterImages[counterName || ""] || "/images/counter-main.png";

  const handleSaveChanges = () => {
    setHasChanges(false);
    toast({
      title: "Settings saved",
      description: "Counter settings have been saved successfully.",
    });
  };

  // Track changes
  useEffect(() => {
    const timeout = setTimeout(() => setHasChanges(true), 500);
    return () => clearTimeout(timeout);
  }, [staffCount, displayMode, mobileKDSMode, assignedStaff]);

  const handleDeleteCounter = () => {
    toast({
      title: "Counter deleted",
      description: "Counter has been deleted successfully.",
    });
    navigate("/kitchen-management");
  };

  const removeStaff = (staffId: string) => {
    setAssignedStaff(assignedStaff.filter((s) => s.id !== staffId));
  };

  const handleGenerateQR = () => {
    setQrCodeGenerated(true);
    toast({
      title: "QR Code Generated",
      description: "Counter access QR code has been generated successfully.",
    });
  };

  const handleRegenerateQR = () => {
    setQrCodeGenerated(true);
    setShowRegenerateDialog(false);
    toast({
      title: "QR Code Regenerated",
      description: "New QR code generated. Previous QR code is now void.",
    });
  };

  const handleShareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${counterName} Access QR`,
          text: `Scan this QR code to access ${counterName}`,
        });
      } catch (err) {
        toast({
          title: "Share cancelled",
          description: "QR code sharing was cancelled.",
        });
      }
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support sharing.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/kitchen-management")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src={counterImage} 
              alt={counterName || "Counter"} 
              className="h-8 w-8 md:h-10 md:w-10 object-contain"
            />
            <h1 className="text-xl md:text-2xl font-bold text-primary">{counterName}</h1>
          </div>
        </div>
      </div>
      
      {/* Tabs for Orders and Settings */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="p-4 md:p-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
          <TabsTrigger value="orders" className="gap-2">
            <Utensils className="h-4 w-4" />
            Orders & Dishes
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Users className="h-4 w-4" />
            Counter Setup
          </TabsTrigger>
        </TabsList>

        {/* Orders & Dishes Tab */}
        <TabsContent value="orders" className="space-y-6">
          <DishOrderTable counterName={counterName || ""} />
        </TabsContent>

        {/* Counter Setup Tab */}
        <TabsContent value="settings" className="space-y-6 max-w-4xl mx-auto">
          {/* Section 1: Staff Positions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Staffs behind this Counter</h2>
            
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
                    <Card key={index} className={`p-4 border-dashed border-2 ${
                      staff ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'
                    }`}>
                      {staff ? (
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-green-600/20 flex items-center justify-center text-sm font-medium text-green-700">
                                {staff.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-green-700">{staff.name}</span>
                            </div>
                            <span className="text-xs text-green-600 ml-10">Occupied</span>
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
                        <div className="flex items-center justify-center h-8 text-yellow-700 text-sm font-medium">
                          Vacant
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 max-w-md">
                <Button variant="link" className="p-0 justify-start" onClick={() => navigate("/staff-management")}>
                  Manage Staff →
                </Button>
                <Button variant="link" className="p-0 justify-start gap-2" onClick={() => navigate("/staff-management")}>
                  <History className="h-4 w-4" />
                  Occupancy History →
                </Button>
              </div>
            </div>
          </Card>

          {/* Section 2: Connect Staff via QR Code */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-primary">Counter Access QR</h2>
            
            <div className="flex flex-col items-center space-y-4">
              {!qrCodeGenerated ? (
                <Button onClick={handleGenerateQR} className="mb-4">
                  Generate QR Code
                </Button>
              ) : (
                <>
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary">
                    <QrCode className="h-24 w-24 text-primary" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShareQR}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => setShowRegenerateDialog(true)}
                  >
                    ReGenerate QR
                  </Button>
                </>
              )}
              
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Staff can scan this QR in the Staff App to join this counter.
              </p>
            </div>
          </Card>

          {/* ReGenerate QR Warning Dialog */}
          <AlertDialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate QR Code?</AlertDialogTitle>
                <AlertDialogDescription>
                  New QR will VOID existing QR code from its functions. Are you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction onClick={handleRegenerateQR}>
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Section 3: Display Mode Option */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Display Mode</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                  <div className="font-medium">Mobile KDS Mode</div>
                  <p className="text-sm text-muted-foreground">
                    Orders appear on staff mobile phones
                  </p>
                </div>
                <Switch
                  checked={mobileKDSMode}
                  onCheckedChange={setMobileKDSMode}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                  <div className="font-medium">Dedicated Display Mode</div>
                  <p className="text-sm text-muted-foreground">
                    Orders appear on a dedicated display device
                  </p>
                </div>
                <Switch
                  checked={displayMode}
                  onCheckedChange={setDisplayMode}
                />
              </div>
              
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                💡 Both modes can work simultaneously. Dedicated Display Mode requires a tablet/display with the staff app installed.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Action Bar */}
      {currentTab === "settings" && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 flex gap-3 z-20 shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-2 justify-center w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
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

            <Button 
              onClick={handleSaveChanges} 
              className={cn(
                "gap-2",
                hasChanges && "animate-pulse ring-2 ring-primary"
              )}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
      
      {currentTab === "orders" && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 flex gap-3 z-20 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-center w-full">
            <Button 
              onClick={handleSaveChanges} 
              className={cn(
                "gap-2",
                hasChanges && "animate-pulse ring-2 ring-primary"
              )}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
