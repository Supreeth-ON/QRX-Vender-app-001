import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

interface OrderCardProps {
  tokenNumber: string;
  items: OrderItem[];
  timeRemaining: number;
  status: "preparing" | "ready";
  onMarkReady?: () => void;
}

export function OrderCard({ tokenNumber, items, timeRemaining, status, onMarkReady }: OrderCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="transition-all hover:shadow-md border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">Token #{tokenNumber}</h3>
            <div className="flex items-center gap-2 mt-1">
              {status === "preparing" ? (
                <>
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">
                    {formatTime(timeRemaining)}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Ready</span>
                </>
              )}
            </div>
          </div>
          <Badge variant={status === "preparing" ? "default" : "secondary"}>
            {status === "preparing" ? "In Progress" : "Ready"}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          {items.map((item, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">{item.quantity}x</span> {item.name}
              {item.notes && (
                <p className="text-xs text-muted-foreground ml-6 mt-1">
                  Note: {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {status === "preparing" && onMarkReady && (
          <Button
            onClick={onMarkReady}
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
            size="sm"
          >
            Mark as Ready
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
