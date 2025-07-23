
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, LogIn, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Driver } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(2, 'Please enter a valid name.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function DriverLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // 1. Fetch all drivers from Firestore for case-insensitive matching
      const driversRef = collection(db, 'drivers');
      const querySnapshot = await getDocs(driversRef);
      
      const allDrivers = querySnapshot.docs.map(doc => doc.data() as Driver);

      // 2. Find the driver by name, ignoring case
      const driverData = allDrivers.find(
        (driver) => driver.name.toLowerCase() === values.name.toLowerCase()
      );

      if (!driverData) {
        throw new Error('Driver not found.');
      }

      // 3. Get the phone number from the found driver document
      const phone = driverData.phone;
      
      if (!phone) {
          throw new Error('Driver data is incomplete.');
      }

      // 4. Construct the email and sign in with Firebase Auth
      const email = `${phone}@gasygo.app`;
      
      // The password is the driver's phone number
      if (values.password !== phone) {
        throw new Error('Invalid password.');
      }

      await signInWithEmailAndPassword(auth, email, values.password);

      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/driver/dashboard');

    } catch (error: any) {
      console.error('Driver login error:', error);
      let errorMessage = 'Invalid credentials. Please try again.';
      if (error.message === 'Driver not found.') {
        errorMessage = 'No driver found with that name.';
      } else if (error.message === 'Invalid password.') {
          errorMessage = 'Incorrect password. The password is your phone number.';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid credentials. Please contact an admin.';
      }

      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Driver Login</CardTitle>
          <CardDescription>
            Enter your full name and password (your phone number) to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your password is your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
