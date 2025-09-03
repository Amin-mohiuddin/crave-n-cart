import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, User } from "lucide-react";

interface CustomerDetailsProps {
  formData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CustomerDetails({
  formData,
  onInputChange,
  onSubmit,
}: CustomerDetailsProps) {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-secondary" />
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="bg-muted border-border"
                required
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
                onChange={(e) => onInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="bg-muted border-border"
                required
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Delivery Address
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                placeholder="Enter your street address"
                className="bg-muted border-border"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => onInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                  className="bg-muted border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => onInputChange("pincode", e.target.value)}
                  placeholder="Enter pincode"
                  className="bg-muted border-border"
                  required
                />
              </div>
            </div>
          </div>

          {/* ✅ Submit Button */}
          <div className="flex justify-end">
            <Button type="submit">Continue to Location</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
