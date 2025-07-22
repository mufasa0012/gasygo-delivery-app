'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, CartItem } from '@/lib/types';
import { ProductCard } from '@/components/shared/ProductCard';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'gasygo-cart';

export function ProductGrid() {
  const [productsCollection, loading, error] = useCollection(collection(db, 'products'));
  const products: Product[] = productsCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)) || [];
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
      
      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          cart.push({ product, quantity: 1 });
      }
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      
      // Dispatch a custom event that other components can listen for.
      document.dispatchEvent(new CustomEvent('addToCart', { detail: { product } }));
      
      // This is a more robust way to notify other tabs/windows.
      window.dispatchEvent(new Event('storage'));

      toast({
          title: 'Added to cart!',
          description: `${product.name} is now in your cart.`,
      });

    } catch (e) {
      console.error("Failed to add to cart", e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add item to cart.'
      });
    }
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
