import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { menuItems, categories, MenuItem } from "@/data/menuData";
import friedChickenImage from "@/assets/crispy-chicken-burger.jpg";

const Menu = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const filteredItems = menuItems.filter(item =>
    selectedCategory === "All" || item.category === selectedCategory
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });
  
  sortedItems.map(item => {
    if (item.image.startsWith("/api/placeholder")) {
      item.image = friedChickenImage;
    }
  });

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Our Menu
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our delicious selection of burgers, fried chicken, finger foods, and fitness options
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>

            {getCartItemCount() > 0 && (
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                Cart: {getCartItemCount()} items - ₹{getCartTotal()}
              </div>
            )}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-card border-border/50 hover:shadow-glow transition-all duration-300">
              <div className="aspect-video bg-muted relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.isPopular && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      ⭐ Popular
                    </Badge>
                  )}
                  {item.isNew && (
                    <Badge className="bg-accent text-accent-foreground">
                      🆕 New
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <div className="text-sm text-muted-foreground mb-2">
                    Category: {item.category}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-secondary">₹{item.price}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {cart[item.id] > 0 ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <span className="font-semibold min-w-[2rem] text-center">
                        {cart[item.id]}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="menu"
                      size="sm"
                      className="flex-1"
                      onClick={() => addToCart(item.id)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No items found in this category.</p>
          </div>
        )}

        {/* Checkout Button */}
        {getCartItemCount() > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={handleCheckout}
              disabled={getCartItemCount() === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;