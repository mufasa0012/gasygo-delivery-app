

'use client';

import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function ProductsPage() {
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
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
