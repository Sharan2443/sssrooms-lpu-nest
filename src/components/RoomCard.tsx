import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Users } from "lucide-react";

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
  return (
    <Link to={`/room/${id}`}>
      <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              {discount}% OFF
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-foreground line-clamp-2">{title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
            </div>
            
            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviews})</span>
              </div>
            </div>
            
            {/* Facilities */}
            <div className="flex flex-wrap gap-1">
              {facilities.slice(0, 3).map((facility) => (
                <Badge key={facility} variant="secondary" className="text-xs">
                  {facility}
                </Badge>
              ))}
              {facilities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{facilities.length - 3} more
                </Badge>
              )}
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">₹{price.toLocaleString()}</span>
                  {originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">per month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RoomCard;