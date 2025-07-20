import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch, MapPin, Smile } from 'lucide-react';

const steps = [
  {
    icon: <PackageSearch className="w-12 h-12 text-primary" />,
    title: '1. Choose Your Gas & Products',
    description: 'Select from a wide range of gas brands and accessories.',
  },
  {
    icon: <MapPin className="w-12 h-12 text-primary" />,
    title: '2. Confirm Location & Details',
    description: 'Share your location or enter your address and confirm your order.',
  },
  {
    icon: <Smile className="w-12 h-12 text-primary" />,
    title: '3. Get Your Gas Delivered!',
    description: 'Relax while we deliver your order to your doorstep, fast and free.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Get Gas in 3 Simple Steps</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Ordering your gas refill has never been easier. Follow these steps to get started.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  {step.icon}
                </div>
                <CardTitle className="font-headline mt-4">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
