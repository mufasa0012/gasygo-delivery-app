'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    className: 'hue-rotate-180' // Makes it blueish
});

interface LiveDeliveryMapProps {
  customerLocation: { lat: number; lng: number };
  customerAddress: string;
  isTracking?: boolean; // Set to true to enable live tracking of the user's location
}

// Component to handle map updates
function MapUpdater({ driverPosition, customerLocation, route }: { driverPosition: L.LatLng | null, customerLocation: L.LatLng, route: L.LatLng[] }) {
    const map = useMap();
    useEffect(() => {
        if (driverPosition) {
            const bounds = L.latLngBounds([driverPosition, customerLocation]);
            if(route.length > 0) {
                bounds.extend(route);
            }
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(customerLocation, 13);
        }
    }, [driverPosition, customerLocation, route, map]);
    return null;
}

export function LiveDeliveryMap({ customerLocation, customerAddress, isTracking = false }: LiveDeliveryMapProps) {
  const [driverPosition, setDriverPosition] = useState<L.LatLng | null>(null);
  const [route, setRoute] = useState<L.LatLng[]>([]);
  const { toast } = useToast();
  const watcherRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isTracking) return;

    watcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = new L.LatLng(latitude, longitude);
        setDriverPosition(newPos);
      },
      (error) => {
        console.error("Geolocation watch error:", error);
        toast({
          variant: "destructive",
          title: "Location Tracking Error",
          description: "Could not track your location. Please ensure location permissions are enabled.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      if (watcherRef.current !== null) {
        navigator.geolocation.clearWatch(watcherRef.current);
      }
    };
  }, [isTracking, toast]);

  useEffect(() => {
    async function fetchRoute() {
        if (!driverPosition) return;
        
        try {
            const apiKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;
            if (!apiKey) {
                console.error("Stadia Maps API key is not configured.");
                return;
            }

            const locations = [
                { lat: driverPosition.lat, lon: driverPosition.lng },
                { lat: customerLocation.lat, lon: customerLocation.lng }
            ];

            const response = await fetch(`https://api.stadiamaps.com/route/v1?api_key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locations,
                    costing: 'auto',
                    units: 'kilometers',
                    language: 'en',
                    shape_format: 'polyline6'
                })
            });

            const data = await response.json();

            if (data.trip && data.trip.legs[0].shape) {
                const decoded = L.Polyline.fromEncoded(data.trip.legs[0].shape, {
                    // @ts-ignore
                    precision: 6
                }).getLatLngs() as L.LatLng[];
                setRoute(decoded);
            }
        } catch (error) {
            console.error("Failed to fetch route:", error);
            toast({
                variant: 'destructive',
                title: 'Routing Error',
                description: 'Could not calculate the delivery route.'
            })
        }
    }

    if (driverPosition) {
        fetchRoute();
    }
  }, [driverPosition, customerLocation, toast]);

  const customerLatLng = new L.LatLng(customerLocation.lat, customerLocation.lng);

  return (
    <MapContainer center={customerLatLng} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`}
      />
      <Marker position={customerLatLng}>
        
      </Marker>
      {driverPosition && <Marker position={driverPosition} icon={driverIcon} />}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
      <MapUpdater driverPosition={driverPosition} customerLocation={customerLatLng} route={route} />
    </MapContainer>
  );
}
