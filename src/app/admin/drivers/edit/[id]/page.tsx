
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DriverData {
  name: string;
  phone: string;
  status: 'Available' | 'On Delivery' | 'Offline';
}

export default function EditDriverPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [driverData, setDriverData] = React.useState<DriverData>({
    name: '',
    phone: '',
    status: 'Available',
  });

  React.useEffect(() => {
    if (!id) return;
    const fetchDriver = async () => {
      setLoading(true);
      const driverDoc = await getDoc(doc(db, 'drivers', id as string));
      if (driverDoc.exists()) {
        setDriverData(driverDoc.data() as DriverData);
      } else {
        toast({
            title: 'Not Found',
            description: "Could not find the requested driver.",
            variant: 'destructive'
        })
        router.push('/admin/drivers');
      }
      setLoading(false);
    };
    fetchDriver();
  }, [id, toast, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDriverData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleStatusChange = (value: DriverData['status']) => {
    setDriverData((prev) => ({ ...prev, status: value }));
  }

  const handleUpdateDriver = async () => {
    if (!driverData.name.trim() || !driverData.phone.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    try {
      const driverRef = doc(db, 'drivers', id as string);
      await updateDoc(driverRef, { ...driverData });
      toast({
        title: 'Driver Updated!',
        description: `${driverData.name}'s information has been updated.`,
      });
      router.push('/admin/drivers');
    } catch (error) {
      console.error('Error updating driver: ', error);
      toast({
        title: 'Error',
        description: 'There was a problem updating the driver.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
        <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Edit Driver</h1>
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>Update the details for this driver.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={driverData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={driverData.phone} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={handleStatusChange} value={driverData.status}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="On Delivery">On Delivery</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button className="w-full" onClick={handleUpdateDriver} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
