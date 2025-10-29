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
      className="aspect-square cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 group border-2 hover:border-primary/50"
      onClick={() => navigate(`/counter/${encodeURIComponent(name)}`)}
    >
      <div className="flex flex-col items-center justify-center h-full p-2 md:p-4 space-y-1 md:space-y-2">
        <div className="text-3xl md:text-5xl">{icon}</div>
        <h3 className="text-xs md:text-sm lg:text-base font-semibold text-center line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Card>
  );
}
