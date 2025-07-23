
'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from '@/hooks/use-toast';

// Fix for default icon issue with webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    className: 'hue-rotate-[240deg]' // Makes it blueish
});

interface LiveDeliveryMapProps {
  customerLocation: { lat: number; lng: number };
  customerAddress: string;
  isTracking?: boolean;
}

export function LiveDeliveryMap({ customerLocation, customerAddress, isTracking = false }: LiveDeliveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const { toast } = useToast();

  const [driverPosition, setDriverPosition] = useState<L.LatLng | null>(null);
  const watcherRef = useRef<number | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const customerLatLng = new L.LatLng(customerLocation.lat, customerLocation.lng);

    mapRef.current = L.map(mapContainerRef.current, {
      center: customerLatLng,
      zoom: 13,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`,
      {
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(mapRef.current);

    // Add static customer marker
    L.marker(customerLatLng).addTo(mapRef.current);
    
    // Cleanup function
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [customerLocation]);

  // Start/Stop geolocation tracking
  useEffect(() => {
    if (!isTracking) {
      if (watcherRef.current !== null) {
        navigator.geolocation.clearWatch(watcherRef.current);
        watcherRef.current = null;
      }
      return;
    }

    watcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDriverPosition(new L.LatLng(latitude, longitude));
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
  }, [isTracking, toast]);

  // Update driver marker and map view
  useEffect(() => {
    if (!driverPosition || !mapRef.current) return;
    
    // Update marker
    if (!driverMarkerRef.current) {
        driverMarkerRef.current = L.marker(driverPosition, { icon: driverIcon }).addTo(mapRef.current);
    } else {
        driverMarkerRef.current.setLatLng(driverPosition);
    }

    // Update view
    const customerLatLng = new L.LatLng(customerLocation.lat, customerLocation.lng);
    const bounds = L.latLngBounds([driverPosition, customerLatLng]);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

    // Fetch and update route
    async function fetchAndUpdateRoute() {
        try {
            const apiKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;
            if (!apiKey) return;

            const locations = [{ lat: driverPosition!.lat, lon: driverPosition!.lng }, { lat: customerLocation.lat, lon: customerLocation.lng }];
            
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
                    routePolylineRef.current = L.polyline(decoded, { color: 'blue' }).addTo(mapRef.current!);
                }
            }
        } catch (error) {
            console.error("Failed to fetch route:", error);
        }
    }
    fetchAndUpdateRoute();

  }, [driverPosition, customerLocation]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}
