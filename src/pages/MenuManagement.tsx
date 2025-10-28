import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Edit, Pause } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import EditableMenuCard from "@/components/menu/EditableMenuCard";
import CategorySection from "@/components/menu/CategorySection";
import CustomerMenuPreview from "@/components/menu/CustomerMenuPreview";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: string;
  category: string;
  paused?: boolean;
  isPaused?: boolean;
}

const initialMenuData: MenuItem[] = [
  // BREAKFAST
  { id: "1", name: "Idli (2 pcs)", description: "Soft steamed rice cakes served with sambar and coconut chutney", price: 80, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "BREAKFAST" },
  { id: "2", name: "Ven Pongal", description: "Traditional rice and lentil dish with ghee and pepper", price: 90, prepTime: 4, image: "https://preview--men-flow-tap-99.lovable.app/assets/pongal-xQOLvJ9N.jpg", category: "BREAKFAST" },
  { id: "3", name: "Upma", description: "Savory semolina dish with vegetables and spices", price: 75, prepTime: 5, image: "https://preview--men-flow-tap-99.lovable.app/assets/pongal-xQOLvJ9N.jpg", category: "BREAKFAST" },
  { id: "4", name: "Poha", description: "Flattened rice with curry leaves and peanuts", price: 70, prepTime: 4, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "BREAKFAST" },
  { id: "5", name: "Set Dosa (3 pcs)", description: "Soft mini dosas served with chutney and kurma", price: 95, prepTime: 6, image: "https://preview--men-flow-tap-99.lovable.app/assets/plain-dosa-D6CFkbFa.jpg", category: "BREAKFAST" },
  { id: "6", name: "Appam (2 pcs)", description: "Soft rice pancakes with coconut milk", price: 85, prepTime: 7, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "BREAKFAST" },
  { id: "7", name: "Uttapam", description: "Thick rice pancake with onions and tomatoes", price: 100, prepTime: 8, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "BREAKFAST" },
  { id: "8", name: "Pesarattu", description: "Green gram dosa with upma filling", price: 110, prepTime: 9, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "BREAKFAST" },
  
  // DOSA VARIETIES
  { id: "9", name: "Masala Dosa", description: "Crispy dosa filled with spiced potato curry, served with sambar and chutney", price: 120, prepTime: 7, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "DOSA VARIETIES" },
  { id: "10", name: "Plain Dosa", description: "Classic crispy dosa served with sambar and chutney", price: 90, prepTime: 5, image: "https://preview--men-flow-tap-99.lovable.app/assets/plain-dosa-D6CFkbFa.jpg", category: "DOSA VARIETIES" },
  { id: "11", name: "Onion Dosa", description: "Crispy dosa topped with onions", price: 100, prepTime: 6, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "DOSA VARIETIES" },
  { id: "12", name: "Paneer Dosa", description: "Dosa filled with spiced paneer", price: 140, prepTime: 8, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "DOSA VARIETIES" },
  { id: "13", name: "Ghee Roast Dosa", description: "Paper thin dosa roasted with ghee", price: 130, prepTime: 7, image: "https://preview--men-flow-tap-99.lovable.app/assets/plain-dosa-D6CFkbFa.jpg", category: "DOSA VARIETIES" },
  { id: "14", name: "Mysore Masala Dosa", description: "Spicy red chutney dosa with potato filling", price: 135, prepTime: 8, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "DOSA VARIETIES" },
  { id: "15", name: "Rava Dosa", description: "Crispy semolina dosa with onions", price: 115, prepTime: 7, image: "https://preview--men-flow-tap-99.lovable.app/assets/plain-dosa-D6CFkbFa.jpg", category: "DOSA VARIETIES" },
  { id: "16", name: "Cheese Dosa", description: "Dosa topped with melted cheese", price: 150, prepTime: 8, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "DOSA VARIETIES" },
  
  // BEVERAGES
  { id: "17", name: "Filter Coffee", description: "Traditional South Indian filter coffee with perfect milk foam", price: 60, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/filter-coffee-rXDjrCP7.jpg", category: "BEVERAGES" },
  { id: "18", name: "Masala Tea", description: "Spiced tea with cardamom, ginger and cinnamon", price: 40, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/tea-4Y07elPb.jpg", category: "BEVERAGES" },
  { id: "19", name: "Badam Milk", description: "Chilled almond-flavored milk drink", price: 70, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/filter-coffee-rXDjrCP7.jpg", category: "BEVERAGES" },
  { id: "20", name: "Buttermilk", description: "Spiced yogurt drink with curry leaves", price: 35, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/filter-coffee-rXDjrCP7.jpg", category: "BEVERAGES" },
  { id: "21", name: "Rose Milk", description: "Chilled milk with rose syrup", price: 55, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/filter-coffee-rXDjrCP7.jpg", category: "BEVERAGES" },
  { id: "22", name: "Fresh Lemon Juice", description: "Refreshing lemon juice with mint", price: 45, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/filter-coffee-rXDjrCP7.jpg", category: "BEVERAGES" },
  { id: "23", name: "Ginger Tea", description: "Strong tea with fresh ginger", price: 35, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/tea-4Y07elPb.jpg", category: "BEVERAGES" },
  { id: "24", name: "Tender Coconut Water", description: "Fresh tender coconut water", price: 50, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/filter-coffee-rXDjrCP7.jpg", category: "BEVERAGES" },
  
  // SNACKS
  { id: "25", name: "Medu Vada (2 pcs)", description: "Crispy lentil donuts served with hot sambar and chutney", price: 90, prepTime: 5, image: "https://preview--men-flow-tap-99.lovable.app/assets/vada-sambar-Bl1ycCX-.jpg", category: "SNACKS" },
  { id: "26", name: "Mysore Bonda (3 pcs)", description: "Soft fluffy fritters with coconut chutney", price: 75, prepTime: 6, image: "https://preview--men-flow-tap-99.lovable.app/assets/bonda-CjJncynL.jpg", category: "SNACKS" },
  { id: "27", name: "Samosa (2 pcs)", description: "Crispy pastry with spiced potato filling", price: 60, prepTime: 5, image: "https://preview--men-flow-tap-99.lovable.app/assets/bonda-CjJncynL.jpg", category: "SNACKS" },
  { id: "28", name: "Paniyaram (6 pcs)", description: "Savory rice dumplings with chutney", price: 70, prepTime: 6, image: "https://preview--men-flow-tap-99.lovable.app/assets/bonda-CjJncynL.jpg", category: "SNACKS" },
  { id: "29", name: "Mixed Bajji", description: "Assorted vegetable fritters", price: 80, prepTime: 7, image: "https://preview--men-flow-tap-99.lovable.app/assets/bonda-CjJncynL.jpg", category: "SNACKS" },
  { id: "30", name: "Onion Pakoda", description: "Crispy onion fritters with chutney", price: 65, prepTime: 6, image: "https://preview--men-flow-tap-99.lovable.app/assets/bonda-CjJncynL.jpg", category: "SNACKS" },
  { id: "31", name: "Veg Cutlet (2 pcs)", description: "Spiced vegetable patties", price: 75, prepTime: 7, image: "https://preview--men-flow-tap-99.lovable.app/assets/bonda-CjJncynL.jpg", category: "SNACKS" },
  { id: "32", name: "Gobi 65", description: "Spicy fried cauliflower", price: 95, prepTime: 8, image: "https://preview--men-flow-tap-99.lovable.app/assets/bonda-CjJncynL.jpg", category: "SNACKS" },
  
  // COMBO MEALS
  { id: "33", name: "South Indian Thali", description: "Rice, sambar, rasam, vegetable, curd, pickle, papad", price: 180, prepTime: 12, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "COMBO MEALS" },
  { id: "34", name: "Breakfast Combo", description: "2 Idli + 1 Vada + 1 Dosa with sambar and chutney", price: 150, prepTime: 10, image: "https://preview--men-flow-tap-99.lovable.app/assets/breakfast-combo-C9ZDpB6K.jpg", category: "COMBO MEALS" },
  { id: "35", name: "Mini Meals", description: "Rice + sambar + curry + curd", price: 120, prepTime: 10, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "COMBO MEALS" },
  { id: "36", name: "Family Pack", description: "Serves 4 - Rice, dosa, idli, vada with all accompaniments", price: 500, prepTime: 20, image: "https://preview--men-flow-tap-99.lovable.app/assets/breakfast-combo-C9ZDpB6K.jpg", category: "COMBO MEALS" },
  
  // DESSERTS
  { id: "37", name: "Kesari", description: "Sweet semolina pudding with saffron", price: 50, prepTime: 5, image: "https://preview--men-flow-tap-99.lovable.app/assets/payasam-DuCjDWPY.jpg", category: "DESSERTS" },
  { id: "38", name: "Payasam", description: "Traditional rice pudding with milk and cardamom", price: 60, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/payasam-DuCjDWPY.jpg", category: "DESSERTS" },
  { id: "39", name: "Gulab Jamun (2 pcs)", description: "Soft milk dumplings in sugar syrup", price: 55, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/payasam-DuCjDWPY.jpg", category: "DESSERTS" },
  { id: "40", name: "Jalebi", description: "Crispy sweet spirals in sugar syrup", price: 70, prepTime: 4, image: "https://preview--men-flow-tap-99.lovable.app/assets/payasam-DuCjDWPY.jpg", category: "DESSERTS" },
  { id: "41", name: "Rava Laddu (3 pcs)", description: "Sweet semolina balls with nuts", price: 65, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/payasam-DuCjDWPY.jpg", category: "DESSERTS" },
  { id: "42", name: "Mysore Pak", description: "Rich ghee and gram flour sweet", price: 80, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/payasam-DuCjDWPY.jpg", category: "DESSERTS" },
  
  // RICE VARIETIES
  { id: "43", name: "Bisi Bele Bath", description: "Spicy rice and lentil dish with vegetables", price: 110, prepTime: 10, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "RICE VARIETIES" },
  { id: "44", name: "Lemon Rice", description: "Tangy rice with curry leaves and peanuts", price: 90, prepTime: 5, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "RICE VARIETIES" },
  { id: "45", name: "Curd Rice", description: "Cool yogurt rice with tempering", price: 80, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "RICE VARIETIES" },
  { id: "46", name: "Tamarind Rice", description: "Tangy rice with tamarind and spices", price: 95, prepTime: 6, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "RICE VARIETIES" },
  { id: "47", name: "Coconut Rice", description: "Fragrant rice with fresh coconut", price: 85, prepTime: 5, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "RICE VARIETIES" },
  { id: "48", name: "Tomato Rice", description: "Spicy tomato flavored rice", price: 90, prepTime: 6, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "RICE VARIETIES" },
  
  // SIDES & CHUTNEYS
  { id: "49", name: "Sambar", description: "Lentil and vegetable stew", price: 40, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "SIDES & CHUTNEYS" },
  { id: "50", name: "Coconut Chutney", description: "Fresh coconut chutney with tempering", price: 30, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "SIDES & CHUTNEYS" },
  { id: "51", name: "Tomato Chutney", description: "Spicy tomato chutney", price: 30, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "SIDES & CHUTNEYS" },
  { id: "52", name: "Peanut Chutney", description: "Roasted peanut chutney", price: 35, prepTime: 2, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "SIDES & CHUTNEYS" },
  { id: "53", name: "Papad (2 pcs)", description: "Crispy lentil wafers", price: 25, prepTime: 1, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "SIDES & CHUTNEYS" },
  { id: "54", name: "Pickle", description: "Traditional South Indian pickle", price: 20, prepTime: 1, image: "https://preview--men-flow-tap-99.lovable.app/assets/idli-sambar-DrImqndb.jpg", category: "SIDES & CHUTNEYS" },
  
  // CHEF SPECIALS
  { id: "55", name: "Special Ghee Roast", description: "Our signature ghee roast dosa with special masala", price: 180, prepTime: 10, image: "https://preview--men-flow-tap-99.lovable.app/assets/masala-dosa-8hueTRVg.jpg", category: "CHEF SPECIALS" },
  { id: "56", name: "Rameshwaram Special", description: "Unique combination of idli and dosa with special chutney", price: 160, prepTime: 12, image: "https://preview--men-flow-tap-99.lovable.app/assets/breakfast-combo-C9ZDpB6K.jpg", category: "CHEF SPECIALS" },
  { id: "57", name: "Filter Coffee Delight", description: "Premium filter coffee with special milk foam", price: 80, prepTime: 3, image: "https://preview--men-flow-tap-99.lovable.app/assets/filter-coffee-rXDjrCP7.jpg", category: "CHEF SPECIALS" },
  { id: "58", name: "Royal Thali", description: "Premium thali with 10+ items", price: 250, prepTime: 15, image: "https://preview--men-flow-tap-99.lovable.app/assets/south-thali-qxVhZcKB.jpg", category: "CHEF SPECIALS" },
];

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : initialMenuData;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  // Save to localStorage whenever menuItems change
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  const handleUpdateItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          // Sync isPaused with paused
          if ('isPaused' in updates) {
            updatedItem.paused = updates.isPaused;
          }
          return updatedItem;
        }
        return item;
      })
    );
    setHasUnsavedChanges(true);
    toast({
      title: "Item updated",
      description: "Menu item has been updated successfully.",
    });
  };

  const handleUpdateCategoryTitle = (oldTitle: string, newTitle: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.category === oldTitle ? { ...item, category: newTitle } : item
      )
    );
    setHasUnsavedChanges(true);
    toast({
      title: "Category updated",
      description: "Category name has been updated successfully.",
    });
  };

  const handleAddItem = (category: string) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "New Item",
      description: "Add description here",
      price: 0,
      prepTime: 5,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop",
      category,
    };
    setMenuItems((prev) => [...prev, newItem]);
    setHasUnsavedChanges(true);
    toast({
      title: "Item added",
      description: "New menu item has been added. Click edit to customize.",
    });
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    setHasUnsavedChanges(true);
    toast({
      title: "Item deleted",
      description: "Menu item has been deleted successfully.",
    });
  };

  const handleSaveAll = () => {
    // This would sync with backend/customer app
    setHasUnsavedChanges(false);
    toast({
      title: "Menu saved",
      description: "All changes have been saved and will reflect in the customer app.",
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <PageHeader title="Menu Management" />

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#D4A574] px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              size="default" 
              className="h-20 flex flex-col gap-1 text-xs md:text-sm hover:bg-primary/10 hover:text-primary hover:border-primary"
              onClick={() => window.location.href = '/my-dishes'}
            >
              My Dishes
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className="h-20 flex flex-col gap-1 text-xs md:text-sm hover:bg-primary/10 hover:text-primary hover:border-primary"
              onClick={() => window.location.href = '/offers-sliders'}
            >
              Offers & Sliders
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className={`h-20 flex flex-col gap-1 text-xs md:text-sm relative ${
                menuItems.some(item => item.paused && !item.name.includes('For reference only')) 
                  ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary'
              }`}
              onClick={() => window.location.href = '/paused-dishes'}
            >
              <Pause className={`h-5 w-5 ${
                menuItems.some(item => item.paused && !item.name.includes('For reference only')) 
                  ? 'text-red-600 animate-pulse' 
                  : ''
              }`} />
              Paused Dishes: {menuItems.filter(item => item.paused && !item.name.includes('For reference only')).length}
              {menuItems.some(item => item.paused && !item.name.includes('For reference only')) && (
                <span className="absolute top-2 right-2 h-3 w-3 bg-red-600 rounded-full animate-pulse" />
              )}
            </Button>
            <Button variant="outline" size="default" className="h-20 flex flex-col gap-1 text-xs md:text-sm hover:bg-primary/10 hover:text-primary hover:border-primary">
              My Themes
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button - Non-sticky */}
      <div className="bg-white/95 backdrop-blur border-b border-[#D4A574] shadow-sm">
        <div className="px-4 py-3">
          <Button 
            onClick={handleSaveAll} 
            size="sm"
            className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all ${
              hasUnsavedChanges ? 'animate-pulse shadow-lg shadow-primary/50' : ''
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs for View as Customer and Edit Mode */}
      <div className="px-4 py-6">
        <Tabs defaultValue="view" className="w-full max-w-7xl mx-auto">
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-primary p-1">
            <TabsTrigger 
              value="view" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-primary bg-primary text-white hover:bg-primary/90"
            >
              <Eye className="h-4 w-4" />
              View as customer
            </TabsTrigger>
            <TabsTrigger 
              value="edit" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-primary bg-primary text-white hover:bg-primary/90"
            >
              <Edit className="h-4 w-4" />
              Edit Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="-mx-4">
            <CustomerMenuPreview 
              menuItems={menuItems} 
              isEditMode={false} 
              showEditButton={false} 
            />
          </TabsContent>

          <TabsContent value="edit" className="-mx-4">
            <CustomerMenuPreview 
              menuItems={menuItems} 
              isEditMode={true} 
              showEditButton={false}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
