import Cart from "@/components/Cart";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import GMap from "@/components/GoogleMaps";
export default function Checkout() {
  return (
    <>
      <Cart />
      <GMap/>
    </>
  );
}