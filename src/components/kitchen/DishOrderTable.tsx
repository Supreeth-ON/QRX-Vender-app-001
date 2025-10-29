import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, CheckCircle, Clock, ChevronDown, ChevronUp, AlertCircle, Package, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Load dishes from Menu Management
  useEffect(() => {
    const loadMenuItems = () => {
      const saved = localStorage.getItem("menuItems");
      if (saved) {
        const items: MenuItem[] = JSON.parse(saved);
        
        // Filter dishes based on counter type
        let filteredItems = items;
        if (counterName.toLowerCase().includes("coffee") || counterName.toLowerCase().includes("tea")) {
          filteredItems = items.filter(item => 
            item.category === "BEVERAGES" || item.category === "DESSERTS"
          );
        } else if (counterName.toLowerCase().includes("chaat")) {
          filteredItems = items.filter(item => 
            item.category === "SNACKS"
          );
        } else {
          // Main counter gets everything except beverages
          filteredItems = items.filter(item => 
            item.category !== "BEVERAGES" && item.category !== "SNACKS"
          );
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
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-semibold">Available Dishes ({menuItems.length})</h3>
          <p className="text-sm text-muted-foreground">Synced from Menu Management</p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Dish Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Prep Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No dishes assigned to this counter yet. Add dishes in Menu Management.
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((item) => (
                  <TableRow key={item.id}>
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
                    <TableCell className="text-sm text-muted-foreground">
                      {item.category}
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>{item.prepTime} min</TableCell>
                    <TableCell>
                      {item.paused ? (
                        <Badge variant="destructive" className="text-xs">Paused</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
