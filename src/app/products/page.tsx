

'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/products';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductsPage() {
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
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Order Gas & Accessories
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Browse our full range of products and place your order for fast delivery.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 flex flex-col gap-4">
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-10 w-1/2" />
                        </CardContent>
                    </Card>
                ))
              ) : (
                products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
