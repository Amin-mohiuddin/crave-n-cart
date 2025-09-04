import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { menuItems, categories, MenuItem } from "@/data/menuData";
import { useEffect } from "react";
function getItemPriceById(id: string): number | undefined {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  return item?.price;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// ✅ Cart props interface
interface CartProps {
  deliveryFee: number;
  cart: { [key: string]: number };
  onCartChange?: (items: OrderItem[]) => void; // 👈 callback
}

const Cart = ({ deliveryFee, cart, onCartChange }: CartProps) => {
  const { toast } = useToast();
  const [orderItems, setOrderItems] = useState<OrderItem[]>(() =>
    Object.entries(cart)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => {
        const menuItem = menuItems.find((item) => item.id === id);
        return {
          id,
          name: menuItem?.name || `Item ${id}`,
          price: menuItem?.price ?? 0,
          quantity,
        };
      })
  );
  useEffect(() => {
    if (onCartChange) {
      onCartChange(orderItems);
    }
  }, [orderItems, onCartChange]);

  const [formData, setFormData] = useState({
    paymentMethod: "",
    specialInstructions: "",
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Order Placed Successfully!",
      description: `Your order will be delivered in 30-45 minutes. Order total: ₹${total}`,
    });

    setFormData({
      paymentMethod: "",
      specialInstructions: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Special Instructions */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    handleInputChange("specialInstructions", e.target.value)
                  }
                  placeholder="Any special instructions for your order?"
                  className="min-h-[100px] bg-muted border-border"
                />
              </CardContent>
            </Card>
            {/* Payment Method */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
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
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="upi">UPI Payment</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
