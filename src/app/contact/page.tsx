
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+254704095021',
    actionText: 'Call Now',
    href: 'tel:+254704095021',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    detail: '+254704095021',
    actionText: 'Chat on WhatsApp',
    href: 'https://wa.me/254704095021',
    isExternal: true,
  },
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'mosesissa810@gmail.com',
    actionText: 'Send Email',
    href: 'mailto:mosesissa810@gmail.com',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    detail: '123 Gas Lane, Nairobi',
    actionText: 'Get Directions',
    href: 'https://www.google.com/maps/search/?api=1&query=123+Gas+Lane,Nairobi',
    isExternal: true,
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                Get in Touch
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We're here to help with any questions or concerns. Reach out to us through any of the methods below.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {contactMethods.map((method) => (
                <Card key={method.title} className="text-center shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <CardHeader className="items-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                      <method.icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-semibold">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-center">
                    <p className="text-muted-foreground text-lg">{method.detail}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild size="lg" className="w-full">
                       <Link href={method.href} target={method.isExternal ? '_blank' : undefined} rel={method.isExternal ? 'noopener noreferrer' : undefined}>
                        {method.actionText}
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
