import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";

export default function GMap() {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 17.335109,
    lng: 78,
  });

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 17.335109,
    lng: 78,
  });

  const [zoom, setZoom] = useState(16);
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
          gestureHandling={"greedy"} // allow zoom + pan
          disableDefaultUI={false} // keep zoom controls, etc.
          onCenterChanged={(e) => {
            const newCenter = e.detail.center;
            setCenter({ lat: newCenter.lat, lng: newCenter.lng });
          }}
          onZoomChanged={(e) => {
            setZoom(e.detail.zoom);
          }}
          onDblClick={(e: MapMouseEvent) => {
            if (e.detail.latLng) {
              const lat = e.detail.latLng.lat;
              const lng = e.detail.latLng.lng;
              setPosition({ lat, lng });
            }
          }}
        >
          {/* Draggable Marker */}
          <AdvancedMarker
            position={position}
            draggable={true}
            onDragEnd={(e) => {
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (lat && lng) {
                setPosition({ lat, lng });
              }
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
          Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)} | Zoom:{" "}
          {zoom}
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
