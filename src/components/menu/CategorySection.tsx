import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X, Plus } from "lucide-react";

interface CategorySectionProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onAddItem: () => void;
  children: React.ReactNode;
}

export default function CategorySection({
  title,
  onUpdateTitle,
  onAddItem,
  children,
}: CategorySectionProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveTitle = () => {
    onUpdateTitle(editedTitle);
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  };

  return (
    <section className="space-y-4">
      {/* Category Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-[#D4A574] to-[#B8935F] rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isEditingTitle ? (
              <>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 text-lg font-bold bg-white/90 border-white"
                />
                <div className="flex gap-1 flex-shrink-0">
                  <Button onClick={handleSaveTitle} size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancelEdit} size="sm" variant="outline" className="h-8 w-8 p-0 bg-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-white truncate">{title}</h2>
                <Button
                  onClick={() => setIsEditingTitle(true)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white flex-shrink-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <Button 
            onClick={onAddItem} 
            size="sm"
            className="bg-white text-[#8B4513] hover:bg-white/90 whitespace-nowrap flex-shrink-0"
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add Item</span>
          </Button>
        </div>
      </div>

      {/* Menu Items Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </section>
  );
}
