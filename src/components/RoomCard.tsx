import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, Car, Utensils, Star, Heart } from "lucide-react";
import { useState } from "react";

interface RoomCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  facilities: string[];
  discount?: number;
}

const RoomCard = ({ 
  id, 
  title, 
  location, 
  price, 
  originalPrice, 
  rating, 
  reviews, 
  image, 
  facilities,
  discount 
}: RoomCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const facilityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Meals': Utensils,
  };

  return (
    <Card className="group bg-gradient-card border-border hover:shadow-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
            {discount}% OFF
          </Badge>
        )}
        
        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-foreground rounded-full h-8 w-8"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        
        {/* Rating */}
        <div className="absolute bottom-3 right-3 bg-white/95 px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
          </div>
          
          {/* Facilities */}
          <div className="flex items-center gap-2">
            {facilities.slice(0, 3).map((facility) => {
              const Icon = facilityIcons[facility] || Wifi;
              return (
                <div key={facility} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  <span>{facility}</span>
                </div>
              );
            })}
            {facilities.length > 3 && (
              <span className="text-xs text-muted-foreground">+{facilities.length - 3} more</span>
            )}
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">₹{price.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString()}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">per month</span>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{reviews} reviews</div>
            </div>
          </div>
          
          <Button variant="premium" className="w-full" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;