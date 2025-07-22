import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Truck } from 'lucide-react';
import Link from 'next/link';

const loginOptions = [
  {
    icon: <Shield className="h-12 w-12 text-primary" />,
    title: "Admin",
    description: "Access the main dashboard to manage products, orders, and drivers.",
    href: "/dashboard",
    buttonText: "Continue as Admin",
  },
  {
    icon: <Truck className="h-12 w-12 text-primary" />,
    title: "Driver",
    description: "View your assigned deliveries and navigate to customer locations.",
    href: "/driver/dashboard",
    buttonText: "Continue as Driver",
  },
];

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Select Your Role</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Please choose how you would like to sign in to GasyGo.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loginOptions.map((option) => (
          <Card key={option.title} className="text-center shadow-lg flex flex-col">
            <CardHeader className="items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                {option.icon}
              </div>
              <CardTitle className="font-headline mt-4">{option.title}</CardTitle>
               <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end justify-center">
              <Button asChild className="w-full">
                <Link href={option.href}>
                  {option.buttonText}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
