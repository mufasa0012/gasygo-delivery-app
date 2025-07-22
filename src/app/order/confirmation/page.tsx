'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    // This page is now a transitional page. We redirect to the new status page.
    useEffect(() => {
        if (orderId) {
            // Clear the cart from localStorage here as a final step.
            localStorage.removeItem('gasygo-cart');
            router.replace(`/order/status/${orderId}`);
        }
    }, [orderId, router]);


    if (!orderId) {
         return (
             <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">Generating your order...</h2>
                 <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary"/>
                <p className="text-muted-foreground">Please wait while we create your order tracking page.</p>
            </div>
         )
    }

    return (
        <Card className="w-full text-center shadow-xl">
            <CardHeader className="items-center">
                <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
                <CardTitle className="font-headline text-3xl">Order Placed Successfully!</CardTitle>
                <CardDescription className="max-w-md">Redirecting you to your order tracking page...</CardDescription>
            </CardHeader>
            <CardContent>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto"/>
            </CardContent>
        </Card>
    );
}


export default function ConfirmationPage() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-24 flex items-center justify-center">
            <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin" />}>
                <ConfirmationContent />
            </Suspense>
        </div>
    );
}
