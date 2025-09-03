import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CustomerDetails from "@/components/CustomerDetails";
import GMap from "@/components/GoogleMaps";
import Cart from "@/components/Cart";
import { log } from "console";

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export default function Checkout() {
  const { toast } = useToast();
  const mapRef = useRef<{ handleSubmit: () => void }>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [distance, setDistance] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ validate before proceeding
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing details",
        description: "Please enter your name and phone number.",
        variant: "destructive",
      });
      return;
    }
    console.log(formData);
    setCurrentStep(2);
  };

  const handleMapSubmit = () => {
    if (mapRef.current) {
      mapRef.current.handleSubmit();
      setCurrentStep(3);
    }
    console.log("joojo");
  };

  const handleDistanceCalculated = (distance: string) => {
    setDistance(distance);
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and will be delivered soon.",
      });
    }, 1500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerDetails
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleCustomerDetailsSubmit} // ✅ must be passed
          />
        );
      case 2:
        return (
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📍 Delivery Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <GMap
                  ref={mapRef}
                  onDistanceCalculated={handleDistanceCalculated}
                />
                <div className="flex justify-end">
                  <Button onClick={() => handleMapSubmit()}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return <Cart />;
      default:
        return null;
    }
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
            {currentStep === 1
              ? "Enter your details to continue"
              : currentStep === 2
              ? "Set your delivery location"
              : "Review your order and pay"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -z-10">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / 2) * 100}%`,
                }}
              />
            </div>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step <= currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span
              className={
                currentStep >= 1 ? "font-medium" : "text-muted-foreground"
              }
            >
              Details
            </span>
            <span
              className={
                currentStep >= 2 ? "font-medium" : "text-muted-foreground"
              }
            >
              Location
            </span>
            <span
              className={
                currentStep >= 3 ? "font-medium" : "text-muted-foreground"
              }
            >
              Payment
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {renderStep()}

          {currentStep > 1 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </Button>
              {currentStep == 3 && (
                <Button onClick={handlePlaceOrder} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
