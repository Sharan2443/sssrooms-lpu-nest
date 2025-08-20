import RoomCard from "./RoomCard";
import { Button } from "@/components/ui/button";

// Mock data - in real app this would come from API
const mockRooms = [
  {
    id: "1",
    title: "Luxury Single Room with AC",
    location: "500m from LPU Gate",
    price: 12000,
    originalPrice: 15000,
    rating: 4.8,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
    facilities: ["WiFi", "AC", "Meals", "Parking"],
    discount: 20
  },
  {
    id: "2", 
    title: "Cozy Shared Room for Girls",
    location: "Near University Market",
    price: 8000,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=250&fit=crop",
    facilities: ["WiFi", "Meals", "Laundry"],
  },
  {
    id: "3",
    title: "Premium Studio Apartment", 
    location: "Walking Distance to LPU",
    price: 18000,
    originalPrice: 20000,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
    facilities: ["WiFi", "Kitchen", "Parking", "Gym"],
    discount: 10
  },
  {
    id: "4",
    title: "Boys Hostel - Triple Sharing",
    location: "LPU Campus Area",
    price: 6500,
    rating: 4.4,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop",
    facilities: ["WiFi", "Meals", "Study Room"],
  },
  {
    id: "5",
    title: "Modern Single Room with Balcony",
    location: "Phagwara City Center",
    price: 14000,
    rating: 4.7,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop",
    facilities: ["WiFi", "AC", "Balcony", "Parking"],
  },
  {
    id: "6",
    title: "Budget Friendly Double Room",
    location: "Near LPU Back Gate",
    price: 9500,
    originalPrice: 11000,
    rating: 4.3,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop",
    facilities: ["WiFi", "Meals", "Common Area"],
    discount: 15
  }
];

const FeaturedRooms = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Featured Student Rooms
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked accommodations that offer the best value and comfort for LPU students
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Rooms
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;