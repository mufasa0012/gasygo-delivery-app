'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Truck, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-muted text-muted-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Your Reliable Gas Partner,{' '}
              <span className="text-primary">Delivered!</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl mt-4">
              Get K-Gas, Total Gas, Afrigas, and more, delivered fast and free right to your
              doorstep in Nairobi.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
              <Link href="/ai-order">Order Gas Now</Link>
            </Button>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
               <Badge
                variant="outline"
                className="flex items-center justify-center gap-2 p-4 text-lg border-muted-foreground/50 bg-muted/60 text-muted-foreground"
              >
                <Truck className="h-6 w-6 text-primary" />
                <span>Free Delivery</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center justify-center gap-2 p-4 text-lg border-muted-foreground/50 bg-muted/60 text-muted-foreground"
              >
                <Zap className="h-6 w-6 text-primary" />
                <span>Fast & Reliable</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center justify-center gap-2 p-4 text-lg border-muted-foreground/50 bg-muted/60 text-muted-foreground"
              >
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span>All Major Brands</span>
              </Badge>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
