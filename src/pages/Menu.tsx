import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { menuItems, categories } from "@/data/menuData";
import friedChickenImage from "@/assets/crispy-chicken-burger.jpg";
import { useCart } from "@/components/CartContext";
import { Link } from "react-router-dom";

const Menu = () => {
  const { cart, cartItems, addToCart, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const filteredItems = menuItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
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

  sortedItems.forEach((item) => {
    if (item.image.startsWith("/api/placeholder")) {
      item.image = friedChickenImage;
    }
  });

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🟢 Log cart state whenever it changes
  useEffect(() => {
    console.log("Raw cart object:", cart);
    console.log("Cart items array:", cartItems);
  }, [cart, cartItems]);

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
            Discover our delicious selection
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

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.isPopular && (
                    <Badge className="bg-secondary">⭐ Popular</Badge>
                  )}
                  {item.isNew && <Badge className="bg-accent">🆕 New</Badge>}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold">₹{item.price}</span>
                </div>

                <div className="flex items-center gap-2">
                  {cart[item.id] > 0 ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        -
                      </Button>
                      <span>{cart[item.id]}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item.id)}
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

        {/* Checkout Button */}
        {getCartItemCount() > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button variant="hero" size="lg" asChild>
              <Link to="/checkout">
                Checkout ({getCartItemCount()}) - ₹{getCartTotal()}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
