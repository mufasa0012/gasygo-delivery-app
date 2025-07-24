'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart, type CartItem as CartItemType } from '@/context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover"
          data-ai-hint={item.product.hint}
        />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-md">{item.product.name}</h4>
        <p className="text-muted-foreground text-sm">Ksh{item.product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10) || 1)}
              className="h-8 w-12 text-center"
              min="1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => removeFromCart(item.product.id)}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
