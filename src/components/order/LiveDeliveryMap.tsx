
'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map, Marker, LngLatLike } from 'maplibre-gl';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot, GeoPoint, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Globe, Satellite, Orbit, TrafficCone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const driverIconEl = document.createElement('div');
driverIconEl.className = "w-8 h-8 bg-blue-500 border-2 border-white rounded-full shadow-lg";

const customerIconEl = document.createElement('div');
customerIconEl.className = "w-8 h-8 bg-red-500 border-2 border-white rounded-full shadow-lg";


interface LiveDeliveryMapProps {
  customerLocation: { lat: number; lng: number };
  customerAddress: string;
  isTracking?: boolean;
  driverId?: string;
}

type MapStyle = 'Streets' | 'Satellite' | 'Hybrid';

export default function LiveDeliveryMap({ customerLocation, customerAddress, isTracking = false, driverId }: LiveDeliveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const driverMarkerRef = useRef<Marker | null>(null);
  const watcherRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapStyle>('Streets');
  const [is3D, setIs3D] = useState(false);
  const [trafficEnabled, setTrafficEnabled] = useState(true);


  const stadiaApiKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;

  // Track driver's own location
  useEffect(() => {
    if (!isTracking || !driverId) return;
    watcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const driverGeoPoint = new GeoPoint(latitude, longitude);
        updateDoc(doc(db, "drivers", driverId), { location: driverGeoPoint });
      },
      (error) => {
        console.error("Geolocation watch error:", error.message || "An unknown error occurred. It's likely location permissions were denied.");
        toast({ variant: "destructive", title: "Location Error", description: "Could not track your location. Please ensure location permissions are enabled for this site." });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => {
      if (watcherRef.current !== null) navigator.geolocation.clearWatch(watcherRef.current);
    };
  }, [isTracking, driverId, toast]);

  const getStyleUrl = (style: MapStyle) => {
      const baseUrl = `https://tiles.stadiamaps.com/styles`;
      switch(style) {
          case 'Satellite': return `${baseUrl}/alidade_satellite.json?api_key=${stadiaApiKey}`;
          case 'Hybrid': return `${baseUrl}/alidade_smooth_dark.json?api_key=${stadiaApiKey}`; // Using dark as a hybrid example
          case 'Streets':
          default: return `${baseUrl}/alidade_smooth.json?api_key=${stadiaApiKey}`;
      }
  }


  // Initialize and update map
  useEffect(() => {
    if (!mapContainerRef.current || !stadiaApiKey) return;

    const customerLngLat: LngLatLike = [customerLocation.lng, customerLocation.lat];

    if (!mapRef.current) {
        mapRef.current = new Map({
            container: mapContainerRef.current,
            style: getStyleUrl(mapStyle),
            center: customerLngLat,
            zoom: 13,
        });

        mapRef.current.on('load', () => {
            new Marker({element: customerIconEl}).setLngLat(customerLngLat).setPopup(new maplibregl.Popup().setText(customerAddress)).addTo(mapRef.current!);
            setIsLoading(false);
        });
    } else {
       mapRef.current.setStyle(getStyleUrl(mapStyle));
    }
    
    const map = mapRef.current;

    // Traffic Layer Logic
    map.on('style.load', () => {
        if(trafficEnabled && mapStyle === 'Streets') {
            map.addSource('stadia_traffic', {
                type: 'vector',
                tiles: [`https://tiles.stadiamaps.com/data/openmaptiles/{z}/{x}/{y}.pbf?api_key=${stadiaApiKey}`],
            });
            map.addLayer({
                'id': 'traffic',
                'type': 'line',
                'source': 'stadia_traffic',
                'source-layer': 'transportation',
                'filter': ['==', ['get', 'class'], 'motorway'],
                 'layout': { 'line-join': 'round', 'line-cap': 'round' },
                 'paint': {
                     'line-color': ['match', ['get', 'congestion'], 'low', '#30a13c', 'moderate', '#ff8c00', 'heavy', '#e34234', 'severe', '#8b0000', '#cccccc'],
                     'line-width': 4
                }
            });
        }
    });

    const unsubscribe = onSnapshot(doc(db, "drivers", driverId!), (snapshot) => {
        const driverData = snapshot.data();
        if (driverData?.location) {
            const { latitude, longitude } = driverData.location;
            const driverLngLat: LngLatLike = [longitude, latitude];

            if (!driverMarkerRef.current) {
                driverMarkerRef.current = new Marker({element: driverIconEl}).setLngLat(driverLngLat).addTo(map);
            } else {
                driverMarkerRef.current.setLngLat(driverLngLat);
            }
            
            fetchAndUpdateRoute(driverLngLat, customerLngLat, map);
            map.fitBounds([driverLngLat, customerLngLat], { padding: 80, maxZoom: 15 });
        }
    });

    return () => {
        unsubscribe();
        // Do not remove the map on cleanup to prevent re-initialization issues.
    };
  }, [driverId, customerLocation, stadiaApiKey, mapStyle, trafficEnabled, customerAddress]); // Rerun on style change

  const fetchAndUpdateRoute = async (start: LngLatLike, end: LngLatLike, map: Map) => {
    try {
        const response = await fetch(`https://api.stadiamaps.com/route/v1?api_key=${stadiaApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                locations: [{ lon: (start as number[])[0], lat: (start as number[])[1] }, { lon: (end as number[])[0], lat: (end as number[])[1] }],
                costing: 'auto',
                units: 'kilometers',
                shape_format: 'geojson',
            })
        });
        const data = await response.json();

        if (data.trip?.legs[0]?.shape) {
            const routeGeoJSON = data.trip.legs[0].shape;
            if (map.getSource('route')) {
                (map.getSource('route') as maplibregl.GeoJSONSource).setData(routeGeoJSON);
            } else {
                map.addSource('route', { type: 'geojson', data: routeGeoJSON });
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#FF8533', 'line-width': 6 }
                });
            }
        }
    } catch (error) {
        console.error("Failed to fetch route:", error);
    }
  }
  
  const toggle3D = () => {
      if(!mapRef.current) return;
      const newIs3D = !is3D;
      setIs3D(newIs3D);
      if(newIs3D){
          mapRef.current.setPitch(60);
          mapRef.current.setBearing(30);
      } else {
          mapRef.current.setPitch(0);
          mapRef.current.setBearing(0);
      }
  }


  return (
    <div className="relative h-full w-full">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 z-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        <div ref={mapContainerRef} className="h-full w-full" />
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            <Button variant={mapStyle === 'Streets' ? 'default' : 'secondary'} size="sm" onClick={() => setMapStyle('Streets')}><Globe className="mr-2 h-4 w-4"/> Streets</Button>
            <Button variant={mapStyle === 'Satellite' ? 'default' : 'secondary'} size="sm" onClick={() => setMapStyle('Satellite')}><Satellite className="mr-2 h-4 w-4"/> Satellite</Button>
            <Button variant={is3D ? 'default' : 'secondary'} size="sm" onClick={toggle3D}><Orbit className="mr-2 h-4 w-4"/> {is3D ? '2D' : '3D'} View</Button>
            <Button variant={trafficEnabled ? 'default' : 'secondary'} size="sm" onClick={() => setTrafficEnabled(!trafficEnabled)}><TrafficCone className="mr-2 h-4 w-4"/> Traffic</Button>
        </div>
    </div>
  );
}
