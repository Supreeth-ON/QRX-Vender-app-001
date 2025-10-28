import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const recentOrders = [
  { token: "025", items: "2x Masala Dosa, 1x Filter Coffee", time: "2 mins ago", status: "completed" },
  { token: "024", items: "3x Idli, 2x Vada", time: "5 mins ago", status: "completed" },
  { token: "023", items: "1x Rava Dosa, 1x Sambar", time: "8 mins ago", status: "completed" },
  { token: "022", items: "2x Coffee, 1x Kesari Bath", time: "12 mins ago", status: "completed" },
];

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentOrders.map((order) => (
          <div 
            key={order.token}
            className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">Token #{order.token}</span>
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                  Completed
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{order.items}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{order.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
