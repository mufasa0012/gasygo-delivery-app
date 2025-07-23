
'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot, GeoPoint, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

// Fix for default icon issue with webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/gasygo.appspot.com/o/assets%2Fdriver-icon.png?alt=media&token=a55f9f38-600a-4a6c-9a4f-561b85352e84',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [1, -34],
});

interface LiveDeliveryMapProps {
  customerLocation: { lat: number; lng: number };
  customerAddress: string;
  isTracking?: boolean;
  driverId?: string;
}

export function LiveDeliveryMap({ customerLocation, customerAddress, isTracking = false, driverId }: LiveDeliveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const { toast } = useToast();

  const watcherRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;
    setIsLoading(true);

    const customerLatLng = new L.LatLng(customerLocation.lat, customerLocation.lng);

    mapRef.current = L.map(mapContainerRef.current).setView(customerLatLng, 13);

    L.tileLayer(
      `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`,
      {
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(mapRef.current);

    // Add static customer marker
    L.marker(customerLatLng).addTo(mapRef.current).bindPopup(`<b>Destination</b><br>${customerAddress}`).openPopup();
    
    setIsLoading(false);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [customerLocation, customerAddress]); // Only re-initialize if customer location changes

  // Handles tracking the driver's own location
  useEffect(() => {
    if (!isTracking || !driverId) return;

    watcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const driverGeoPoint = new GeoPoint(latitude, longitude);
        updateDoc(doc(db, "drivers", driverId), { location: driverGeoPoint });
      },
      (error) => {
        console.error("Geolocation watch error:", error);
        toast({
          variant: "destructive",
          title: "Location Tracking Error",
          description: "Could not track your location. Please ensure location permissions are enabled.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      if (watcherRef.current !== null) {
        navigator.geolocation.clearWatch(watcherRef.current);
      }
    };
  }, [isTracking, driverId, toast]);

  // Subscribes to driver location updates from Firestore
  useEffect(() => {
    if (!driverId || !mapRef.current) return;

    const unsubscribe = onSnapshot(doc(db, "drivers", driverId), (snapshot) => {
        const data = snapshot.data();
        if (data?.location && mapRef.current) {
            const { latitude, longitude } = data.location;
            const driverPosition = new L.LatLng(latitude, longitude);

            // Update marker
            if (!driverMarkerRef.current) {
                driverMarkerRef.current = L.marker(driverPosition, { icon: driverIcon }).addTo(mapRef.current);
            } else {
                driverMarkerRef.current.setLatLng(driverPosition);
            }

            // Update view and route
            const customerLatLng = new L.LatLng(customerLocation.lat, customerLocation.lng);
            const bounds = L.latLngBounds([driverPosition, customerLatLng]);
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });

            fetchAndUpdateRoute(driverPosition, customerLatLng, mapRef.current);
        }
    });

    return () => unsubscribe();

  }, [driverId, customerLocation]);

  // Helper function to fetch and draw the route
  const fetchAndUpdateRoute = async (start: L.LatLng, end: L.LatLng, map: L.Map) => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;
        if (!apiKey) return;

        const locations = [{ lat: start.lat, lon: start.lng }, { lat: end.lat, lon: end.lng }];
        
        const response = await fetch(`https://api.stadiamaps.com/route/v1?api_key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locations, costing: 'auto', units: 'kilometers', shape_format: 'polyline6' })
        });
        const data = await response.json();
        
        if (data.trip?.legs[0]?.shape) {
            // @ts-ignore
            const decoded = L.Polyline.fromEncoded(data.trip.legs[0].shape, { precision: 6 }).getLatLngs() as L.LatLng[];
            if (routePolylineRef.current) {
                routePolylineRef.current.setLatLngs(decoded);
            } else {
                routePolylineRef.current = L.polyline(decoded, { color: 'hsl(var(--primary))', weight: 5 }).addTo(map);
            }
        }
    } catch (error) {
        console.error("Failed to fetch route:", error);
        toast({
            variant: "destructive",
            title: "Routing Error",
            description: "Could not fetch the delivery route.",
        });
    }
  }


  return (
    <div className="relative h-full w-full">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
