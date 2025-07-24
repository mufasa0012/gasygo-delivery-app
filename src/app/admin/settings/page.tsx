
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as React from 'react';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState({
    businessName: 'GasyGo',
    contactEmail: 'mosesissa810@gmail.com',
    contactPhone: '+254704095021',
    emailNotifications: true,
    smsNotifications: false,
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
        setLoading(true);
        const docRef = doc(db, 'settings', 'businessInfo');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setSettings(docSnap.data() as any);
        }
        setLoading(false);
    };
    fetchSettings();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  }

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Using 'businessInfo' as the document ID to store all settings in one document
      await setDoc(doc(db, 'settings', 'businessInfo'), settings, { merge: true });
      toast({
        title: "Settings Saved!",
        description: "Your changes have been successfully saved.",
      });
    } catch (error) {
      console.error("Error saving settings: ", error);
      toast({
        title: "Error",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Settings</h1>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your company details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="businessName" value={settings.businessName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contactEmail" type="email" value={settings.contactEmail} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contactPhone" type="tel" value={settings.contactPhone} onChange={handleInputChange} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive an email for new orders and system alerts.</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={settings.emailNotifications} 
                  onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)} 
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                   <p className="text-sm text-muted-foreground">Get text message alerts for urgent matters.</p>
                </div>
                <Switch 
                  id="sms-notifications" 
                  checked={settings.smsNotifications} 
                  onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                  disabled 
                />
              </div>
            </CardContent>
             <CardFooter>
              <Button onClick={handleSaveChanges} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Save Notification Settings'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
