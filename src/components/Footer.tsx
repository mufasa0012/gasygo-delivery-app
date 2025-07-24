
'use client';

import Link from 'next/link';
import { Flame, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  const socialLinks = [
    { name: 'Facebook', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Instagram', href: '#' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-primary" />
              <span className="inline-block font-bold text-2xl font-headline text-foreground">
                GasyGo
              </span>
            </Link>
            <p className="text-muted-foreground">
              Your Reliable Gas Partner, Delivered!
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Button variant="link" asChild className="p-0 text-muted-foreground h-auto hover:text-primary">
                  <Link href="/ai-order">Order Now</Link>
                </Button>
              </li>
              <li>
                <Button variant="link" asChild className="p-0 text-muted-foreground h-auto hover:text-primary">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </li>
              <li>
                <Button variant="link" asChild className="p-0 text-muted-foreground h-auto hover:text-primary">
                  <Link href="/login">Admin/Driver Login</Link>
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary">Contact Info</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+254704095021" className="hover:text-primary">
                  +254704095021
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21.5 8.5c.2-1.2.1-2.5-.3-3.7s-1-2.2-1.8-3.1-1.9-1.5-3.1-1.8-2.5-.4-3.7-.3c-2.3.2-4.5.9-6.4 2.1s-3.5 2.9-4.5 5c-1.2 2.7-1.5 5.8-1 8.8s1.2 5.9 2.9 8.3c1.3 1.8 3 3.3 5.1 4.2s4.4.9 6.5.1l.4-.2c1.2-.5 2.3-1.2 3.3-2.1s1.8-1.9 2.4-3.1c.6-1.2.9-2.5.9-3.8.1-2.3-.5-4.6-1.7-6.5zm-5.2 2.6c-.2.3-.5.5-.9.6s-.8.1-1.1-.1l-2.6-1.6-2.6 1.5c-.3.2-.7.2-1 .1s-.6-.4-.8-.7l-1.5-2.6c-.2-.3-.2-.7-.1-1s.4-.6.7-.8l2.6-1.5 2.6-1.5c.3-.2.7-.2 1-.1s.6.4.8.7l1.5 2.6c.2.3.2.7.1 1s-.4.6-.7.8l-1.1.7z"></path></svg>
                <a href="https://wa.me/254704095021" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  +254704095021
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:mosesissa810@gmail.com" className="hover:text-primary">
                  mosesissa810@gmail.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-primary">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  <span className="sr-only">{social.name}</span>
                   <div className="w-6 h-6 border-2 border-primary rounded-full" />
                </a>
              ))}
            </div>
          </div>

        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GasyGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
