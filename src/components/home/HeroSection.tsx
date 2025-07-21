import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Zap, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] text-white">
      <Image
        src="https://ik.imagekit.io/phyxsbhhe/gasygo/gas-cylinders-hero.png"
        alt="A collection of various branded gas cylinders like K-Gas, Afrigas, and Totalgaz"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col items-center justify-center text-center z-10">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight">
            Your Reliable Gas Partner,
            <span className="block text-primary">Delivered!</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Get K-Gas, Total Gas, Afrigas, and more, delivered fast and free right to your doorstep in Nairobi.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-bold text-lg">
              <Link href="/order">Order Gas Now</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 justify-center">
              <Badge variant="secondary" className="gap-2 py-2 px-4 bg-black/30 border-white/20 text-white backdrop-blur-sm">
                  <Truck className="h-5 w-5 text-primary"/>
                  <span className="font-semibold">Free Delivery</span>
              </Badge>
              <Badge variant="secondary" className="gap-2 py-2 px-4 bg-black/30 border-white/20 text-white backdrop-blur-sm">
                  <Zap className="h-5 w-5 text-primary"/>
                  <span className="font-semibold">Fast & Reliable</span>
              </Badge>
              <Badge variant="secondary" className="gap-2 py-2 px-4 bg-black/30 border-white/20 text-white backdrop-blur-sm">
                  <ShieldCheck className="h-5 w-5 text-primary"/>
                  <span className="font-semibold">All Major Brands</span>
              </Badge>
          </div>
      </div>
    </section>
  );
}
