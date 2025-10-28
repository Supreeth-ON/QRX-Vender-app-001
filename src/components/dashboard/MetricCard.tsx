import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "accent";
}

export function MetricCard({ title, value, icon: Icon, variant = "default" }: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-success/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "accent":
        return "border-accent/20 bg-accent/5";
      default:
        return "border-border bg-card";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "accent":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`transition-all hover:shadow-lg ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${getIconStyles()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
