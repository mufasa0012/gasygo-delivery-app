'use client';

import { useState, useEffect, useRef } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Save } from 'lucide-react';
import { Image } from '@imagekit/next';
import { upload } from '@imagekit/next';

const SETTINGS_DOC_ID = 'site-settings';

export default function SettingsPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settingsDoc, loading, error] = useDocument(doc(db, 'settings', SETTINGS_DOC_ID));
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settingsDoc?.exists()) {
      setHeroImageUrl(settingsDoc.data().heroImageUrl || '');
    }
  }, [settingsDoc]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setHeroImageUrl(response.url);
      toast({
        title: 'Image Uploaded!',
        description: 'Your new hero image is ready. Click Save to apply.',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Image upload failed.',
        description: error.message || 'There was a problem uploading your image.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), { heroImageUrl }, { merge: true });
      toast({
        title: 'Settings Saved!',
        description: 'Your hero image has been updated successfully.',
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
      <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings here.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Hero Image Settings</CardTitle>
          <CardDescription>Change the main image displayed on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Image Preview</label>
            <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center bg-secondary overflow-hidden">
              {heroImageUrl ? (
                <Image
                  urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
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
              onClick={() => fileInputRef.current?.click()}
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
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/webp"
              disabled={isUploading}
            />
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving || isUploading || !heroImageUrl}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
