import { PageHeader } from "@/components/shared/PageHeader";
import { CounterCard } from "@/components/kitchen/CounterCard";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed, Coffee, Pizza, IceCream, ChefHat, Soup, Sandwich } from "lucide-react";
import { useState } from "react";

const defaultCounters = [
  { id: "main", name: "Main Counter", icon: "/images/counter-main.png", isFullWidth: true },
  { id: "snacks", name: "Snacks Counter", icon: "/images/counter-snacks.png" },
  { id: "coffee", name: "Coffee/Tea Counter", icon: "/images/counter-coffee.png" },
];

export default function KitchenManagement() {
  const [showAddCounter, setShowAddCounter] = useState(false);

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="Kitchen Management" />
      
      <div className="p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-center uppercase tracking-wide text-primary">Food Counters</h2>
        </div>

        {/* Mobile-First Grid Layout with Full-Width Main Counter */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
          {defaultCounters.map((counter) => (
            <CounterCard
              key={counter.id}
              icon={counter.icon}
              name={counter.name}
              counterId={counter.id}
              isFullWidth={counter.isFullWidth}
            />
          ))}
          
          {/* Add Counter Button */}
          <div
            onClick={() => setShowAddCounter(true)}
            className="aspect-square cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 group border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-lg flex items-center justify-center bg-muted/20"
          >
            <Plus className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
