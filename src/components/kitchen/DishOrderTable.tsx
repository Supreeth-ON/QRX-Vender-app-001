import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
  status: "pending" | "cooking" | "ready" | "delivered";
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

  const handleStatusChange = (orderId: string, newStatus: "pending" | "cooking" | "ready" | "delivered") => {
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

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-semibold">Active Orders ({orders.length})</h3>
          <p className="text-sm text-muted-foreground">Real-time order tracking</p>
        </div>
        
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
              {sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No active orders. Waiting for orders...
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order) => (
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
                              onClick={() => handleStatusChange(order.orderId, "delivered")}
                              className="text-xs h-7 bg-gray-600 hover:bg-gray-700"
                            >
                              Deliver
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
