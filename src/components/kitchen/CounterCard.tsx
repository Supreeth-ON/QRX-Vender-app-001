import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CounterCardProps {
  emoji: string;
  name: string;
  counterId: string;
  isFullWidth?: boolean;
}

export function CounterCard({ emoji, name, counterId, isFullWidth }: CounterCardProps) {
  const navigate = useNavigate();
  const isMainCounter = isFullWidth;

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 group border-[3px] hover:border-primary/50 relative overflow-hidden ${
        isFullWidth ? 'col-span-3 aspect-[3/1]' : 'aspect-square'
      }`}
      onClick={() => navigate(`/counter/${encodeURIComponent(name)}`)}
    >
      {/* Shadow emoji - positioned differently based on counter type */}
      {isMainCounter ? (
        // Main counter: emoji to the left of name
        <div className="flex items-center justify-center h-full p-4 gap-3">
          <span 
            className="text-5xl md:text-6xl opacity-25 grayscale"
            style={{ filter: 'grayscale(100%) opacity(0.25)' }}
          >
            {emoji}
          </span>
          <h3 className="font-semibold text-center group-hover:text-primary transition-colors text-base md:text-lg">
            {name}
          </h3>
        </div>
      ) : (
        // Other counters: emoji behind name (background)
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span 
              className="text-7xl md:text-8xl opacity-25 grayscale"
              style={{ filter: 'grayscale(100%) opacity(0.25)' }}
            >
              {emoji}
            </span>
          </div>
          <div className="relative flex items-center justify-center h-full p-4">
            <h3 className="font-semibold text-center group-hover:text-primary transition-colors text-sm md:text-base z-10">
              {name}
            </h3>
          </div>
        </>
      )}
    </Card>
  );
}
