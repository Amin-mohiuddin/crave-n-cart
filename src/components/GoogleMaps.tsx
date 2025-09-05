import { useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

interface GMapProps {
  onLocationSubmit?: (data: {
    googleMapsLink: string;
    distance: string;
    duration: string;
    deliveryFee?: number;
    position: { lat: number; lng: number };
  }) => void;
}

export default function GMap({ onLocationSubmit }: GMapProps) {
  const defaultPosition = { lat: 17.335109, lng: 78 };
  const burgerShop = { lat: 17.3817077, lng: 78.4217834 };

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [position, setPosition] = useState(defaultPosition);
  const [zoom, setZoom] = useState(16);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    recenter();
  }, []);

  const recenter = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const p = { lat: coords.latitude, lng: coords.longitude };
        setPosition(p);
        if (map) {
          map.setCenter(p);
          map.setZoom(17);
        }
        navigator.geolocation.clearWatch(watchId);
      },
      (err) => {
        console.error("Geolocation error:", err.code, err.message);
        alert("Unable to get location. Please check GPS/location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const toggleLock = () => {
    if (!locked) {
      const confirmLock = confirm("Finalize this location?");
      if (confirmLock) {
        setLocked(true);
        if (map) {
          map.setOptions({
            draggable: false,
            zoomControl: false,
            scrollwheel: false,
          });
        }
      }
    } else {
      setLocked(false);
      if (map) {
        map.setOptions({
          draggable: true,
          zoomControl: true,
          scrollwheel: true,
        });
      }
    }
  };

  const handleSubmit = () => {
    const googleMapsLink = `https://www.google.com/maps?q=${position.lat},${position.lng}`;

    if (!window.google || !window.google.maps) {
      alert("Google Maps SDK not loaded yet");
      return;
    }

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [burgerShop],
        destinations: [position],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response) {
          const element = response.rows[0].elements[0];
          if (element.status === "OK") {
            const distanceText = element.distance?.text || "N/A";
            const durationText = element.duration?.text || "N/A";
            const dFee = 5 * (element.distance?.value || 0) / 1000; // Example: $5 per km
            onLocationSubmit?.({
              googleMapsLink,
              distance: distanceText,
              duration: durationText,
              deliveryFee: dFee,
              position,
            });

            console.log("Google Maps Link:", googleMapsLink);
            console.log("Distance:", distanceText);
            console.log("Duration:", durationText);
          } else {
            alert("Could not calculate distance.");
          }
        } else {
          console.error("DistanceMatrix error:", status, response);
          alert("Error calculating route distance.");
        }
      }
    );
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="relative h-[70vh] w-full">
        <Map
          center={position}
          zoom={zoom}
          mapId="1e0e58eaf6e2f9d86850d621"
          gestureHandling="greedy"
          disableDefaultUI={false}
          options={{
            zoomControl: true,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
          onLoad={(m) => setMap(m)}
          onCameraChanged={(ev) => {
            if (!locked) {
              setPosition(ev.detail.center);
              setZoom(ev.detail.zoom);
            }
          }}
        />

        {/* Fixed Pin */}
        <div className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 text-4xl drop-shadow">
          📍
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
          <button
            type="button"
            onClick={recenter}
            className="px-4 py-2 rounded-xl bg-black text-white shadow-md"
          >
            My Location
          </button>
          <button
            type="button"
            onClick={toggleLock}
            className={`px-4 py-2 rounded-xl ${locked ? "bg-red-600" : "bg-green-600"
              } text-white shadow-md`}
          >
            {locked ? "Unlock" : "Lock"}
          </button>
          {locked && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow-md"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </APIProvider>
  );
}
