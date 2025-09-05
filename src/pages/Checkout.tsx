import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GMap from "@/components/GoogleMaps";
import { useCart } from "../components/CartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  User,
  Clock,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [mapDetails, setMapDetails] = useState<{
    googleMapsLink: string;
    distance: string;
    duration: string;
    deliveryFee?: number;
    position: { lat: number; lng: number };
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "",
    specialInstructions: "",
  });

  // Always get fresh items from context
  const orderItems = cartItems;
  console.log("Order Items:", orderItems);

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateQuantity = (itemId: string, change: number) => {
    if (change > 0) {
      addToCart(itemId);
    } else {
      removeFromCart(itemId);
    }
  };

  const removeItem = (itemId: string) => {
    // Keep removing until item gone
    const item = orderItems.find((i) => i.id === itemId);
    if (!item) return;
    for (let i = 0; i < item.quantity; i++) {
      removeFromCart(itemId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mapDetails) {
      toast({
        title: "Please confirm delivery location",
        description: "Lock and submit your location on the map.",
        variant: "destructive",
      });
      return;
    }

    const orderSummary = orderItems
      .map(
        (item) =>
          `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
      )
      .join("\n");

    const message = `
📦 *New Order Received* 📦

👤 Name: ${formData.name}
📞 Phone: ${formData.phone}
📍 Address: ${formData.address}, ${formData.city} - ${formData.pincode}

🗺️ Google Maps: ${mapDetails.googleMapsLink}
🚗 Distance: ${mapDetails.distance}
⏱️ Duration: ${mapDetails.duration}

🛒 *Order Items:*
${orderSummary}

💰 Subtotal: ₹${subtotal}
🚚 Delivery Fee: ₹${deliveryFee}
--------------------------------
🟢 *Total: ₹${total}*

💳 Payment Method: ${formData.paymentMethod}
📝 Instructions: ${formData.specialInstructions || "N/A"}
`;

    const whatsappNumber = "918639675595";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

    toast({
      title: "Order Placed Successfully!",
      description: `Your order has been sent to WhatsApp. Total: ₹${total}`,
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      paymentMethod: "",
      specialInstructions: "",
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
          <p className="text-muted-foreground">
            Complete your order and get delicious food delivered
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.length === 0 ? (
                  <p className="text-muted-foreground text-center">
                    Your cart is empty.
                  </p>
                ) : (
                  orderItems.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price} each
                          </p>
                        </div>
                        <span className="font-semibold">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                {orderItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-secondary">₹{total}</span>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-center">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Estimated delivery: 30-45 minutes
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-secondary" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="bg-muted border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter your phone number"
                      className="bg-muted border-border"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-secondary" />
                      Delivery Address
                    </h3>
                    <GMap
                      onLocationSubmit={(data) => {
                        setMapDetails(data);
                        if (data?.deliveryFee) {
                          setDeliveryFee(data.deliveryFee);
                        }
                      }}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter your complete address"
                        className="bg-muted border-border"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label>Payment Method *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        handleInputChange("paymentMethod", value)
                      }
                    >
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI Payment</SelectItem>
                        <SelectItem value="half">
                          Pay half now, rest on delivery
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={formData.specialInstructions}
                      onChange={(e) =>
                        handleInputChange("specialInstructions", e.target.value)
                      }
                      placeholder="Any special instructions (optional)"
                      className="bg-muted border-border"
                      rows={2}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    Place Order - ₹{total}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    By placing this order, you agree to our terms and
                    conditions.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
