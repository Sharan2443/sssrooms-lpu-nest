import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Shield, 
  Clock, 
  Star, 
  MapPin,
  CheckCircle
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SSSRooms</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted platform for finding quality student accommodations near LPU. 
            We connect students with verified room owners to ensure safe, comfortable, and affordable housing.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              To simplify the process of finding student accommodation by providing a reliable, 
              transparent, and user-friendly platform that connects students with quality housing options.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Verified and safe accommodations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Transparent pricing with no hidden fees</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Easy booking and management</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/placeholder.svg" 
              alt="Students in accommodation" 
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <CardTitle>Verified Properties</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All our properties are thoroughly verified to ensure safety, 
                cleanliness, and quality standards for student living.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-primary" />
                <CardTitle>Prime Locations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Strategic locations near LPU campus with easy access to 
                transportation, markets, and essential services.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <CardTitle>Quick Booking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple and fast booking process with instant confirmation 
                and direct communication with property owners.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Verified Properties</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Trusted Owners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose SSSRooms?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-3">For Students</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Wide range of accommodation options</li>
                <li>• Competitive and transparent pricing</li>
                <li>• Detailed property information and photos</li>
                <li>• Easy booking and payment process</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-3">For Property Owners</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Easy property listing process</li>
                <li>• Direct communication with students</li>
                <li>• Secure payment processing</li>
                <li>• Property management tools</li>
                <li>• Marketing support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;