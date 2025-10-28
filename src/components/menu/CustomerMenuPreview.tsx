import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Mic, Clock, Minus, Plus, Menu, MapPin, Smile, Edit2, X, PlusCircle, Upload, Trash2, Sparkles, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: string;
  category: string;
  isPaused?: boolean;
  paused?: boolean;
}

interface CustomerMenuPreviewProps {
  menuItems: MenuItem[];
  isEditMode?: boolean;
  showEditButton?: boolean;
  onUpdateItem?: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteItem?: (id: string) => void;
}

const categoryImages: Record<string, string> = {
  "BREAKFAST": "/images/category-breakfast.jpg",
  "DOSA VARIETIES": "/images/category-dosa.jpg",
  "BEVERAGES": "/images/category-beverages.jpg",
  "SNACKS": "/images/category-snacks.jpg",
  "DESSERTS": "/images/category-desserts.jpg",
  "COMBO MEALS": "/images/category-combos.jpg",
  "RICE VARIETIES": "/images/category-breakfast.jpg",
  "SIDES & CHUTNEYS": "/images/category-snacks.jpg",
  "CHEF SPECIALS": "/images/category-combos.jpg",
};

export default function CustomerMenuPreview({ menuItems, isEditMode: initialEditMode = false, showEditButton = true, onUpdateItem, onDeleteItem }: CustomerMenuPreviewProps) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("BREAKFAST");
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [restaurantName, setRestaurantName] = useState("RAMESHWARAM CAFE");
  const [heroImage, setHeroImage] = useState("/images/rameshwaram-cafe-hero.jpg");
  const [menuSlides, setMenuSlides] = useState<Array<{ id: number; image: string; type?: 'menu' | 'offer' }>>([
    { id: 1, image: "/images/menu-card-1.jpg", type: 'menu' },
    { id: 2, image: "/images/menu-card-2.jpg", type: 'menu' },
    { id: 3, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop", type: 'menu' },
    { id: 4, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop", type: 'offer' }
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [customCategories, setCustomCategories] = useState<Array<{ name: string; image: string }>>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  const [newSlideImage, setNewSlideImage] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<{ name: string; image: string }>({ name: "", image: "" });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemData, setEditItemData] = useState<MenuItem | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [sliderOriginalTop, setSliderOriginalTop] = useState(0);
  const { toast } = useToast();

  // Auto-rotate slides in view mode with slide animation
  useEffect(() => {
    if (!isEditMode && menuSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % menuSlides.length);
      }, 7000); // 7 seconds gap
      return () => clearInterval(interval);
    }
  }, [isEditMode, menuSlides.length]);

  // Calculate original slider position on mount
  useEffect(() => {
    const categorySlider = document.getElementById('category-slider');
    if (categorySlider && sliderOriginalTop === 0) {
      // Get the initial offset position (only once)
      const rect = categorySlider.getBoundingClientRect();
      const scrollY = window.scrollY;
      setSliderOriginalTop(rect.top + scrollY);
    }
  }, [sliderOriginalTop]);

  // Sticky category slider with header coordination
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = 56; // Height of the top navigation bar
      
      // Check if we've scrolled past the slider's original position
      if (scrollY > sliderOriginalTop - headerHeight && sliderOriginalTop > 0) {
        setIsSticky(true);
        setHideHeader(true);
      } else {
        setIsSticky(false);
        setHideHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sliderOriginalTop]);

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

  const categories = Array.from(new Set([
    ...menuItems.map(item => item.category),
    ...customCategories.map(cat => cat.name)
  ]));

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImage(reader.result as string);
        toast({ title: "Image updated", description: "Hero image has been updated" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSlide = (imageUrl?: string) => {
    const newId = Math.max(...menuSlides.map(s => s.id), 0) + 1;
    setMenuSlides([...menuSlides, { id: newId, image: imageUrl || `/images/menu-card-${newId}.jpg` }]);
    toast({ title: "Slide added", description: "New menu slide has been added" });
  };

  const handleSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>, slideId: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuSlides(menuSlides.map(slide => 
          slide.id === slideId ? { ...slide, image: reader.result as string } : slide
        ));
        setEditingSlideId(null);
        toast({ title: "Slide updated", description: "Menu slide has been updated" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSlide = (slideId: number) => {
    setMenuSlides(menuSlides.filter(slide => slide.id !== slideId));
    toast({ title: "Slide deleted", description: "Menu slide has been removed" });
  };

  const handleGenerateWithAI = () => {
    // Dummy AI generation for now
    toast({ 
      title: "AI Generation", 
      description: "AI image generation will be available soon!",
      duration: 3000
    });
    setEditingSlideId(null);
    setAiPrompt("");
  };

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryImage) {
      setCustomCategories([...customCategories, { name: newCategoryName, image: newCategoryImage }]);
      setNewCategoryName("");
      setNewCategoryImage("");
      setIsAddCategoryOpen(false);
      toast({ title: "Category added", description: `${newCategoryName} has been added` });
    }
  };

  const handleRemoveCategory = (categoryName: string) => {
    setCustomCategories(customCategories.filter(cat => cat.name !== categoryName));
    toast({ title: "Category removed", description: `${categoryName} has been removed` });
  };

  const getCategoryImage = (category: string) => {
    const customCat = customCategories.find(cat => cat.name === category);
    return customCat ? customCat.image : (categoryImages[category] || categoryImages["BREAKFAST"]);
  };

  const handleEditCategory = (category: string) => {
    const customCat = customCategories.find(cat => cat.name === category);
    if (customCat) {
      setEditingCategoryName(category);
      setEditCategoryData({ name: category, image: customCat.image });
    } else {
      setEditingCategoryName(category);
      setEditCategoryData({ name: category, image: categoryImages[category] || "" });
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategoryName && editCategoryData.name) {
      const existingCustomCat = customCategories.find(cat => cat.name === editingCategoryName);
      if (existingCustomCat) {
        setCustomCategories(customCategories.map(cat => 
          cat.name === editingCategoryName ? editCategoryData : cat
        ));
      } else {
        // Update from default category to custom
        setCustomCategories([...customCategories, editCategoryData]);
      }
      setEditingCategoryName(null);
      toast({ title: "Category updated", description: `${editCategoryData.name} has been updated` });
    }
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditCategoryData({ ...editCategoryData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCategory = (category: string) => {
    const customCat = customCategories.find(cat => cat.name === category);
    if (customCat) {
      handleRemoveCategory(category);
    } else {
      toast({ 
        title: "Cannot delete", 
        description: "Default categories cannot be deleted. Only custom categories can be removed.",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    // Ensure isPaused is synced with paused
    setEditItemData({ ...item, isPaused: item.paused || item.isPaused });
  };

  const handleUpdateMenuItem = () => {
    if (editItemData && onUpdateItem) {
      // Ensure both paused and isPaused are synced
      const updates = {
        ...editItemData,
        paused: editItemData.isPaused,
      };
      onUpdateItem(editItemData.id, updates);
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
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Top Navigation Bar */}
      <div 
        className={`bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-gray-800 transition-all duration-300 ${
          hideHeader ? 'fixed top-0 left-0 right-0 -translate-y-full opacity-0' : 'relative translate-y-0 opacity-100'
        }`}
        style={{ zIndex: hideHeader ? -1 : 50 }}
      >
        <button className="p-2">
          <Menu className="h-6 w-6 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Button className="bg-transparent hover:bg-[#D4A574]/20 text-white font-semibold px-6 py-2 rounded-full border-2 border-[#D4A574]">
            🍽️ ORDER NOW
          </Button>
        </div>
      </div>

      {/* Hero Section with Content Overlay */}
      <div className="relative h-[320px] group">
        <img
          src={heroImage}
          alt="Rameshwaram Cafe"
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Edit Hero Image Button */}
        {isEditMode && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute top-4 right-4 p-3 bg-[#D4A574] rounded-full shadow-lg opacity-100 transition-opacity">
                <Edit2 className="h-5 w-5 text-white" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Hero Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero-image-upload">Upload Image</Label>
                  <Input
                    id="hero-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Uploaded images will automatically have a dark overlay applied
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Bell Icon - Top Left */}
        <div className="absolute top-4 left-4">
          <button className="p-3 bg-[#D4A574] rounded-full shadow-lg">
            <Bell className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="relative group">
            {isEditMode && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute -top-2 -right-2 p-2 bg-[#D4A574] rounded-full opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4 text-white" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Restaurant Name</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="restaurant-name">Restaurant Name</Label>
                      <Input
                        id="restaurant-name"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <h1 
              className="text-4xl md:text-5xl font-bold text-white text-center mb-3"
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.5)',
                letterSpacing: '2px'
              }}
            >
              {restaurantName}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 text-white mb-3">
            <MapPin className="h-4 w-4" />
            <p className="text-base font-medium">Welcome to Rameshwaram Cafe</p>
          </div>

          <div className="flex items-center gap-2 text-white">
            <p className="text-sm">We accept voice orders</p>
            <div className="w-8 h-8 bg-[#D4A574] rounded-full flex items-center justify-center">
              <Smile className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Microphone Button - Bottom Right */}
        <div className="absolute bottom-4 right-4">
          <button className="p-4 bg-gray-600/60 rounded-full shadow-lg backdrop-blur-sm">
            <Mic className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Menu & Offers Section */}
      <div className="px-4 py-8 bg-[#F5F1E8]">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-6"
            style={{ 
              color: '#D4A574',
              textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
              letterSpacing: '3px'
            }}
          >
            MENU & OFFERS
          </h2>
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(-${isEditMode ? 0 : currentSlideIndex * 100}%)` 
              }}
            >
              {menuSlides.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className="flex-shrink-0 w-full px-3 sm:px-4"
                >
                  <div className="bg-[#E8DCC8] rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 sm:border-4 border-[#D4A574] shadow-xl relative group mx-auto w-full max-w-full sm:max-w-[480px] md:max-w-[550px]">
                    {slide.type === 'offer' ? (
                      <div className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-8 text-white min-h-[300px] flex flex-col justify-center">
                        <div className="absolute top-4 right-4 bg-yellow-400 text-red-700 font-bold px-4 py-2 rounded-full text-sm rotate-12">
                          TODAY ONLY!
                        </div>
                        <h3 className="text-4xl font-bold mb-4 text-center">Today's Special</h3>
                        <p className="text-2xl font-semibold text-center mb-4">Must Try!</p>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                          <p className="text-xl mb-2">Special South Indian Thali</p>
                          <p className="text-3xl font-bold">₹180</p>
                          <p className="text-sm mt-2 opacity-90">Limited quantity available</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={slide.image}
                          alt={`Menu Card ${slide.id}`}
                          className="w-full rounded-lg"
                        />
                        <p className="text-center text-gray-700 italic mt-3 text-sm">Tap to view full menu</p>
                      </>
                    )}
                  
                    {/* Edit and Delete buttons */}
                    {isEditMode && (
                      <div className="absolute top-6 right-6 flex gap-2 opacity-100 transition-opacity">
                        <Dialog open={editingSlideId === slide.id} onOpenChange={(open) => !open && setEditingSlideId(null)}>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => setEditingSlideId(slide.id)}
                              className="p-2 bg-[#D4A574] rounded-full shadow-lg"
                            >
                              <Edit2 className="h-4 w-4 text-white" />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Slide</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`slide-upload-${slide.id}`}>Upload Image</Label>
                                <Input
                                  id={`slide-upload-${slide.id}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleSlideImageUpload(e, slide.id)}
                                  className="cursor-pointer"
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
                              <div>
                                <Label htmlFor="ai-prompt">Generate with AI</Label>
                                <Textarea
                                  id="ai-prompt"
                                  placeholder="Describe the menu slide you want to create..."
                                  value={aiPrompt}
                                  onChange={(e) => setAiPrompt(e.target.value)}
                                  className="min-h-[100px]"
                                />
                                <Button 
                                  onClick={handleGenerateWithAI}
                                  className="w-full mt-2 bg-[#D4A574] hover:bg-[#C4956A]"
                                >
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Generate with AI (Coming Soon)
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {isEditMode && (
              <div className="flex-shrink-0 snap-center w-full max-w-md mx-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-[#E8DCC8] rounded-2xl p-4 border-4 border-dashed border-[#D4A574] shadow-xl h-full min-h-[300px] flex flex-col items-center justify-center gap-4 hover:bg-[#D4A574]/20 transition-colors w-full">
                      <PlusCircle className="h-12 w-12 text-[#D4A574]" />
                      <p className="text-[#D4A574] font-semibold">Add New Slide</p>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Slide</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="new-slide-upload">Upload Image</Label>
                        <Input
                          id="new-slide-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleAddSlide(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="cursor-pointer"
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
                      <div>
                        <Label htmlFor="new-ai-prompt">Generate with AI</Label>
                        <Textarea
                          id="new-ai-prompt"
                          placeholder="Describe the menu slide you want to create..."
                          value={newSlideImage}
                          onChange={(e) => setNewSlideImage(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button 
                          onClick={handleGenerateWithAI}
                          className="w-full mt-2 bg-[#D4A574] hover:bg-[#C4956A]"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate with AI (Coming Soon)
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="px-4 py-8 bg-[#E8E4DC]">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            style={{ 
              color: '#D4A574',
              textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
              letterSpacing: '3px'
            }}
          >
            FEATURED CATEGORIES
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <div
                key={category}
                className="relative h-[180px] rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform group"
                onClick={() => {
                  if (!isEditMode) {
                    // Navigate to category detail page
                    navigate(`/category/${encodeURIComponent(category)}`);
                  }
                }}
              >
                <img
                  src={getCategoryImage(category)}
                  alt={category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wide leading-tight">
                    {category}
                  </h3>
                </div>
                
                {/* Edit and Delete buttons */}
                {isEditMode && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                      className="p-2 bg-[#D4A574] rounded-full shadow-lg"
                    >
                      <Edit2 className="h-3 w-3 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                      className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isEditMode && (
              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <div className="relative h-[180px] rounded-lg overflow-hidden shadow-lg cursor-pointer border-4 border-dashed border-[#D4A574] hover:bg-[#D4A574]/10 transition-colors flex items-center justify-center">
                    <div className="text-center">
                      <PlusCircle className="h-12 w-12 text-[#D4A574] mx-auto mb-2" />
                      <p className="text-[#D4A574] font-bold text-sm">Add Category</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        placeholder="e.g., BEVERAGES"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-image">Image URL</Label>
                      <Input
                        id="category-image"
                        placeholder="/images/category-name.jpg"
                        value={newCategoryImage}
                        onChange={(e) => setNewCategoryImage(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddCategory} className="w-full">
                      Add Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Edit Category Dialog */}
          <Dialog open={editingCategoryName !== null} onOpenChange={(open) => !open && setEditingCategoryName(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-category-name">Category Name</Label>
                  <Input
                    id="edit-category-name"
                    value={editCategoryData.name}
                    onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category-image">Upload Image</Label>
                  <Input
                    id="edit-category-image"
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageUpload}
                    className="cursor-pointer"
                  />
                </div>
                <Button onClick={handleUpdateCategory} className="w-full">
                  Update Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Complete Menu Section */}
      <div className="px-4 py-8 bg-[#E8E4DC]">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            style={{ 
              color: '#D4A574',
              textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
              letterSpacing: '3px'
            }}
          >
            COMPLETE MENU
          </h2>
          
          {/* Circular Category Icons - Horizontally Scrollable with Sticky */}
          <div 
            id="category-slider"
            className={`transition-all duration-300 ${
              isSticky ? 'fixed top-0 left-0 right-0 z-50 bg-[#E8E4DC] shadow-lg py-4' : 'relative'
            }`}
          >
            <div className={`flex gap-6 overflow-x-auto pb-4 scrollbar-hide ${isSticky ? 'px-4 max-w-7xl mx-auto' : ''}`}>
              {categories.map((category) => (
                <div key={category} className="relative flex-shrink-0 group">
                  <button
                    onClick={() => {
                      setActiveCategory(category);
                      document.getElementById(`menu-${category}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`flex flex-col items-center gap-2 transition-all ${
                      activeCategory === category ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-4 relative ${
                      activeCategory === category ? 'border-[#D4A574]' : 'border-gray-400'
                    }`}>
                      <img
                        src={getCategoryImage(category)}
                        alt={category}
                        className="w-full h-full object-cover"
                      />
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-100 transition-opacity"
                        >
                          <Edit2 className="h-5 w-5 text-white" />
                        </button>
                      )}
                    </div>
                    <span className={`text-xs font-semibold text-center max-w-[80px] leading-tight uppercase ${
                      activeCategory === category ? 'text-[#8B4513]' : 'text-gray-600'
                    }`}>
                      {category}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dish Cards by Category */}
      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category === category);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category} id={`menu-${category}`} className="px-4 py-6 bg-[#E8E4DC]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-2xl font-bold"
                  style={{ 
                    color: '#D4A574',
                    textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
                    letterSpacing: '2px'
                  }}
                >
                  {category}
                </h3>
                <button className="p-3 bg-gray-200 rounded-full">
                  <Mic className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {categoryItems.map((item) => (
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
                      <div className="absolute top-2 right-2 flex gap-2 opacity-100 transition-opacity z-10">
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
                            <div className={`w-2 h-2 rounded-full ${(item.isPaused || item.paused) ? 'bg-red-500' : 'bg-green-500'}`}></div>
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
          </div>
        );
      })}

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
