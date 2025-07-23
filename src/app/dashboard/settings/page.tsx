'use client';

import { useState, useEffect, useRef } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Save, Volume2 } from 'lucide-react';
import { Image } from '@imagekit/next';
import { upload } from '@imagekit/next';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const SETTINGS_DOC_ID = 'site-settings';

export default function SettingsPage() {
  const { toast } = useToast();
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const newOrderSoundFileInputRef = useRef<HTMLInputElement>(null);
  const reminderSoundFileInputRef = useRef<HTMLInputElement>(null);

  const [settingsDoc, loading, error] = useDocument(doc(db, 'settings', SETTINGS_DOC_ID));
  
  // State for Hero Image
  const [heroImageUrl, setHeroImageUrl] = useState('');
  
  // State for Sound Settings
  const [volume, setVolume] = useState([1]);
  const [newOrderSoundUrl, setNewOrderSoundUrl] = useState('');
  const [reminderSoundUrl, setReminderSoundUrl] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const imageUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;


  useEffect(() => {
    if (settingsDoc?.exists()) {
      const data = settingsDoc.data();
      setHeroImageUrl(data.heroImageUrl || '');
      setVolume([data.notificationVolume ?? 1]);
      setNewOrderSoundUrl(data.newOrderSoundUrl || '');
      setReminderSoundUrl(data.reminderSoundUrl || '');
    }
  }, [settingsDoc]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, fileType: 'image' | 'audio') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const authResponse = await fetch('/api/imagekit/auth');
      if (!authResponse.ok) {
        throw new Error('Failed to get authentication parameters');
      }
      const authParams = await authResponse.json();

      const response = await upload({
        file,
        fileName: file.name,
        ...authParams,
      });

      setUrl(response.url);
      toast({
        title: `${fileType === 'image' ? 'Image' : 'Sound'} Uploaded!`,
        description: `Your new ${fileType} is ready. Click Save to apply.`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: `Oh no! ${fileType} upload failed.`,
        description: error.message || 'There was a problem uploading your file.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const settingsData = {
        heroImageUrl,
        notificationVolume: volume[0],
        newOrderSoundUrl,
        reminderSoundUrl,
      };
      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), settingsData, { merge: true });
      toast({
        title: 'Settings Saved!',
        description: 'Your changes have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'There was a problem saving your settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <p className="text-destructive">Error: {error.message}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings here.</p>
          </div>
           <Button
              onClick={handleSaveChanges}
              disabled={isSaving || isUploading}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save All Changes
            </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Image Settings</CardTitle>
          <CardDescription>Change the main image displayed on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Image Preview</Label>
            <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center bg-secondary overflow-hidden">
              {imageUrlEndpoint && imageUrlEndpoint.length > 0 && heroImageUrl ? (
                <Image
                  urlEndpoint={imageUrlEndpoint}
                  src={heroImageUrl}
                  alt="Hero image preview"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm text-muted-foreground">No image selected</span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
             <Button
              type="button"
              variant="outline"
              onClick={() => heroFileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload New Image
            </Button>
            <Input
              type="file"
              ref={heroFileInputRef}
              className="hidden"
              onChange={(e) => handleFileUpload(e, setHeroImageUrl, 'image')}
              accept="image/png, image/jpeg, image/webp"
              disabled={isUploading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Sound Settings</CardTitle>
            <CardDescription>Customize notification sounds and volume for the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-4">
                <Label htmlFor="volume" className="flex items-center gap-2"><Volume2 className="h-5 w-5" /> Notification Volume</Label>
                 <div className="flex items-center gap-4">
                    <Slider
                        id="volume"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onValueChange={setVolume}
                    />
                    <span className="text-sm font-medium w-12 text-center">{Math.round(volume[0] * 100)}%</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <Label htmlFor="new-order-sound">New Order Sound URL</Label>
                <div className="flex gap-4 items-center">
                    <Input id="new-order-sound" value={newOrderSoundUrl} onChange={(e) => setNewOrderSoundUrl(e.target.value)} placeholder="Enter audio URL or upload a file" />
                     <Button type="button" variant="outline" onClick={() => newOrderSoundFileInputRef.current?.click()} disabled={isUploading}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Upload
                     </Button>
                     <Input type="file" ref={newOrderSoundFileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, setNewOrderSoundUrl, 'audio')} accept="audio/mpeg, audio/wav" disabled={isUploading} />
                </div>
                {newOrderSoundUrl && <audio src={newOrderSoundUrl} controls className="w-full h-10 mt-2" />}
            </div>

            <div className="space-y-4">
                <Label htmlFor="reminder-sound">Reminder Sound URL</Label>
                 <div className="flex gap-4 items-center">
                    <Input id="reminder-sound" value={reminderSoundUrl} onChange={(e) => setReminderSoundUrl(e.target.value)} placeholder="Enter audio URL or upload a file" />
                     <Button type="button" variant="outline" onClick={() => reminderSoundFileInputRef.current?.click()} disabled={isUploading}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Upload
                     </Button>
                     <Input type="file" ref={reminderSoundFileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, setReminderSoundUrl, 'audio')} accept="audio/mpeg, audio/wav" disabled={isUploading}/>
                </div>
                {reminderSoundUrl && <audio src={reminderSoundUrl} controls className="w-full h-10 mt-2" />}
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
