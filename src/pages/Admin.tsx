import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Home, 
  Calendar,
  IndianRupee,
  Star,
  Loader2,
  Settings
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
  rating: number;
  total_reviews: number;
  is_available: boolean;
  max_occupancy: number;
  current_occupancy: number;
}

interface Booking {
  id: string;
  student_id: string;
  check_in: string;
  total_amount: number;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
  rooms: {
    title: string;
    location: string;
  };
}

const Admin = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newRoomDialog, setNewRoomDialog] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data.is_admin) {
        setIsAdmin(true);
        fetchAdminData();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);

      // Fetch all bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:student_id (
            full_name,
            email
          ),
          rooms:room_id (
            title,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const roomData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      price: parseInt(formData.get('price') as string),
      original_price: formData.get('original_price') ? parseInt(formData.get('original_price') as string) : null,
      room_type: formData.get('room_type') as string,
      gender_preference: formData.get('gender_preference') as string || null,
      max_occupancy: parseInt(formData.get('max_occupancy') as string),
      facilities: (formData.get('facilities') as string).split(',').map(f => f.trim()),
      images: [(formData.get('image_url') as string)],
      contact_person: formData.get('contact_person') as string,
      contact_phone: formData.get('contact_phone') as string,
    };

    // Calculate discount if original price is provided
    if (roomData.original_price && roomData.original_price > roomData.price) {
      const discount = Math.round(((roomData.original_price - roomData.price) / roomData.original_price) * 100);
      Object.assign(roomData, { discount });
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .insert([roomData]);

      if (error) throw error;

      toast({
        title: "Room Created",
        description: "New room has been added successfully",
      });

      setNewRoomDialog(false);
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      toast({
        title: "Room Deleted",
        description: "Room has been removed successfully",
      });

      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status}`,
      });

      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have administrator privileges to access this page.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage rooms, bookings, and platform settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{rooms.length}</p>
                </div>
                <Home className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Bookings</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Rooms</p>
                  <p className="text-2xl font-bold">
                    {rooms.filter(r => r.is_available).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="rooms">Manage Rooms</TabsTrigger>
            <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Rooms</h2>
              <Dialog open={newRoomDialog} onOpenChange={setNewRoomDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>
                      Create a new room listing for students
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateRoom} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Room Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" required />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹/month)</Label>
                        <Input id="price" name="price" type="number" required />
                      </div>
                      <div>
                        <Label htmlFor="original_price">Original Price (optional)</Label>
                        <Input id="original_price" name="original_price" type="number" />
                      </div>
                      <div>
                        <Label htmlFor="room_type">Room Type</Label>
                        <Select name="room_type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="double">Double</SelectItem>
                            <SelectItem value="triple">Triple</SelectItem>
                            <SelectItem value="shared">Shared</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gender_preference">Gender Preference</Label>
                        <Select name="gender_preference">
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="max_occupancy">Max Occupancy</Label>
                        <Input id="max_occupancy" name="max_occupancy" type="number" required />
                      </div>
                      <div>
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input id="contact_person" name="contact_person" />
                      </div>
                      <div>
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input id="contact_phone" name="contact_phone" />
                      </div>
                      <div>
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input id="image_url" name="image_url" type="url" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                      <Input 
                        id="facilities" 
                        name="facilities" 
                        placeholder="WiFi, AC, Parking, Meals"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setNewRoomDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Room</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{room.title}</h3>
                        <p className="text-muted-foreground mb-2">{room.location}</p>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            <span className="font-medium">{room.price.toLocaleString()}/month</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {room.room_type}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">
                              {room.current_occupancy}/{room.max_occupancy}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{room.rating} ({room.total_reviews})</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {room.facilities.slice(0, 3).map((facility) => (
                            <Badge key={facility} variant="secondary" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                          {room.facilities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{room.facilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-xl font-semibold">All Bookings</h2>
            
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {booking.rooms?.title}
                        </h3>
                        <p className="text-muted-foreground mb-2">{booking.rooms?.location}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Student:</span> {booking.profiles?.full_name}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {booking.profiles?.email}
                          </div>
                          <div>
                            <span className="font-medium">Check-in:</span> {new Date(booking.check_in).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span> ₹{booking.total_amount.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Booked:</span> {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge 
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                          className="mb-2"
                        >
                          {booking.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={booking.status === 'confirmed'}
                          >
                            Confirm
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={booking.status === 'cancelled'}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;