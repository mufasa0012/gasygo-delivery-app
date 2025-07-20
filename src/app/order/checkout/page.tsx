import { CheckoutForm } from "@/components/order/CheckoutForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/lib/data";

const mockCart = [
    { product: products[0], quantity: 1 },
    { product: products[7], quantity: 1 },
];
const mockTotal = mockCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

export default function CheckoutPage() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Checkout</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Just a few more steps to get your order delivered.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <CheckoutForm />
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline">Order Summary</CardTitle>
                            <CardDescription>Review your items before placing the order.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {/* In a real app, this data would come from a cart context or state */}
                            {mockCart.map(item => (
                                <div key={item.product.id} className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm">Ksh {(item.product.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                             <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>Ksh {mockTotal.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
