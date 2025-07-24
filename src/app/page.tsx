'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShoppingCart, MapPin, Truck, MoveRight } from 'lucide-react';
import type { Product } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) }));
      setProducts(productsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full bg-primary/5">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center py-16 md:py-24">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
                Your Reliable Gas Partner,{' '}
                <span className="text-primary">Delivered!</span>
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground mx-auto md:mx-0">
                Get K-Gas, Total Gas, Afrigas, and more, delivered fast and
                free right to your doorstep in Nairobi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/ai-order">
                    Order Gas Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                 <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                    <Link href="#products">
                        Browse Products
                    </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-[450px] w-full">
              <Image
                src="https://placehold.co/600x450.png"
                alt="Gas delivery"
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
                data-ai-hint="gas delivery scooter"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Get Gas in 3 Simple Steps</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ordering your gas refill has never been easier. Follow these steps to get started.
              </p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <ShoppingCart className="h-8 w-8 text-primary"/>
                    </div>
                  <CardTitle className="mt-4 text-xl font-semibold">1. Choose Your Gas & Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Select from a wide range of gas brands and accessories.</p>
                </CardContent>
              </Card>
               <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <MapPin className="h-8 w-8 text-primary"/>
                    </div>
                  <CardTitle className="mt-4 text-xl font-semibold">2. Confirm Location & Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Share your location or enter your address and confirm your order.</p>
                </CardContent>
              </Card>
               <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Truck className="h-8 w-8 text-primary"/>
                    </div>
                  <CardTitle className="mt-4 text-xl font-semibold">3. Get Your Gas Delivered!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Relax while we deliver your order to your doorstep, fast and free.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="products" className="w-full py-20 md:py-28 bg-muted/20">
            <div className="container px-4 md:px-6">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Our Popular Products</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A selection of our most ordered gas cylinders and accessories.
                    </p>
                </div>
                <div className="mt-16">
                     <Carousel 
                        opts={{
                            align: "start",
                            loop: products.length > 3,
                        }}
                        className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl mx-auto"
                    >
                        <CarouselContent className="-ml-4">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1 h-full">
                                            <Card className="h-full">
                                                <CardContent className="p-4 flex flex-col gap-4">
                                                    <Skeleton className="aspect-square w-full" />
                                                    <Skeleton className="h-6 w-3/4" />
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-10 w-1/2" />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))
                            ) : (
                                products.map(product => (
                                    <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1 h-full">
                                            <ProductCard product={product} />
                                        </div>
                                    </CarouselItem>
                                ))
                            )}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
                    </Carousel>
                </div>
                 <div className="mt-12 text-center">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/products">
                            View All Products <MoveRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
