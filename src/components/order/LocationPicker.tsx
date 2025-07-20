'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import Image from 'next/image';

interface LocationPickerProps {
    form: any;
}

export function LocationPicker({ form }: LocationPickerProps) {
    const [useManualAddress, setUseManualAddress] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationDetected, setLocationDetected] = useState(false);
    const { toast } = useToast();

    const handleLocationAccess = () => {
        setIsLocating(true);
        setLocationDetected(false);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, you would use a reverse geocoding service
                // to get an address from these coordinates.
                form.setValue('address', `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
                toast({
                    title: "Location Detected!",
                    description: "We've pinpointed your location for delivery.",
                });
                setIsLocating(false);
                setLocationDetected(true);
                setUseManualAddress(true); // Show the detected location in the input field
            },
            (error) => {
                toast({
                    variant: "destructive",
                    title: "Location Access Denied",
                    description: "Please enable location services or enter your address manually.",
                });
                setIsLocating(false);
                setUseManualAddress(true);
            }
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Delivery Address</CardTitle>
                {!useManualAddress && (
                    <CardDescription>
                       For the fastest delivery, please share your current location.
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {!useManualAddress ? (
                    <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                        <MapPin className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-lg">Enable Location for Faster Gas Delivery!</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md">
                            To ensure the quickest and most accurate delivery, we need to know your current location.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={handleLocationAccess} disabled={isLocating}>
                                {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
                                Allow Location Access
                            </Button>
                            <Button variant="secondary" onClick={() => setUseManualAddress(true)}>Enter Address Manually</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Name / Building Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Wabera Street, ICEA Building" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="apartment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>House/Apt Number</FormLabel>
                                        <FormControl><Input placeholder="e.g. Apt 5B" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="landmark"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Landmark</FormLabel>
                                        <FormControl><Input placeholder="Opposite XYZ Supermarket" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {locationDetected && (
                             <div className="relative w-full h-48 mt-4 rounded-lg overflow-hidden border">
                                <Image 
                                    src="https://placehold.co/600x400.png"
                                    alt="Map preview of the delivery location"
                                    data-ai-hint="nairobi map"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                             </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
