import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.category === 'Gas Cylinder' ? 'gas cylinder' : 'gas accessory'}
          />
        </div>
        <div className="p-4">
            <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
            <Badge variant="outline" className="mt-1">{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-muted-foreground text-sm">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold font-headline text-primary">Ksh {product.price.toLocaleString()}</p>
        {onAddToCart && (
            <Button size="sm" onClick={() => onAddToCart(product)}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
