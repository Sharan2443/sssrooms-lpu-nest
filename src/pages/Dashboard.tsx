import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Calendar, 
  MapPin, 
  IndianRupee,
  Clock,
  Star,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  university_id?: string;
  year_of_study?: number;
  course?: string;
  is_admin: boolean;
}

interface Booking {
  id: string;
  check_in: string;
  check_out?: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  rooms: {
    title: string;
    location: string;
    images: string[];
  };
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms:room_id (
            title,
            location,
            images
          )
        `)
        .eq('student_id', user?.id)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.full_name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your bookings and profile
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start exploring rooms to find your perfect accommodation
                  </p>
                  <Button>Browse Rooms</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {booking.rooms?.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-4 w-4" />
                            {booking.rooms?.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-semibold">
                            <IndianRupee className="h-4 w-4" />
                            {booking.total_amount.toLocaleString()}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge 
                              variant="secondary"
                              className={`${getStatusColor(booking.status)} text-white`}
                            >
                              {booking.status}
                            </Badge>
                            <Badge variant="outline">
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Check-in: {new Date(booking.check_in).toLocaleDateString()}</span>
                        </div>
                        {booking.check_out && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Check-out: {new Date(booking.check_out).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Booked: {new Date(booking.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.full_name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.email}</span>
                    </div>
                  </div>

                  {profile?.phone && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                      </div>
                    </div>
                  )}

                  {profile?.university_id && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        University ID
                      </label>
                      <div className="p-2 bg-muted rounded-md">
                        <span>{profile.university_id}</span>
                      </div>
                    </div>
                  )}

                  {profile?.course && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Course
                      </label>
                      <div className="p-2 bg-muted rounded-md">
                        <span>{profile.course}</span>
                      </div>
                    </div>
                  )}

                  {profile?.year_of_study && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Year of Study
                      </label>
                      <div className="p-2 bg-muted rounded-md">
                        <span>{profile.year_of_study}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {profile?.is_admin && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Admin Access
                  </CardTitle>
                  <CardDescription>
                    You have administrator privileges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full md:w-auto">
                    Go to Admin Panel
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;