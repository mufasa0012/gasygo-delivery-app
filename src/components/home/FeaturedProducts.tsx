'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/ProductCard';
import { Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import * as React from 'react';

export function FeaturedProducts() {
  const [productsCollection, loading, error] = useCollection(
    query(collection(db, "products"), limit(8))
  );

  const featured: Product[] = productsCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)) || [];
  
  const plugin = React.useRef(
    Autoplay({ delay: 60000, stopOnInteraction: true })
  );

  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Popular Products</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">A selection of our most ordered gas cylinders and accessories.</p>
        </div>
        
        {loading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {error && <p className="text-destructive text-center">Error: {error.message}</p>}
        
        {!loading && !error && (
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featured.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/order">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
