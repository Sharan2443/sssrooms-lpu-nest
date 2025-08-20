import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Users, 
  Calendar,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  Loader2
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Room {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  original_price?: number;
  discount?: number;
  room_type: string;
  gender_preference?: string;
  facilities: string[];
  images: string[];
  contact_person?: string;
  contact_phone?: string;
  rating: number;
  total_reviews: number;
  available_from?: string;
  available_until?: string;
  max_occupancy: number;
  current_occupancy: number;
}

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room:', error);
      toast({
        title: "Error",
        description: "Failed to load room details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!room) return;

    setBookingLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            room_id: room.id,
            student_id: user.id,
            check_in: new Date().toISOString().split('T')[0],
            total_amount: room.price,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Booking Requested!",
        description: "Your booking request has been submitted. The owner will contact you soon.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Room not found</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img
                src={room.images[0] || "/placeholder.svg"}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {room.title}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{room.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{room.rating}</span>
                      <span>({room.total_reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary" className="capitalize">
                  {room.room_type}
                </Badge>
                {room.gender_preference && (
                  <Badge variant="outline" className="capitalize">
                    {room.gender_preference}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {room.current_occupancy}/{room.max_occupancy} occupied
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {room.description}
              </p>

              {/* Facilities */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((facility) => (
                    <Badge key={facility} variant="outline">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{room.price.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    {room.original_price && room.discount && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{room.original_price.toLocaleString()}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          {room.discount}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {room.available_from && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Available from: {new Date(room.available_from).toLocaleDateString()}</span>
                  </div>
                )}

                <Separator />

                <Button 
                  onClick={handleBooking}
                  className="w-full"
                  size="lg"
                  disabled={bookingLoading || room.current_occupancy >= room.max_occupancy}
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : room.current_occupancy >= room.max_occupancy ? (
                    'Fully Occupied'
                  ) : (
                    'Request Booking'
                  )}
                </Button>

                {room.contact_person && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Contact Owner</h4>
                      <p className="text-sm text-muted-foreground">
                        {room.contact_person}
                      </p>
                      {room.contact_phone && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;