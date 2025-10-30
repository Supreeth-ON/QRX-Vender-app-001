import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CounterCardProps {
  icon: string;
  name: string;
  counterId: string;
  isFullWidth?: boolean;
}

export function CounterCard({ icon, name, counterId, isFullWidth }: CounterCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 group border-[3px] hover:border-primary/50 ${
        isFullWidth ? 'col-span-3 aspect-[3/1]' : 'aspect-square'
      }`}
      onClick={() => navigate(`/counter/${encodeURIComponent(name)}`)}
    >
      <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
        <img 
          src={icon} 
          alt={name}
          className="h-12 w-12 md:h-16 md:w-16 object-contain opacity-60"
        />
        <h3 className="font-semibold text-center group-hover:text-primary transition-colors text-sm md:text-base">
          {name}
        </h3>
      </div>
    </Card>
  );
}
