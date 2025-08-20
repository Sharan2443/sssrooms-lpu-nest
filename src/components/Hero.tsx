import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-building.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Student accommodation building" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-secondary to-primary-glow bg-clip-text text-transparent">
              Student Home
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Discover comfortable, affordable accommodation near LPU campus. 
            Safe, modern rooms with all amenities for your university journey.
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-luxury">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <Input 
                  placeholder="Near LPU, Phagwara..." 
                  className="bg-white border-border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Move-in Date
                </label>
                <Input 
                  type="date" 
                  className="bg-white border-border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Occupancy
                </label>
                <select className="w-full h-10 px-3 py-2 bg-white border border-border rounded-md text-sm">
                  <option>Single</option>
                  <option>Shared</option>
                  <option>Triple</option>
                </select>
              </div>
            </div>
            
            <Button variant="hero" size="lg" className="w-full mt-6">
              <Search className="h-5 w-5 mr-2" />
              Search Rooms
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/80">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-white/80">Verified Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;