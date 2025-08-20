import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import RoomCard from "./RoomCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Room {
  id: string;
  title: string;
  location: string;
  price: number;
  original_price?: number;
  discount?: number;
  rating: number;
  total_reviews: number;
  images: string[];
  facilities: string[];
}

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };
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
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard 
                key={room.id} 
                id={room.id}
                title={room.title}
                location={room.location}
                price={room.price}
                originalPrice={room.original_price}
                discount={room.discount}
                rating={room.rating}
                reviews={room.total_reviews}
                image={room.images[0] || "/placeholder.svg"}
                facilities={room.facilities}
              />
            ))}
          </div>
        )}
        
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