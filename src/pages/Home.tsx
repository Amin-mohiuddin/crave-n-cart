import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-burger.jpg";
import friedChickenImage from "@/assets/fried-chicken.jpg";
import foodAssortmentImage from "@/assets/food-assortment.jpg";
import { menuItems } from "@/data/menuData";

const Home = () => {
  const popularItems = menuItems.filter(item => item.isPopular).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              I ❤️
            </span>{" "}
            <span className="text-foreground">Burgers</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of flavors with our signature burgers, 
            crispy fried chicken, spicy grabs, and delicious finger foods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="hero" asChild>
              <Link to="/menu">Explore Menu</Link>
            </Button>
            <Button variant="outline" size="hero" asChild>
              <Link to="/checkout">Order Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Best Sellers</h2>
            <p className="text-xl text-muted-foreground">
              Try our most loved dishes that have won hearts across the city
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {popularItems.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-card border-border/50 hover:shadow-glow transition-all duration-300">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={friedChickenImage} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    ★ Popular
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-secondary">₹{item.price}</span>
                    <Button variant="menu" size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">About I ❤️ Burgers</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Since our inception, I ❤️ Burgers has been dedicated to serving 
                the most delicious and satisfying fast food experience. Our commitment 
                to quality ingredients, authentic flavors, and exceptional service 
                has made us a favorite destination for food lovers.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                From our signature burgers crafted with premium ingredients to our 
                crispy fried chicken, spicy grabs and innovative finger foods, every dish is 
                prepared with love and attention to detail.
              </p>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={foodAssortmentImage} 
                alt="Food assortment" 
                className="rounded-lg shadow-card w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;