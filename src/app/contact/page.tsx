import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';

const contactMethods = [
  {
    icon: <Phone className="h-8 w-8 text-primary" />,
    title: "Call Us",
    value: "+254704095021",
    actionText: "Call Now",
    href: "tel:+254704095021",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "WhatsApp",
    value: "+254704095021",
    actionText: "Chat on WhatsApp",
    href: "https://wa.me/254704095021",
  },
  {
    icon: <Mail className="h-8 w-8 text-primary" />,
    title: "Email Us",
    value: "mosesissa810@gmail.com",
    actionText: "Send Email",
    href: "mailto:mosesissa810@gmail.com",
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: "Visit Us",
    value: "123 Gas Lane, Nairobi",
    actionText: "Get Directions",
    href: "#",
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Get In Touch</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">We're here to help! Reach out to us through any of the methods below.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contactMethods.map((method, index) => (
          <Card key={index} className="text-center shadow-lg">
            <CardHeader className="items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                {method.icon}
              </div>
              <CardTitle className="font-headline mt-4">{method.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">{method.value}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href={method.href} target="_blank" rel="noopener noreferrer">
                  {method.actionText}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
