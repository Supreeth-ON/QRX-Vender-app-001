import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Upload, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Slide {
  id: number;
  image: string;
  type?: 'menu' | 'offer';
}

export default function OffersSliders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [menuSlides, setMenuSlides] = useState<Slide[]>(() => {
    const saved = localStorage.getItem('menuSlides');
    return saved ? JSON.parse(saved) : [
      { id: 1, image: "/images/menu-card-1.jpg", type: 'menu' },
      { id: 2, image: "/images/menu-card-2.jpg", type: 'menu' },
      { id: 3, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop", type: 'menu' },
      { id: 4, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop", type: 'offer' }
    ];
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [newSlideImage, setNewSlideImage] = useState("");
  const [newSlideType, setNewSlideType] = useState<'menu' | 'offer'>('offer');

  // Save slides to localStorage
  useEffect(() => {
    localStorage.setItem('menuSlides', JSON.stringify(menuSlides));
  }, [menuSlides]);

  // Auto-rotate slides
  useEffect(() => {
    if (menuSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % menuSlides.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [menuSlides.length]);

  const handleAddSlide = () => {
    if (!newSlideImage) {
      toast({
        title: "Error",
        description: "Please provide an image URL",
        variant: "destructive",
      });
      return;
    }

    const newSlide: Slide = {
      id: Date.now(),
      image: newSlideImage,
      type: newSlideType,
    };

    setMenuSlides([...menuSlides, newSlide]);
    setNewSlideImage("");
    setIsAddSlideOpen(false);
    
    toast({
      title: "Slide added",
      description: "New slide has been added successfully.",
    });
  };

  const handleDeleteSlide = (id: number) => {
    setMenuSlides(menuSlides.filter(slide => slide.id !== id));
    toast({
      title: "Slide deleted",
      description: "Slide has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Hero Section with Breadcrumb */}
      <div className="relative h-48 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url('/images/rameshwaram-cafe-hero.jpg')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => navigate('/menu')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">RAMESHWARAM CAFE</h1>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="opacity-80">Menu Management</span>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="font-semibold">Offers and Sliders</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Menu & Offers Section with Slider */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#8B4513] mb-6">Menu & Offers</h2>
          
          {/* Slider Preview */}
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="relative h-64 md:h-96">
              {menuSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      slide.type === 'offer' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {slide.type === 'offer' ? 'OFFER' : 'MENU'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {menuSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlideIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3x3 Grid Section */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-[#8B4513] mb-6">Manage Slider Images</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Existing Slides */}
            {menuSlides.map((slide) => (
              <div key={slide.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-md">
                  <img
                    src={slide.image}
                    alt="Slide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    slide.type === 'offer' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {slide.type === 'offer' ? 'OFFER' : 'MENU'}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute bottom-2 right-2 opacity-100"
                  onClick={() => handleDeleteSlide(slide.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add New Slide Button */}
            <Dialog open={isAddSlideOpen} onOpenChange={setIsAddSlideOpen}>
              <DialogTrigger asChild>
                <button className="aspect-square rounded-lg border-2 border-dashed border-[#D4A574] hover:border-[#8B4513] bg-white/50 hover:bg-white transition-all flex items-center justify-center group shadow-md">
                  <Plus className="h-12 w-12 text-[#D4A574] group-hover:text-[#8B4513] transition-colors" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add New Slide</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="slide-image">Image URL</Label>
                    <Input
                      id="slide-image"
                      placeholder="https://example.com/image.jpg"
                      value={newSlideImage}
                      onChange={(e) => setNewSlideImage(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slide-type">Slide Type</Label>
                    <select
                      id="slide-type"
                      value={newSlideType}
                      onChange={(e) => setNewSlideType(e.target.value as 'menu' | 'offer')}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="offer">Offer</option>
                      <option value="menu">Menu</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddSlide} className="flex-1 bg-[#D4A574] hover:bg-[#B8935F]">
                      <Upload className="h-4 w-4 mr-2" />
                      Add Slide
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddSlideOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

