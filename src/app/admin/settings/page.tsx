
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
import { Loader2, Music4, Save } from 'lucide-react';
import Image from 'next/image';
import ImageKit from 'imagekit-javascript';
import { Textarea } from '@/components/ui/textarea';

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});


export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [settings, setSettings] = React.useState({
    businessName: 'GasyGo',
    contactEmail: 'mosesissa810@gmail.com',
    contactPhone: '+254704095021',
    emailNotifications: true,
    smsNotifications: false,
    businessLogoUrl: '',
    heroImageUrl: '',
    heroHeadline: 'Your Reliable Gas Partner, Delivered!',
    heroSubheadline: 'Get K-Gas, Total Gas, Afrigas, and more, delivered fast and free right to your doorstep in Nairobi.',
    primaryColor: '221 83% 53%', // Default primary color HSL
    newOrderRingtoneUrl: '',
  });
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = React.useState<File | null>(null);
  const [ringtoneFile, setRingtoneFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
        setLoading(true);
        const docRef = doc(db, 'settings', 'businessInfo');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setSettings(prev => ({...prev, ...docSnap.data()}));
        }
        setLoading(false);
    };
    fetchSettings();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const { id, files } = e.target;
       if (id === 'logo') {
        setLogoFile(files[0]);
       } else if (id === 'heroImage') {
        setHeroImageFile(files[0]);
       } else if (id === 'ringtone') {
        setRingtoneFile(files[0]);
       }
    }
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  }

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      let updatedSettings = { ...settings };

      const uploadFile = async (file: File) => {
        const authResponse = await fetch('/api/imagekit-auth');
        if (!authResponse.ok) {
            throw new Error('Failed to get ImageKit auth credentials');
        }
        const authData = await authResponse.json();

        const uploadResult = await imageKit.upload({
            file: file,
            fileName: file.name,
            token: authData.token,
            expire: authData.expire,
            signature: authData.signature,
        });
        return uploadResult.url;
      }

      if (logoFile) {
        updatedSettings.businessLogoUrl = await uploadFile(logoFile);
      }
      if (heroImageFile) {
        updatedSettings.heroImageUrl = await uploadFile(heroImageFile);
      }
      if (ringtoneFile) {
        updatedSettings.newOrderRingtoneUrl = await uploadFile(ringtoneFile);
      }

      await setDoc(doc(db, 'settings', 'businessInfo'), updatedSettings, { merge: true });
      setSettings(updatedSettings);
      setLogoFile(null);
      setHeroImageFile(null);
      setRingtoneFile(null);
      
      if (updatedSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary-hsl', updatedSettings.primaryColor);
      }


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
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
            <Button onClick={handleSaveChanges} disabled={saving}>
                {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Save All Changes
            </Button>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your company details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" value={settings.businessName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" value={settings.contactEmail} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input id="contactPhone" type="tel" value={settings.contactPhone} onChange={handleInputChange} />
              </div>
              {settings.businessLogoUrl && !logoFile && (
                <div className="space-y-2">
                  <Label>Current Logo</Label>
                  <Image src={settings.businessLogoUrl} alt="Business Logo" width={100} height={100} className="rounded-md border p-2" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="logo">Business Logo</Label>
                <Input id="logo" type="file" onChange={handleImageChange} accept="image/*" />
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Homepage Content</CardTitle>
              <CardDescription>Customize the text displayed on your landing page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="heroHeadline">Hero Headline</Label>
                <Textarea 
                  id="heroHeadline"
                  value={settings.heroHeadline} 
                  onChange={handleInputChange}
                  placeholder="e.g., Your Reliable Gas Partner, Delivered!"
                 />
              </div>
               <div className="space-y-2">
                <Label htmlFor="heroSubheadline">Hero Sub-headline</Label>
                 <Textarea 
                  id="heroSubheadline"
                  value={settings.heroSubheadline} 
                  onChange={handleInputChange}
                  placeholder="e.g., Get K-Gas, Total Gas, and more, delivered fast..."
                  rows={3}
                 />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color (HSL)</Label>
                <Input 
                  id="primaryColor" 
                  value={settings.primaryColor} 
                  onChange={handleInputChange}
                  placeholder="e.g., 221 83% 53%"
                 />
                 <p className="text-sm text-muted-foreground">
                    Enter a color in HSL format (e.g., "221 83% 53%"). Find colors at <a href="https://hslpicker.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">hslpicker.com</a>.
                </p>
              </div>
               {settings.heroImageUrl && !heroImageFile && (
                <div className="space-y-2">
                  <Label>Current Hero Image</Label>
                  <Image src={settings.heroImageUrl} alt="Hero Image" width={200} height={150} className="rounded-md border p-2 object-cover" />
                </div>
              )}
               <div className="space-y-2">
                <Label htmlFor="heroImage">Homepage Hero Image</Label>
                <Input id="heroImage" type="file" onChange={handleImageChange} accept="image/*"/>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive an email for new orders and system alerts.</p>
                </div>
                <Switch 
                  id="emailNotifications" 
                  checked={settings.emailNotifications} 
                  onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)} 
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications" className="text-base">SMS Notifications</Label>
                   <p className="text-sm text-muted-foreground">Get text message alerts for urgent matters.</p>
                </div>
                <Switch 
                  id="smsNotifications" 
                  checked={settings.smsNotifications} 
                  onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                  disabled 
                />
              </div>
               <div className="space-y-2 pt-4">
                  <Label htmlFor="ringtone">New Order Ringtone</Label>
                  {settings.newOrderRingtoneUrl && !ringtoneFile && (
                    <div className="flex items-center gap-4">
                        <Music4 className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Current tone set.</span>
                        <audio src={settings.newOrderRingtoneUrl} controls className="h-8" />
                    </div>
                  )}
                  <Input id="ringtone" type="file" onChange={handleImageChange} accept="audio/*"/>
                  <p className="text-sm text-muted-foreground">Upload an audio file (MP3, WAV) to play for new orders.</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
