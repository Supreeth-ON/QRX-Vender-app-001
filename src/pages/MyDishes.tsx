import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, ChevronRight, Plus, Pause, Play, Trash2, Upload, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: string;
  category: string;
  paused?: boolean;
  type?: "veg" | "non-veg" | "egg";
}

export default function MyDishes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("menuItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentEditingImage, setCurrentEditingImage] = useState<string | null>(null);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save to localStorage whenever menuItems change
  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  const handleUpdateItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleTogglePause = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, paused: !item.paused } : item
      )
    );
  };

  const handleAddItem = (category: string) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "New Dish",
      description: "Add description here",
      price: 0,
      prepTime: 5,
      image: "",
      category,
      paused: false,
      type: "veg",
    };
    setMenuItems((prev) => [...prev, newItem]);
    setEditingId(newItem.id);
    toast({
      title: "Dish added",
      description: "New dish has been added. Click on fields to edit.",
    });
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Dish deleted",
      description: "Dish has been deleted successfully.",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleImageClick = (id: string) => {
    setCurrentEditingImage(id);
    setImageDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentEditingImage) {
      const imageUrl = URL.createObjectURL(file);
      handleUpdateItem(currentEditingImage, "image", imageUrl);
      setImageDialogOpen(false);
      toast({
        title: "Image uploaded",
        description: "Dish image has been updated.",
      });
    }
  };

  const handleCloudImageSelect = () => {
    toast({
      title: "Cloud storage",
      description: "Cloud image selection coming soon!",
    });
  };

  const getFoodTypeColor = (type: string = "veg") => {
    switch (type) {
      case "veg":
        return "bg-green-500";
      case "non-veg":
        return "bg-red-500";
      case "egg":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-background custom-scrollbar">
      {/* Hero Image with Navigation */}
      <div className="relative w-full h-[200px] sm:h-[250px]">
        <img
          src="/images/rameshwaram-cafe-hero.jpg"
          alt="Rameshwaram Cafe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Rameshwaram Cafe
          </h1>
          <div className="flex items-center gap-2 text-white/90">
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm sm:text-base">Menu Management</span>
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-sm sm:text-base font-medium">MY Dishes</span>
          </div>
        </div>

        {/* Back Arrow - Bottom Left */}
        <Button
          onClick={() => navigate("/menu")}
          variant="ghost"
          size="icon"
          className="absolute bottom-4 left-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="px-2 sm:px-4 py-6 max-w-7xl mx-auto">
        {/* Total Items Count with Save & Publish Button */}
        <div className="mb-6 bg-card p-4 rounded-lg border flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Total Items: <span className="text-primary">{menuItems.length}</span>
          </h2>
          <Button
            onClick={() => {
              toast({
                title: "Changes saved & published",
                description: "All menu changes have been published successfully.",
              });
            }}
            className="gap-2"
          >
            Save & Publish
          </Button>
        </div>

        {/* Dishes List by Category */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryItems = menuItems.filter(
              (item) => item.category === category
            );

            return (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
                  <h3 className="text-xl font-bold text-primary">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryItems.length} items
                  </p>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px]">Actions</TableHead>
                        <TableHead className="min-w-[150px]">Dish Name</TableHead>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead className="min-w-[200px]">Description</TableHead>
                        <TableHead className="w-[100px]">Price (₹)</TableHead>
                        <TableHead className="w-[120px]">Est. Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryItems.map((item) => (
                        <TableRow
                          key={item.id}
                          className={item.paused ? "opacity-50" : ""}
                        >
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleTogglePause(item.id)}
                                className="h-8 w-8"
                              >
                                {item.paused ? (
                                  <Play className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Pause className="h-4 w-4 text-orange-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <div className="relative inline-block w-full">
                                <div
                                  className={`absolute -top-1 -left-1 h-2 w-2 rounded-full ${getFoodTypeColor(
                                    item.type
                                  )} z-10`}
                                  title={item.type || "veg"}
                                />
                                <Input
                                  value={item.name}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, "name", e.target.value)
                                  }
                                  onBlur={() => setEditingId(null)}
                                  className="h-8 pl-3"
                                />
                              </div>
                            ) : (
                              <div 
                                className="relative inline-block w-full cursor-pointer"
                                onClick={() => setEditingId(item.id)}
                              >
                                <div
                                  className={`absolute -top-1 -left-1 h-2 w-2 rounded-full ${getFoodTypeColor(
                                    item.type
                                  )}`}
                                  title={item.type || "veg"}
                                />
                                <div className="hover:bg-primary/10 hover:ring-1 hover:ring-primary/20 p-2 rounded transition-all">
                                  {item.name}
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div
                              onClick={() => handleImageClick(item.id)}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-md border-2 border-border"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-muted rounded-md border-2 border-dashed border-border flex items-center justify-center">
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <Textarea
                                value={item.description}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                onBlur={() => setEditingId(null)}
                                className="min-h-[60px] text-sm"
                              />
                            ) : (
                              <div 
                                className="hover:bg-primary/10 hover:ring-1 hover:ring-primary/20 p-2 rounded text-sm transition-all min-h-[60px] cursor-pointer"
                                onClick={() => setEditingId(item.id)}
                              >
                                {item.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "price",
                                    Number(e.target.value)
                                  )
                                }
                                onBlur={() => setEditingId(null)}
                                className="h-8"
                              />
                            ) : (
                              <div 
                                className="hover:bg-primary/10 hover:ring-1 hover:ring-primary/20 p-2 rounded transition-all cursor-pointer"
                                onClick={() => setEditingId(item.id)}
                              >
                                ₹{item.price}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <Input
                                type="number"
                                value={item.prepTime}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "prepTime",
                                    Number(e.target.value)
                                  )
                                }
                                onBlur={() => setEditingId(null)}
                                className="h-8"
                              />
                            ) : (
                              <div 
                                className="hover:bg-primary/10 hover:ring-1 hover:ring-primary/20 p-2 rounded transition-all cursor-pointer"
                                onClick={() => setEditingId(item.id)}
                              >
                                {item.prepTime} min
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Add New Item Row */}
                      <TableRow className="bg-muted/20">
                        <TableCell colSpan={6}>
                          <Button
                            onClick={() => handleAddItem(category)}
                            variant="ghost"
                            className="w-full justify-center gap-2 text-primary hover:text-primary"
                          >
                            <Plus className="h-4 w-4" />
                            Add New Dish to {category}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-primary/50 hover:bg-primary/70 backdrop-blur-sm shadow-lg transition-all duration-300"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6 rotate-90" />
        </Button>
      )}

      {/* Image Upload Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Dish Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
              >
                <Upload className="h-6 w-6" />
                <span className="font-medium">Upload from Device</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              onClick={handleCloudImageSelect}
              variant="outline"
              className="w-full gap-3 p-6"
            >
              <Cloud className="h-6 w-6" />
              <span className="font-medium">Choose from Cloud</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
