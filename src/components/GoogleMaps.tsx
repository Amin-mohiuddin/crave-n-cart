import { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";

function LongPressHandler({ setPosition }: { setPosition: (pos: { lat: number; lng: number }) => void }) {
  const map = useMap();
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!map) return;

    const handleMouseDown = (e: google.maps.MapMouseEvent) => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);

      if (e.latLng) {
        longPressTimer.current = setTimeout(() => {
          setPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() });
        }, 600); // long press time
      }
    };

    const handleMouseUp = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    // Attach native Google Maps events
    const downListener = map.addListener("mousedown", handleMouseDown);
    const upListener = map.addListener("mouseup", handleMouseUp);
    const touchStartListener = map.addListener("touchstart", handleMouseDown);
    const touchEndListener = map.addListener("touchend", handleMouseUp);

    return () => {
      downListener.remove();
      upListener.remove();
      touchStartListener.remove();
      touchEndListener.remove();
    };
  }, [map, setPosition]);

  return null;
}


export default function GMap() {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 17.3846406,
    lng: 78.3827251,
  });
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 17.3846406,
    lng: 78.3827251,
  });
  const [zoom, setZoom] = useState(19);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Get current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setErrorMsg("Geolocation is not supported by your browser.");
    return;
  }

  setLoading(true);
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setPosition(coords);
      setCenter(coords);
      setErrorMsg(null);
      setLoading(false);
    },
    () => {
      setErrorMsg("Unable to retrieve your location.");
      setLoading(false);
    }
  );
};

// Auto fetch location on mount
useEffect(() => {
  getCurrentLocation();
}, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="h-96 relative">
        <Map
          zoom={zoom}
          center={center}
          mapId="1e0e58eaf6e2f9d86850d621"
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false} // removes map/satellite toggle
          fullscreenControl={false} //removes fullscreen control option
          clickableIcons={false}
          cameraControl={false}
          minZoom={19}
          streetViewControl={false}
          onCenterChanged={(e) => {
            const newCenter = e.detail.center;
            setCenter({ lat: newCenter.lat, lng: newCenter.lng });
          }}
          onZoomChanged={(e) => setZoom(e.detail.zoom)}
        >
          {/* ✅ Long press logic injected here */}
          <LongPressHandler setPosition={setPosition} />

          {/* Draggable Marker */}
          <AdvancedMarker
            position={position}
            draggable={true}
            onDragEnd={(e) => {
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (lat && lng) setPosition({ lat, lng });
            }}
          />
        </Map>
        {/* Floating button */}
        <button
          onClick={getCurrentLocation}
          className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow"
        >
          {loading ? "Locating..." : "📍 My Location"}
        </button>

        {/* Lat/Lng + Zoom info */}

        <div className="absolute bottom-2 left-2 bg-white px-3 py-1 rounded shadow text-sm">
          Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)} | Zoom: {zoom}
        </div>
        {/* Error display */}
        {errorMsg && (
          <div className="absolute bottom-14 left-2 bg-red-500 text-white px-3 py-1 rounded text-sm">
            {errorMsg}
          </div>
        )}
      </div>
    </APIProvider>
  );
}
