
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, LogIn, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DriverLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    password: '', // This will be the phone number
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.password.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please enter your name and password.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    try {
      const driversRef = collection(db, 'drivers');
      const q = query(driversRef, where("name", "==", formData.name.trim()), where("phone", "==", formData.password.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: 'Invalid Credentials',
          description: 'The name or password you entered is incorrect.',
          variant: 'destructive',
        });
      } else {
        // In a real app, you would set up a session here
        toast({
          title: 'Login Successful!',
          description: 'Redirecting to your deliveries...',
        });
        router.push('/driver/deliveries');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/20 p-4">
       <div className="absolute top-8 left-8">
            <Link href="/" className="flex items-center space-x-2">
                <Flame className="h-8 w-8 text-primary" />
                <span className="inline-block font-bold text-2xl font-headline text-foreground">
                    GasyGo
                </span>
            </Link>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Driver Login</CardTitle>
          <CardDescription>Enter your name and password (phone number) to access your deliveries.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., John Doe" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (Phone Number)</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Your phone number"
                value={formData.password} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
