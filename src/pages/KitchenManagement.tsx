import { PageHeader } from "@/components/shared/PageHeader";
import { CounterCard } from "@/components/kitchen/CounterCard";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

const defaultCounters = [
  { id: "main", name: "Main Counter", icon: "🍽️" },
  { id: "chaat", name: "Chaat Counter", icon: "🥙" },
  { id: "coffee", name: "Coffee & Tea Counter", icon: "☕" },
];

export default function KitchenManagement() {
  const [showAddCounter, setShowAddCounter] = useState(false);

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="Kitchen Management" />
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Manage all service counters</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Food Counters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultCounters.map((counter) => (
            <CounterCard
              key={counter.id}
              icon={counter.icon}
              name={counter.name}
              counterId={counter.id}
            />
          ))}
        </div>
      </div>

      <Button
        onClick={() => setShowAddCounter(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
        title="Add Counter"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
