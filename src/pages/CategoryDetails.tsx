import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Minus, Plus, Pause, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: string;
  category: string;
  isPaused?: boolean;
}

interface CategoryDetailsProps {
  menuItems?: MenuItem[];
  isEditMode?: boolean;
  onUpdateItem?: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteItem?: (id: string) => void;
}

export default function CategoryDetails({ 
  menuItems: propMenuItems, 
  isEditMode = false,
  onUpdateItem,
  onDeleteItem 
}: CategoryDetailsProps) {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemData, setEditItemData] = useState<MenuItem | null>(null);

  // If menuItems not provided as props, get from localStorage or default data
  const storedMenuItems = propMenuItems || JSON.parse(localStorage.getItem('menuItems') || '[]');
  
  const categoryItems = storedMenuItems.filter(
    (item: MenuItem) => item.category === decodeURIComponent(category || '')
  );

  const handleIncrement = (id: string) => {
    setItemCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecrement = (id: string) => {
    setItemCounts(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }));
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditItemData({ ...item });
  };

  const handleUpdateMenuItem = () => {
    if (editItemData && onUpdateItem) {
      onUpdateItem(editItemData.id, editItemData);
      setEditingItemId(null);
      toast({ title: "Item updated", description: `${editItemData.name} has been updated` });
    }
  };

  const handleItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditItemData({ ...editItemData!, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (onDeleteItem) {
      onDeleteItem(id);
      toast({ title: "Item deleted", description: `${name} has been removed from the menu` });
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      <PageHeader title={decodeURIComponent(category || '')} />
      
      {/* Header */}
      <div className="bg-[#1a1a1a] px-4 py-4 flex items-center gap-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-white flex-1">
          {decodeURIComponent(category || '')}
        </h1>
        <Button className="bg-[#D4A574] hover:bg-[#B8935F] text-white font-semibold px-6 py-2 rounded-full">
          🍽️ ORDER NOW
        </Button>
      </div>

      {/* Category Banner */}
      <div className="px-4 py-8 bg-gradient-to-b from-[#F5F1E8] to-[#E8E4DC]">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-2"
            style={{ 
              color: '#D4A574',
              textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
              letterSpacing: '3px'
            }}
          >
            {decodeURIComponent(category || '')}
          </h2>
          <p className="text-center text-gray-600">
            {categoryItems.length} items available
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {categoryItems.map((item: MenuItem) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 border-3 border-[#D4A574] shadow-lg relative group ${item.isPaused ? 'opacity-60' : ''}`}
            >
              {item.isPaused && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="destructive" className="gap-1">
                    <Pause className="h-3 w-3" />
                    Temporarily sold out
                  </Badge>
                </div>
              )}
              
              {/* Edit and Delete buttons */}
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="p-2 bg-[#D4A574] rounded-full shadow-lg"
                  >
                    <Edit2 className="h-3 w-3 text-white" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.isPaused ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                    </div>
                    <button className="p-2">
                      <Mic className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#8B4513]">₹{item.price}</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {item.prepTime} min
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        disabled={(itemCounts[item.id] || 0) === 0}
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="text-base font-bold text-gray-900 min-w-[24px] text-center">
                        {itemCounts[item.id] || 0}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={editingItemId !== null} onOpenChange={(open) => !open && setEditingItemId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editItemData && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-item-name">Name</Label>
                <Input
                  id="edit-item-name"
                  value={editItemData.name}
                  onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-item-description">Description</Label>
                <Textarea
                  id="edit-item-description"
                  value={editItemData.description}
                  onChange={(e) => setEditItemData({ ...editItemData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-item-image">Upload Image</Label>
                <Input
                  id="edit-item-image"
                  type="file"
                  accept="image/*"
                  onChange={handleItemImageUpload}
                  className="cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-item-price">Price (₹)</Label>
                  <Input
                    id="edit-item-price"
                    type="number"
                    value={editItemData.price}
                    onChange={(e) => setEditItemData({ ...editItemData, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-item-preptime">Prep Time (min)</Label>
                  <Input
                    id="edit-item-preptime"
                    type="number"
                    value={editItemData.prepTime}
                    onChange={(e) => setEditItemData({ ...editItemData, prepTime: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Pause className="h-4 w-4 text-gray-600" />
                  <Label htmlFor="edit-item-pause" className="cursor-pointer mb-0">
                    Temporarily sold out
                  </Label>
                </div>
                <Input
                  id="edit-item-pause"
                  type="checkbox"
                  checked={editItemData.isPaused || false}
                  onChange={(e) => setEditItemData({ ...editItemData, isPaused: e.target.checked })}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
              <Button onClick={handleUpdateMenuItem} className="w-full">
                Update Item
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
