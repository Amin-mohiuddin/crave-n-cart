import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
export default function GMap() {
  const defaultPosition = { lat: 17.335109, lng: 78 };
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="h-52">
        <Map
          zoom={10}
          center={defaultPosition}
          mapId="1e0e58eaf6e2f9d86850d621"
          gestureHandling={"greedy"}
        >
          <AdvancedMarker position={defaultPosition}></AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}
