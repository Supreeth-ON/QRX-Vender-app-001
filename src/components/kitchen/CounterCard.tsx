import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CounterCardProps {
  icon: string;
  name: string;
  counterId: string;
}

export function CounterCard({ icon, name, counterId }: CounterCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
      onClick={() => navigate(`/counter/${encodeURIComponent(name)}`)}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-5xl">{icon}</div>
        <h3 className="text-lg font-semibold text-center">{name}</h3>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Card>
  );
}
