import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CustomerDetails from "@/components/CustomerDetails";
import GMap from "@/components/GoogleMaps";
import Cart from "@/components/Cart";
import { useLocation, useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface LocationState {
  cart: { [key: string]: number };
}

export default function Checkout() {
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<any>(null); // ✅ store full response
  const [finalCart, setFinalCart] = useState<any>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };
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
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = {} } = (location.state as LocationState) || {};

  if (Object.keys(cart).length === 0) {
    navigate("/menu");
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleDistanceCalculated = (distance: string) => {
    setDistance(distance);
  };

  const handleUpload = async () => {
    if (!paymentFile) {
      toast({
        title: "No file selected",
        description: "Please upload your payment screenshot.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", paymentFile);

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setUploadResponse(result); // ✅ keep full API response

      toast({
        title: "Upload Successful!",
        description: "Your payment screenshot has been uploaded.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
    console.log(cart);
  };

  const handlePlaceOrder = () => {
    if (!uploadResponse) {
      toast({
        title: "Payment Required",
        description:
          "Please upload your payment screenshot before placing order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const orderMessage = `
📦 *New Order Received!*

👤 Customer:
Name: ${formData.name || ""}
Phone: ${formData.phone || ""}
Address: ${formData.address || ""}
Distance: ${distance || "N/A"} km

🛒 Order Items:
${finalCart
  .map(
    (item) =>
      `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
  )
  .join("\n")}
📷 Payment Proof: ${uploadResponse['image_url'] || "N/A"}
`.trim();
      const whatsappNumber = "+918919592322"; // 👈 Your WhatsApp number with country code (no +)
      const encodedMessage = encodeURIComponent(orderMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank"); // opens WhatsApp
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and will be delivered soon.",
      });
    }, 1500);
    console.log(uploadResponse);
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
        return (
          <div className="space-y-6">
            <Cart
              cart={cart}
              deliveryFee={parseFloat(distance) * 20}
              onCartChange={(final_Cart) => {
                setFinalCart(final_Cart);
              }}
            />

            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💳 Upload Payment Screenshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <Button
                  onClick={handleUpload}
                  disabled={uploading || !paymentFile}
                  className="flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" /> Upload Screenshot
                    </>
                  )}
                </Button>

                {uploadResponse?.url && (
                  <div className="mt-4 space-y-2">
                    <p className="text-green-600 text-sm">
                      ✅ Screenshot uploaded
                    </p>
                    <img
                      src={uploadResponse.url}
                      alt="Payment Screenshot"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
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
