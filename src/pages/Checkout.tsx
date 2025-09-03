import Cart from "@/components/Cart";
import GMap from "@/components/GoogleMaps";
import { useRef, useState } from "react";

export default function Checkout() {
  const gmapRef = useRef<{ handleSubmit: () => void } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  const handleMasterSubmit = () => {
    if (gmapRef.current) {
      gmapRef.current.handleSubmit(); // triggers GMap's submit
    }
    
  };

  return (
    <>
      <Cart />
      <GMap ref={gmapRef} onDistanceCalculated={setDistance} />

      {/* Master Submit Button */}
      <button
        onClick={handleMasterSubmit}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
      >
        Master Submit
      </button>

      {distance && (
        <p className="mt-2 text-sm text-gray-700">
          Distance from shop: {distance}
        </p>
      )}
    </>
  );
}
