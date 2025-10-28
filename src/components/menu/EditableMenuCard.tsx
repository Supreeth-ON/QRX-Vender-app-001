import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Check, X, Upload } from "lucide-react";

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: string;
  category: string;
}

interface EditableMenuCardProps {
  item: MenuItemProps;
  onUpdate: (id: string, updates: Partial<MenuItemProps>) => void;
}

export default function EditableMenuCard({ item, onUpdate }: EditableMenuCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(item);

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(item);
    setIsEditing(false);
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-xl bg-white border-[#D4A574]/30">
      {/* Edit Button Overlay - Always visible */}
      {!isEditing && (
        <Button
          size="icon"
          className="absolute top-2 right-2 z-10 opacity-100 transition-opacity bg-[#D4A574] hover:bg-[#B8935F] text-white shadow-lg"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#FFF8E7] to-[#FFE4B5]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Button 
              size="sm"
              className="bg-white text-[#8B4513] hover:bg-white/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Image
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Name */}
        {isEditing ? (
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="font-semibold text-lg border-[#D4A574] focus:border-[#8B4513]"
          />
        ) : (
          <h3 className="font-semibold text-lg text-[#8B4513]">{item.name}</h3>
        )}

        {/* Description */}
        {isEditing ? (
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="text-sm resize-none border-[#D4A574] focus:border-[#8B4513]"
            rows={2}
          />
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}

        {/* Price and Prep Time */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D4A574]/20">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-[#D4A574]">₹</span>
                <Input
                  type="number"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                  className="w-20 h-8 border-[#D4A574]"
                />
              </div>
            ) : (
              <span className="text-xl font-bold text-[#D4A574]">₹{item.price}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={editData.prepTime}
                  onChange={(e) => setEditData({ ...editData, prepTime: Number(e.target.value) })}
                  className="w-16 h-8 border-[#D4A574]"
                />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
            ) : (
              <span className="text-xs bg-[#D4A574]/10 text-[#8B4513] px-3 py-1 rounded-full font-medium border border-[#D4A574]/30">
                {item.prepTime} min
              </span>
            )}
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSave} 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button 
              onClick={handleCancel} 
              size="sm" 
              variant="outline" 
              className="flex-1 border-[#D4A574] text-[#8B4513] hover:bg-[#D4A574]/10"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
