'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationPicker } from "./LocationPicker";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addDoc, collection, serverTimestamp, GeoPoint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/lib/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().regex(/^0\d{9}$/, { message: "Please enter a valid Kenyan phone number." }),
    address: z.string().min(5, { message: "Please provide a valid address." }),
    apartment: z.string().optional(),
    landmark: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    paymentMethod: z.enum(["mpesa", "cash"], { required_error: "You need to select a payment method." }),
    notes: z.string().optional(),
});

interface CheckoutFormProps {
    cart: CartItem[];
    total: number;
}

export function CheckoutForm({ cart, total }: CheckoutFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            apartment: "",
            landmark: "",
            notes: "",
            paymentMethod: "mpesa",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (cart.length === 0) {
            toast({
                variant: "destructive",
                title: "Your cart is empty!",
                description: "Please add items to your cart before placing an order."
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData: any = {
                customerName: values.name,
                customerPhone: values.phone,
                deliveryAddress: `${values.address}, ${values.apartment || ''}, near ${values.landmark || ''}`.trim(),
                items: cart.map(item => ({...item, product: {...item.product}})), // de-proxify product
                total: total,
                status: 'Pending',
                paymentMethod: values.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery',
                notes: values.notes || '',
                createdAt: serverTimestamp(),
            };

            if (values.latitude && values.longitude) {
                orderData.location = new GeoPoint(values.latitude, values.longitude);
            }


            const docRef = await addDoc(collection(db, "orders"), orderData);

            // We no longer remove the cart here. It will be removed on the confirmation page
            // to ensure it persists if the user navigates back.

            toast({
                title: "Order Placed!",
                description: "Redirecting to your order status page."
            });
            
            router.push(`/order/confirmation?orderId=${docRef.id}`);

        } catch (error) {
            console.error("Error creating order: ", error);
            toast({
                variant: "destructive",
                title: "Oh no! Something went wrong.",
                description: "There was a problem placing your order. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl><Input placeholder="0712345678" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <LocationPicker form={form} />
                
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Payment Method</CardTitle>
                        <CardDescription>Choose how you'd like to pay.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-2"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="mpesa" /></FormControl>
                                                <FormLabel className="font-normal">M-Pesa (Pay on Delivery)</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="cash" /></FormControl>
                                                <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="mt-4 text-sm text-muted-foreground bg-secondary p-4 rounded-md">
                            Our M-Pesa Till Number is <strong className="text-foreground">123456</strong>. Please complete payment upon delivery confirmation.
                        </div>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Order Notes (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea placeholder="e.g. Call upon arrival, leave with watchman..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>


                <Button type="submit" size="lg" className="w-full text-lg font-bold" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                </Button>
            </form>
        </Form>
    );
}
