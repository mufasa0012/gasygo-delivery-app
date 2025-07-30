
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewDriverPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [driverData, setDriverData] = React.useState({
    name: '',
    phone: '',
  });
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDriverData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddDriver = async () => {
    if (!driverData.name || !driverData.phone) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, 'drivers'), {
        name: driverData.name,
        phone: driverData.phone,
        status: 'Available', // Default status
        createdAt: new Date(),
      });

      toast({
        title: 'Driver Added!',
        description: `${driverData.name} has been successfully added.`,
      });

      // Reset form
      setDriverData({
        name: '',
        phone: '',
      });
      // Redirect to the drivers list page
      router.push('/admin/drivers');

    } catch (error) {
      console.error('Error adding driver: ', error);
      toast({
        title: 'Error',
        description: 'There was a problem adding the driver. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Add New Driver</h1>
        {isClient ? (
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>Enter the details for the new driver.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="e.g., John Doe" value={driverData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="e.g., +254712345678" value={driverData.phone} onChange={handleInputChange} />
            </div>
            <Button className="w-full" onClick={handleAddDriver} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Add Driver'}
            </Button>
          </CardContent>
        </Card>
        ) : null}
      </div>
    </div>
  );
}
