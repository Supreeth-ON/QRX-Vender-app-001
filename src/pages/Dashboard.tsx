import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, CheckCircle } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  tokenNumber: string;
  items: OrderItem[];
  timeRemaining: number;
  status: "preparing" | "ready";
}

export default function Dashboard() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([
    {
      id: "1",
      tokenNumber: "021",
      items: [
        { name: "Masala Dosa", quantity: 1, notes: "Extra spicy" },
        { name: "Idli", quantity: 2, notes: "Sambar in separate cups" },
      ],
      timeRemaining: 420,
      status: "preparing",
    },
    {
      id: "2",
      tokenNumber: "022",
      items: [
        { name: "Filter Coffee", quantity: 2 },
        { name: "Vada", quantity: 3 },
      ],
      timeRemaining: 180,
      status: "preparing",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrders((orders) =>
        orders.map((order) =>
          order.timeRemaining > 0
            ? { ...order, timeRemaining: order.timeRemaining - 1 }
            : order
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkReady = (orderId: string) => {
    setActiveOrders((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "ready" as const } : order
      )
    );
  };

  const todayOrders = 142;
  const inProgress = activeOrders.filter((o) => o.status === "preparing").length;
  const completed = 128;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Dashboard Overview" />
      
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Today's Orders"
            value={todayOrders}
            icon={ShoppingBag}
            variant="default"
          />
          <MetricCard
            title="In Progress"
            value={inProgress}
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title="Completed"
            value={completed}
            icon={CheckCircle}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnalyticsChart />
          <RecentOrders />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Active Orders Countdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                tokenNumber={order.tokenNumber}
                items={order.items}
                timeRemaining={order.timeRemaining}
                status={order.status}
                onMarkReady={() => handleMarkReady(order.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
