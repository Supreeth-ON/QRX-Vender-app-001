import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CounterCard } from "@/components/kitchen/CounterCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function KitchenManagement() {
  const [counters, setCounters] = useState([
    { id: "1", name: "Main Counter", icon: "/images/counter-main.png", isFullWidth: true },
    { id: "2", name: "Snacks Counter", icon: "/images/counter-snacks.png" },
    { id: "3", name: "Tea & Coffee Counter", icon: "/images/counter-coffee.png" },
  ]);

  const [isAddingCounter, setIsAddingCounter] = useState(false);
  const [newCounterName, setNewCounterName] = useState("");

  const handleAddCounter = () => {
    if (newCounterName.trim()) {
      const newCounter = {
        id: String(Date.now()),
        name: newCounterName.trim(),
        icon: "/images/counter-main.png", // Default icon
        isFullWidth: false
      };
      setCounters([...counters, newCounter]);
      setNewCounterName("");
      setIsAddingCounter(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="Kitchen Management" />
      
      <div className="p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-center uppercase tracking-wide text-primary">Food Counters</h2>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-24">
          {counters.map((counter) => (
            <CounterCard 
              key={counter.id}
              icon={counter.icon}
              name={counter.name}
              counterId={counter.id}
              isFullWidth={counter.isFullWidth}
            />
          ))}
          
          {/* Add Counter Button */}
          {isAddingCounter ? (
            <Card className="aspect-square border-2 border-dashed border-primary flex flex-col items-center justify-center p-4 gap-2">
              <Input
                placeholder="Counter name"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCounter()}
                className="text-sm"
                autoFocus
              />
              <div className="flex gap-2 w-full">
                <Button size="sm" onClick={handleAddCounter} className="flex-1">Add</Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setIsAddingCounter(false);
                  setNewCounterName("");
                }} className="flex-1">Cancel</Button>
              </div>
            </Card>
          ) : (
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 aspect-square border-[3px] border-dashed border-muted-foreground/40 hover:border-primary/50 flex items-center justify-center"
              onClick={() => setIsAddingCounter(true)}
            >
              <div className="text-center text-muted-foreground hover:text-primary transition-colors opacity-50">
                <div className="text-5xl md:text-6xl mb-2">+</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
