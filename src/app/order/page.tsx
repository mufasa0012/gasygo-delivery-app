import { ProductGrid } from '@/components/order/ProductGrid';
import { CartSidebar } from '@/components/order/CartSidebar';

export default function OrderPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Order Gas & Accessories</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Browse our full range of products and place your order for fast delivery.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-3">
                <ProductGrid />
            </div>
            <div className="lg:col-span-1 sticky top-24">
                <CartSidebar />
            </div>
        </div>
    </div>
  );
}
