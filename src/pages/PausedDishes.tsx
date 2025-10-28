import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pause, Play, Settings, Calendar, Home, ChevronRight, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: string;
  category: string;
  paused?: boolean;
}

interface PauseSchedule {
  type: 'none' | 'daily' | 'hourly' | 'weekly' | 'monthly' | 'specific-date';
  pauseTime?: string;
  unpauseTime?: string;
  specificDate?: string;
  daysOfWeek?: string[];
  dayOfMonth?: number;
}

interface PausedDishSchedule {
  dishId: string;
  schedule: PauseSchedule;
}

interface UnpausedHistory {
  id: string;
  dishName: string;
  dishImage: string;
  timestamp: number;
}

// Reference dishes for educational purposes
const referenceDishes: MenuItem[] = [
  {
    id: "ref-1",
    name: "Masala Dosa (Reference Example)",
    description: "This is a reference dish to show how paused items appear",
    price: 120,
    prepTime: 7,
    image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg",
    category: "DOSA VARIETIES",
    paused: true,
  },
];

export default function PausedDishes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("menuItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [schedules, setSchedules] = useState<PausedDishSchedule[]>(() => {
    const saved = localStorage.getItem("pauseSchedules");
    return saved ? JSON.parse(saved) : [];
  });
  const [unpausedHistory, setUnpausedHistory] = useState<UnpausedHistory[]>(() => {
    const saved = localStorage.getItem("unpausedHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [currentEditingDish, setCurrentEditingDish] = useState<string | null>(null);
  const [currentSchedule, setCurrentSchedule] = useState<PauseSchedule>({
    type: 'none',
  });
  const [animatingDishId, setAnimatingDishId] = useState<string | null>(null);

  // Save schedules to localStorage
  useEffect(() => {
    localStorage.setItem("pauseSchedules", JSON.stringify(schedules));
  }, [schedules]);

  // Save unpausedHistory to localStorage
  useEffect(() => {
    localStorage.setItem("unpausedHistory", JSON.stringify(unpausedHistory));
  }, [unpausedHistory]);

  // Get paused dishes only
  const pausedDishes = menuItems.filter(item => item.paused);
  
  // Combine reference and actual paused dishes
  const allPausedDishes = [...referenceDishes, ...pausedDishes];
  
  // Group dishes by category
  const groupedDishes = allPausedDishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleUnpause = (dishId: string) => {
    if (dishId.startsWith('ref-')) {
      toast({
        title: "Reference Dish",
        description: "This is a reference dish for educational purposes only.",
        variant: "default",
      });
      return;
    }

    const dish = menuItems.find(item => item.id === dishId);
    if (!dish) return;

    // Start animation
    setAnimatingDishId(dishId);

    // After animation, update state
    setTimeout(() => {
      const updatedItems = menuItems.map(item =>
        item.id === dishId ? { ...item, paused: false } : item
      );
      setMenuItems(updatedItems);
      // Save to localStorage
      localStorage.setItem("menuItems", JSON.stringify(updatedItems));
      
      // Add to history
      setUnpausedHistory(prev => [{
        id: dishId,
        dishName: dish.name,
        dishImage: dish.image,
        timestamp: Date.now(),
      }, ...prev]);
      
      // Remove schedule when manually unpaused
      setSchedules(prev => prev.filter(s => s.dishId !== dishId));
      
      setAnimatingDishId(null);
      
      toast({
        title: "Dish Active Online",
        description: `${dish.name} is now available in your menu.`,
      });
    }, 1000);
  };

  const handleRePause = (dishId: string) => {
    const historyItem = unpausedHistory.find(item => item.id === dishId);
    if (!historyItem) return;

    const updatedItems = menuItems.map(item =>
      item.id === dishId ? { ...item, paused: true } : item
    );
    setMenuItems(updatedItems);
    localStorage.setItem("menuItems", JSON.stringify(updatedItems));
    
    // Remove from history
    setUnpausedHistory(prev => prev.filter(item => item.id !== dishId));
    
    toast({
      title: "Dish Paused",
      description: `${historyItem.dishName} has been paused again.`,
    });
  };

  const handleOpenSettings = (dishId: string) => {
    if (dishId.startsWith('ref-')) {
      toast({
        title: "Reference Dish",
        description: "This is a reference dish for educational purposes only.",
        variant: "default",
      });
      return;
    }

    setCurrentEditingDish(dishId);
    const existingSchedule = schedules.find(s => s.dishId === dishId);
    setCurrentSchedule(existingSchedule?.schedule || { type: 'none' });
    setSettingsDialogOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!currentEditingDish) return;

    setSchedules(prev => {
      const filtered = prev.filter(s => s.dishId !== currentEditingDish);
      if (currentSchedule.type !== 'none') {
        return [...filtered, { dishId: currentEditingDish, schedule: currentSchedule }];
      }
      return filtered;
    });

    setSettingsDialogOpen(false);
    toast({
      title: "Schedule Saved",
      description: "Auto pause/unpause schedule has been configured.",
    });
  };

  const getScheduleInfo = (dishId: string) => {
    const schedule = schedules.find(s => s.dishId === dishId);
    if (!schedule || schedule.schedule.type === 'none') return null;

    switch (schedule.schedule.type) {
      case 'daily':
        return `Daily: ${schedule.schedule.pauseTime} - ${schedule.schedule.unpauseTime}`;
      case 'hourly':
        return `Hourly automation active`;
      case 'weekly':
        return `Weekly: ${schedule.schedule.daysOfWeek?.join(', ')}`;
      case 'monthly':
        return `Monthly: Day ${schedule.schedule.dayOfMonth}`;
      case 'specific-date':
        return `Scheduled for: ${schedule.schedule.specificDate}`;
      default:
        return null;
    }
  };

  const handleDeleteHistory = (id: string) => {
    setUnpausedHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "History deleted",
      description: "History item has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image with Navigation */}
      <div className="relative w-full h-[200px] sm:h-[250px]">
        <img
          src="/images/rameshwaram-cafe-hero.jpg"
          alt="Rameshwaram Cafe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Rameshwaram Cafe
          </h1>
          <div className="flex items-center gap-2 text-white/90">
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm sm:text-base">Menu Management</span>
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-sm sm:text-base font-medium">Paused Dishes</span>
          </div>
        </div>

        {/* Back Arrow - Bottom Left */}
        <Button
          onClick={() => navigate("/menu")}
          variant="ghost"
          size="icon"
          className="absolute bottom-4 left-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-2 sm:px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold text-primary">
            Total Paused Dishes: {pausedDishes.length}
          </div>
        </div>

        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="about" className="border border-blue-200 rounded-lg bg-blue-50">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <h3 className="font-semibold text-blue-900">About Paused Dishes</h3>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <p className="text-sm text-blue-800">
                Manage dishes that are temporarily unavailable. Set up automatic pause/unpause schedules for dishes that have limited availability.
                The reference dish below is an example to help you understand the feature.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {Object.keys(groupedDishes).length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm border">
            <Pause className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Paused Dishes</h3>
            <p className="text-muted-foreground mb-4">
              Dishes you pause will appear here with scheduling options.
            </p>
            <Button variant="outline" onClick={() => navigate('/my-dishes')}>
              Go to My Dishes
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedDishes).map(([category, dishes]) => (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="border-l-2 border-primary pl-3 py-1">
                  <h3 className="text-base font-semibold text-primary">{category}</h3>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Dish Name</TableHead>
                        <TableHead className="w-[150px]">Unpause</TableHead>
                        <TableHead className="w-[120px]">Image</TableHead>
                        <TableHead className="w-[100px]">Settings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dishes.map((dish) => {
                        const isReference = dish.id.startsWith('ref-');
                        const scheduleInfo = getScheduleInfo(dish.id);
                        const isAnimating = animatingDishId === dish.id;
                        
                        return (
                          <TableRow
                            key={dish.id}
                            className={`${
                              isReference ? 'bg-amber-50/50' : ''
                            } ${isAnimating ? 'animate-slide-out-down' : ''}`}
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-semibold">{dish.name}</div>
                                {isReference && (
                                  <p className="text-xs text-amber-600 font-medium">
                                    For Reference Only
                                  </p>
                                )}
                                {scheduleInfo && (
                                  <p className="text-xs text-blue-600 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {scheduleInfo}
                                  </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                  ₹{dish.price} • {dish.prepTime} min
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                                onClick={() => handleUnpause(dish.id)}
                                disabled={isAnimating}
                              >
                                <Play className="h-4 w-4" />
                                Unpause
                              </Button>
                            </TableCell>
                            <TableCell>
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-16 h-16 rounded-md object-cover border-2 border-border"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenSettings(dish.id)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unpaused History Section */}
        {unpausedHistory.length > 0 && (
          <div className="mt-12 space-y-4">
            <div className="border-l-2 border-green-500 pl-3 py-1">
              <h3 className="text-base font-semibold text-green-700">Active Dishes History</h3>
            </div>

            <div className="overflow-x-auto rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dish Name</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                    <TableHead className="w-[120px]">Image</TableHead>
                    <TableHead className="w-[200px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unpausedHistory.map((item) => (
                    <TableRow key={item.id} className="bg-green-50/30">
                      <TableCell>
                        <div className="font-semibold">{item.dishName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRePause(item.id)}
                            className="gap-2 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                          >
                            <Pause className="h-4 w-4" />
                            Re-Pause
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteHistory(item.id)}
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <img
                          src={item.dishImage}
                          alt={item.dishName}
                          className="w-16 h-16 rounded-md object-cover border-2 border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          Dish Active Online
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Auto Pause/Unpause Schedule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Schedule Type</Label>
              <Select
                value={currentSchedule.type}
                onValueChange={(value) => setCurrentSchedule({ type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Schedule</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="specific-date">Specific Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentSchedule.type === 'daily' && (
              <>
                <div className="space-y-2">
                  <Label>Pause Time</Label>
                  <Input
                    type="time"
                    value={currentSchedule.pauseTime || ''}
                    onChange={(e) => setCurrentSchedule({ ...currentSchedule, pauseTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unpause Time</Label>
                  <Input
                    type="time"
                    value={currentSchedule.unpauseTime || ''}
                    onChange={(e) => setCurrentSchedule({ ...currentSchedule, unpauseTime: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentSchedule.type === 'specific-date' && (
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Input
                  type="date"
                  value={currentSchedule.specificDate || ''}
                  onChange={(e) => setCurrentSchedule({ ...currentSchedule, specificDate: e.target.value })}
                />
              </div>
            )}

            {currentSchedule.type === 'monthly' && (
              <div className="space-y-2">
                <Label>Day of Month</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={currentSchedule.dayOfMonth || ''}
                  onChange={(e) => setCurrentSchedule({ ...currentSchedule, dayOfMonth: parseInt(e.target.value) })}
                />
              </div>
            )}

            <div className="pt-4 space-y-2">
              <Button onClick={handleSaveSchedule} className="w-full">
                Save Schedule
              </Button>
              <Button variant="outline" onClick={() => setSettingsDialogOpen(false)} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
