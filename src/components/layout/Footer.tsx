import Link from 'next/link';
import { FlameKindling, Twitter, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FlameKindling className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">GasyGo</span>
            </Link>
            <p className="text-sm text-muted-foreground">Your Reliable Gas Partner, Delivered!</p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/order" className="text-sm text-muted-foreground hover:text-foreground">Order Now</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-3">Contact Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Phone: +254704095021</li>
              <li>WhatsApp: +254704095021</li>
              <li>Email: mosesissa810@gmail.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GasyGo. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
