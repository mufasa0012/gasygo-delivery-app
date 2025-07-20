import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Zap, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Your Reliable Gas Partner,
              <span className="block text-primary">Delivered!</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Get K-Gas, Total Gas, Afrigas, and more, delivered fast and free right to your doorstep in Nairobi.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="font-bold text-lg">
                <Link href="/order">Order Gas Now</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Badge variant="secondary" className="gap-2 py-2 px-4 border-accent text-accent-foreground">
                    <Truck className="h-5 w-5 text-accent"/>
                    <span className="font-semibold">Free Delivery</span>
                </Badge>
                <Badge variant="secondary" className="gap-2 py-2 px-4 border-accent text-accent-foreground">
                    <Zap className="h-5 w-5 text-accent"/>
                    <span className="font-semibold">Fast & Reliable</span>
                </Badge>
                <Badge variant="secondary" className="gap-2 py-2 px-4 border-accent text-accent-foreground">
                    <ShieldCheck className="h-5 w-5 text-accent"/>
                    <span className="font-semibold">All Major Brands</span>
                </Badge>
            </div>
          </div>
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Gas cylinder delivery"
              data-ai-hint="gas cylinder delivery"
              fill
              className="object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
