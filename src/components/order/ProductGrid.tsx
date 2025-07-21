'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/shared/ProductCard';
import { Loader2 } from 'lucide-react';

export function ProductGrid() {
  const [productsCollection, loading, error] = useCollection(collection(db, 'products'));
  const products: Product[] = productsCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)) || [];

  const handleAddToCart = (product: Product) => {
    // Dispatch a custom event that the CartSidebar can listen for.
    // This is a temporary solution; a proper global state manager would be better.
    document.dispatchEvent(new CustomEvent('addToCart', { detail: { product } }));
  };

  return (
    <>
      {loading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      {error && <p className="text-destructive text-center">Error: {error.message}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </>
  );
}
