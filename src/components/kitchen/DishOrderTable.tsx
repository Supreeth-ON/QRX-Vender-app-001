import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, CheckCircle, Clock, ChevronDown, ChevronUp, AlertCircle, Package, TrendingUp, Plus, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { DishAvailabilityDialog, DishAvailability } from "./DishAvailabilityDialog";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: string;
  category: string;
  paused?: boolean;
  type?: "veg" | "non-veg" | "egg";
  availability?: DishAvailability;
}

interface OrderItem extends MenuItem {
  orderId: string;
  orderQty: number;
  status: "pending" | "cooking" | "ready" | "packaged" | "delivered";
  orderTime: Date;
  tableName?: string;
}

interface DishOrderTableProps {
  counterName: string;
}

export function DishOrderTable({ counterName }: DishOrderTableProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAddDish, setShowAddDish] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allDishes, setAllDishes] = useState<MenuItem[]>([]);
  const [dishToDelete, setDishToDelete] = useState<string | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<{ dish: MenuItem; index: number } | null>(null);
  const { toast } = useToast();

  // Load dishes from Menu Management
  useEffect(() => {
    const loadMenuItems = () => {
      const saved = localStorage.getItem("menuItems");
      const counterDishes = localStorage.getItem(`counter_dishes_${counterName}`);
      
      if (saved) {
        const allItems: MenuItem[] = JSON.parse(saved);
        setAllDishes(allItems);
        let filteredItems = allItems;
        
        // If counter has custom dishes assigned, use those
        if (counterDishes) {
          const customDishIds = JSON.parse(counterDishes);
          filteredItems = allItems.filter(item => customDishIds.includes(item.id));
        } else {
          // Auto-assign dishes based on counter type
          if (counterName.toLowerCase().includes("coffee") || counterName.toLowerCase().includes("tea")) {
            filteredItems = allItems.filter(item => 
              item.category === "BEVERAGES"
            );
          } else if (counterName.toLowerCase().includes("snack")) {
            filteredItems = allItems.filter(item => 
              item.category === "SNACKS"
            );
          } else if (counterName.toLowerCase().includes("chaat")) {
            filteredItems = allItems.filter(item => 
              item.category === "SNACKS"
            );
          } else if (counterName.toLowerCase().includes("main")) {
            // Main counter gets main dishes
            filteredItems = allItems.filter(item => 
              !["BEVERAGES", "SNACKS", "DESSERTS"].includes(item.category)
            );
          } else {
            // New counters start empty
            filteredItems = [];
          }
        }
        
        setMenuItems(filteredItems);
      }
    };

    loadMenuItems();

    // Listen for changes in localStorage (when dishes are updated in Menu Management)
    const handleStorageChange = () => {
      loadMenuItems();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [counterName]);

  const handleAddDish = (dish: MenuItem) => {
    const currentDishIds = menuItems.map(item => item.id);
    if (!currentDishIds.includes(dish.id)) {
      const newDishIds = [...currentDishIds, dish.id];
      localStorage.setItem(`counter_dishes_${counterName}`, JSON.stringify(newDishIds));
      setMenuItems([...menuItems, dish]);
      toast({
        title: "Dish added",
        description: `${dish.name} has been added to ${counterName}`,
      });
    }
    setShowAddDish(false);
    setSearchQuery("");
  };

  const handleRemoveDish = (dishId: string) => {
    const dishIds = menuItems.filter(item => item.id !== dishId).map(item => item.id);
    localStorage.setItem(`counter_dishes_${counterName}`, JSON.stringify(dishIds));
    setMenuItems(menuItems.filter(item => item.id !== dishId));
    setDishToDelete(null);
    toast({
      title: "Dish removed",
      description: "The dish has been removed from this counter",
    });
  };

  const handleSaveAvailability = (availability: DishAvailability) => {
    if (!editingAvailability) return;
    
    const updatedItems = [...menuItems];
    updatedItems[editingAvailability.index] = {
      ...updatedItems[editingAvailability.index],
      availability,
    };
    setMenuItems(updatedItems);
    
    // Save to localStorage
    const dishIds = updatedItems.map(item => item.id);
    localStorage.setItem(`counter_dishes_${counterName}`, JSON.stringify(dishIds));
    localStorage.setItem(`dish_availability_${editingAvailability.dish.id}`, JSON.stringify(availability));
    
    toast({
      title: "Availability updated",
      description: `${editingAvailability.dish.name} availability has been updated`,
    });
    setEditingAvailability(null);
  };

  const getDishStatus = (dish: MenuItem) => {
    if (!dish.availability || dish.availability.type === "all-day") {
      return "Active";
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const checkTimeInRange = (start: string, end: string) => {
      const [startHour, startMin] = start.split(":").map(Number);
      const [endHour, endMin] = end.split(":").map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      return currentTime >= startTime && currentTime <= endTime;
    };

    if (dish.availability.morningEnabled && 
        dish.availability.morningStart && 
        dish.availability.morningEnd &&
        checkTimeInRange(dish.availability.morningStart, dish.availability.morningEnd)) {
      return "Active";
    }

    if (dish.availability.eveningEnabled && 
        dish.availability.eveningStart && 
        dish.availability.eveningEnd &&
        checkTimeInRange(dish.availability.eveningStart, dish.availability.eveningEnd)) {
      return "Active";
    }

    return "Break";
  };

  const getAvailabilityDisplay = (dish: MenuItem) => {
    if (!dish.availability || dish.availability.type === "all-day") {
      return "All Day";
    }

    const parts: string[] = [];
    if (dish.availability.morningEnabled && dish.availability.morningStart && dish.availability.morningEnd) {
      parts.push(`${dish.availability.morningStart}-${dish.availability.morningEnd}`);
    }
    if (dish.availability.eveningEnabled && dish.availability.eveningStart && dish.availability.eveningEnd) {
      parts.push(`${dish.availability.eveningStart}-${dish.availability.eveningEnd}`);
    }
    return parts.length > 0 ? parts.join(", ") : "Custom";
  };

  // Simulate some active orders for demo (in production, this would come from real orders)
  useEffect(() => {
    if (menuItems.length > 0) {
      const mockOrders: OrderItem[] = menuItems.slice(0, 5).map((item, index) => ({
        ...item,
        orderId: `ORD${Date.now() + index}`,
        orderQty: Math.floor(Math.random() * 3) + 1,
        status: ["pending", "cooking"][Math.floor(Math.random() * 2)] as "pending" | "cooking",
        orderTime: new Date(Date.now() - Math.random() * 600000), // Random time within last 10 mins
        tableName: `Table ${Math.floor(Math.random() * 20) + 1}`,
      }));
      setOrders(mockOrders);
    }
  }, [menuItems]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "cooking":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "ready":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "packaged":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "delivered":
        return "bg-gray-400 hover:bg-gray-500 text-white";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cooking":
        return <Play className="h-4 w-4" />;
      case "ready":
        return <CheckCircle className="h-4 w-4" />;
      case "packaged":
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTimeSinceOrder = (orderTime: Date) => {
    const diff = Date.now() - orderTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const handleStatusChange = (orderId: string, newStatus: "pending" | "cooking" | "ready" | "packaged" | "delivered") => {
    setOrders(prev => 
      prev.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const toggleRowExpansion = (orderId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Sort orders: pending first, then by time (oldest first)
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return a.orderTime.getTime() - b.orderTime.getTime();
  });

  // Timer to update time display
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => [...prev]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders by tab
  const filteredOrders = activeTab === "all" 
    ? sortedOrders 
    : sortedOrders.filter(order => {
        if (activeTab === "pending") return order.status === "pending";
        if (activeTab === "in-progress") return order.status === "cooking";
        if (activeTab === "ready") return order.status === "ready" || order.status === "packaged";
        if (activeTab === "completed") return order.status === "delivered";
        return true;
      });

  // Count orders by status
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const inProgressCount = orders.filter(o => o.status === "cooking").length;
  const readyCount = orders.filter(o => o.status === "ready" || o.status === "packaged").length;
  const completedCount = orders.filter(o => o.status === "delivered").length;

  // Calculate metrics
  const activeOrdersCount = orders.filter(o => o.status !== "delivered").length;
  const avgCookingTime = orders.length > 0 
    ? Math.floor(orders.reduce((sum, o) => sum + (Date.now() - o.orderTime.getTime()), 0) / orders.length / 60000)
    : 0;
  const completedToday = completedCount;
  
  // Find peak dish
  const dishCounts = orders.reduce((acc, order) => {
    acc[order.name] = (acc[order.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const peakDish = Object.entries(dishCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  // Check for delayed orders (more than prep time + 5 minutes)
  const delayedOrders = orders.filter(order => {
    if (order.status === "delivered") return false;
    const elapsedMinutes = (Date.now() - order.orderTime.getTime()) / 60000;
    return elapsedMinutes > (order.prepTime + 5);
  });

  return (
    <div className="space-y-4">
      {/* Micro Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrdersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Cook Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCookingTime}m</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Peak Dish
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold truncate">{peakDish}</div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Alerts */}
      {delayedOrders.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {delayedOrders.length} order(s) delayed! Order #{delayedOrders[0].orderId.slice(-4)} is {Math.floor((Date.now() - delayedOrders[0].orderTime.getTime()) / 60000)}m overdue.
          </AlertDescription>
        </Alert>
      )}

      {pendingCount > 10 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Large queue alert: {pendingCount} pending orders in this counter.
          </AlertDescription>
        </Alert>
      )}

      {/* Order Queue Tabs */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-semibold">Live Order Queue</h3>
          <p className="text-sm text-muted-foreground">Real-time order tracking & management</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="all" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              All Orders {orders.length > 0 && <Badge variant="secondary" className="ml-2">{orders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Pending {pendingCount > 0 && <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger 
              value="in-progress"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              In Progress {inProgressCount > 0 && <Badge className="ml-2 bg-yellow-500">{inProgressCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger 
              value="ready"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Ready {readyCount > 0 && <Badge className="ml-2 bg-green-500">{readyCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Completed {completedCount > 0 && <Badge variant="secondary" className="ml-2">{completedCount}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="overflow-x-auto">
              <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12"></TableHead>
                <TableHead className="min-w-[150px]">Dish Name</TableHead>
                <TableHead className="w-24">Qty</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-24">Time</TableHead>
                <TableHead className="w-28">Table</TableHead>
                <TableHead className="min-w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No active orders. Waiting for orders...
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <>
                    <TableRow
                      key={order.orderId}
                      className={cn(
                        "cursor-pointer transition-colors",
                        order.status === "pending" && "bg-red-50 dark:bg-red-950/20",
                        order.status === "cooking" && "bg-yellow-50 dark:bg-yellow-950/20",
                        order.status === "ready" && "bg-green-50 dark:bg-green-950/20"
                      )}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(order.orderId)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedRows.has(order.orderId) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {order.type && (
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                order.type === "veg" && "bg-green-500",
                                order.type === "non-veg" && "bg-red-500",
                                order.type === "egg" && "bg-yellow-500"
                              )}
                            />
                          )}
                          <span className="truncate">{order.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold">
                          {order.orderQty}x
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("gap-1 text-xs", getStatusColor(order.status))}>
                          {getStatusIcon(order.status)}
                          {order.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {getTimeSinceOrder(order.orderTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{order.tableName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusChange(order.orderId, "cooking")}
                              className="text-xs h-7 bg-yellow-600 hover:bg-yellow-700"
                            >
                              Start
                            </Button>
                          )}
                          {order.status === "cooking" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusChange(order.orderId, "ready")}
                              className="text-xs h-7 bg-green-600 hover:bg-green-700"
                            >
                              Done
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusChange(order.orderId, "packaged")}
                              className="text-xs h-7 bg-blue-600 hover:bg-blue-700"
                            >
                              <Package className="h-3 w-3 mr-1" />
                              Package
                            </Button>
                          )}
                          {order.status === "packaged" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusChange(order.orderId, "delivered")}
                              className="text-xs h-7 bg-gray-600 hover:bg-gray-700"
                            >
                              Complete
                            </Button>
                          )}
                          {order.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(order.orderId, "pending")}
                              className="text-xs h-7"
                            >
                              Hold
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(order.orderId) && (
                      <TableRow className="bg-muted/20">
                        <TableCell colSpan={7} className="py-4">
                          <div className="flex gap-4 items-start">
                            {order.image && (
                              <img
                                src={order.image}
                                alt={order.name}
                                className="w-24 h-24 object-cover rounded-md border"
                              />
                            )}
                            <div className="flex-1 space-y-2">
                              <p className="text-sm text-muted-foreground">{order.description}</p>
                              <div className="flex gap-4 text-sm">
                                <span>
                                  <strong>Price:</strong> ₹{order.price}
                                </span>
                                <span>
                                  <strong>Est. Prep:</strong> {order.prepTime} min
                                </span>
                                <span>
                                  <strong>Order ID:</strong> {order.orderId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* All Available Dishes */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Available Dishes ({menuItems.length})</h3>
            <p className="text-sm text-muted-foreground">Synced from Menu Management</p>
          </div>
          <Button size="sm" onClick={() => setShowAddDish(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Dish
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12"></TableHead>
                <TableHead>Dish Name</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Prep Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No dishes assigned to this counter yet. Click "Add Dish" to add dishes.
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDishToDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.type && (
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              item.type === "veg" && "bg-green-500",
                              item.type === "non-veg" && "bg-red-500",
                              item.type === "egg" && "bg-yellow-500"
                            )}
                          />
                        )}
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary hover:text-primary/80"
                        onClick={() => setEditingAvailability({ dish: item, index })}
                      >
                        {getAvailabilityDisplay(item)}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.category}
                    </TableCell>
                    <TableCell>{item.prepTime} min</TableCell>
                    <TableCell>
                      <Badge
                        variant={getDishStatus(item) === "Active" ? "default" : "secondary"}
                        className={cn(
                          getDishStatus(item) === "Active" 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-yellow-500 hover:bg-yellow-600"
                        )}
                      >
                        {getDishStatus(item)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Dish Dialog */}
      <Dialog open={showAddDish} onOpenChange={setShowAddDish}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Dish to {counterName}</DialogTitle>
            <DialogDescription>
              Search and select a dish from your menu to add to this counter
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-[400px] overflow-y-auto border rounded-lg">
              {allDishes
                .filter(dish => 
                  !menuItems.find(item => item.id === dish.id) &&
                  (searchQuery === "" || 
                   dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   dish.category.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(dish => (
                  <div
                    key={dish.id}
                    className="p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer flex items-center justify-between"
                    onClick={() => handleAddDish(dish)}
                  >
                    <div className="flex items-center gap-3">
                      {dish.type && (
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            dish.type === "veg" && "bg-green-500",
                            dish.type === "non-veg" && "bg-red-500",
                            dish.type === "egg" && "bg-yellow-500"
                          )}
                        />
                      )}
                      <div>
                        <p className="font-medium">{dish.name}</p>
                        <p className="text-sm text-muted-foreground">{dish.category}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Add
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!dishToDelete} onOpenChange={() => setDishToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Dish?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this dish from {counterName}? This will not delete the dish from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => dishToDelete && handleRemoveDish(dishToDelete)}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dish Availability Dialog */}
      {editingAvailability && (
        <DishAvailabilityDialog
          open={!!editingAvailability}
          onOpenChange={(open) => !open && setEditingAvailability(null)}
          dishName={editingAvailability.dish.name}
          currentAvailability={editingAvailability.dish.availability || { type: "all-day" }}
          onSave={handleSaveAvailability}
        />
      )}
    </div>
  );
}
