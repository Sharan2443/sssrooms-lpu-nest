import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedRooms from "@/components/FeaturedRooms";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeaturedRooms />
    </div>
  );
};

export default Index;
