'use client';

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, LocateFixed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LocationPicker({ form }: { form: any }) {
    const [isLocating, setIsLocating] = useState(false);
    const { toast } = useToast();

    const handleLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                form.setValue('latitude', latitude);
                form.setValue('longitude', longitude);
                
                // Reverse geocode to get address
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        form.setValue('address', data.display_name, { shouldValidate: true });
                    }
                } catch (error) {
                    console.error("Reverse geocoding failed:", error);
                }

                toast({ title: "Location found!", description: "Your address has been updated." });
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({ 
                    variant: "destructive", 
                    title: "Location access denied.",
                    description: "Please enable location permissions in your browser settings."
                });
                setIsLocating(false);
            }
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Delivery Address</CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button type="button" variant="outline" onClick={handleLocation} disabled={isLocating} className="w-full">
                    {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                    Use My Current Location
                </Button>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl><Input placeholder="e.g. 123 Ngong Road" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="apartment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apartment, Suite, etc.</FormLabel>
                                <FormControl><Input placeholder="e.g. Prestige Plaza, Apt. 5" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="landmark"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nearby Landmark</FormLabel>
                                <FormControl><Input placeholder="e.g. near Yaya Centre" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
