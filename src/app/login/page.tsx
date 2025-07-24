
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/20">
        <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">Select Your Role</h1>
                <p className="text-lg text-muted-foreground mt-2">Please choose how you would like to sign in to GasyGo.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg hover:shadow-xl transition-shadow text-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            <Shield className="h-10 w-10 text-primary"/>
                        </div>
                        <CardTitle className="mt-4 text-2xl font-semibold">Admin</CardTitle>
                        <CardDescription className="mt-2 text-base">
                            Access the main dashboard to manage products, orders, and drivers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/admin/dashboard">
                                Continue as Admin <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition-shadow text-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            <Truck className="h-10 w-10 text-primary"/>
                        </div>
                        <CardTitle className="mt-4 text-2xl font-semibold">Driver</CardTitle>
                        <CardDescription className="mt-2 text-base">
                            View your assigned deliveries and navigate to customer locations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild size="lg" className="w-full">
                            <Link href="/driver/deliveries">
                                Continue as Driver <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
