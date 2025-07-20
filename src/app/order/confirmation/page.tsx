import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-24 flex items-center justify-center">
            <Card className="w-full text-center shadow-xl">
                <CardHeader className="items-center">
                    <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
                    <CardTitle className="font-headline text-3xl">Thank You for Your Order!</CardTitle>
                    <CardDescription className="max-w-md">Your order has been received and is now being processed. You will receive an SMS/WhatsApp confirmation shortly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-left bg-secondary p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">What Happens Next?</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Order Number: <span className="font-mono bg-background px-2 py-1 rounded">GGO-12345</span></li>
                            <li>Estimated Delivery: <span className="font-semibold">30-60 minutes</span></li>
                            <li>You will be notified when a driver is assigned.</li>
                            <li>Prepare payment upon delivery if you chose Cash/M-Pesa.</li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                         <Button variant="outline" asChild>
                            <Link href="/contact">Contact Support</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
