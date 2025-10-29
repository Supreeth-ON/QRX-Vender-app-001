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
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 group border-2 hover:border-primary/50 ${
        isFullWidth ? 'col-span-3 aspect-[3/1]' : 'aspect-square'
      }`}
      onClick={() => navigate(`/counter/${encodeURIComponent(name)}`)}
    >
      <div className={`flex items-center justify-center h-full p-2 md:p-4 ${
        isFullWidth ? 'flex-row gap-3 md:gap-4' : 'flex-col space-y-1 md:space-y-2'
      }`}>
        <img 
          src={icon} 
          alt={name}
          className={`object-contain ${
            isFullWidth ? 'h-12 w-12 md:h-16 md:w-16' : 'h-10 w-10 md:h-14 md:w-14'
          }`}
        />
        <h3 className={`font-semibold text-center group-hover:text-primary transition-colors ${
          isFullWidth ? 'text-base md:text-xl' : 'text-xs md:text-sm lg:text-base line-clamp-2'
        }`}>
          {name}
        </h3>
        <ChevronRight className={`text-muted-foreground group-hover:text-primary transition-colors ${
          isFullWidth ? 'h-5 w-5 md:h-6 md:w-6 ml-auto' : 'h-3 w-3 md:h-4 md:w-4'
        }`} />
      </div>
    </Card>
  );
}
