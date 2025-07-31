
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/products';
import ImageKit from 'imagekit-javascript';

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [productData, setProductData] = React.useState<Partial<Product>>({});
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);


  React.useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      const productDoc = await getDoc(doc(db, 'products', id as string));
      if (productDoc.exists()) {
        const data = productDoc.data();
        setProductData({ id: productDoc.id, ...data });
        if (data.image) {
            setImagePreview(data.image);
        }
      } else {
        toast({
            title: 'Not Found',
            description: "Could not find the requested product.",
            variant: 'destructive'
        })
        router.push('/admin/products');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, toast, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
     setProductData((prev) => ({ ...prev, category: value as any }));
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async () => {
    if (!productData.name || !productData.price) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    try {
        let imageUrl = productData.image;

        if (imageFile) {
            const authResponse = await fetch('/api/imagekit-auth');
            const authData = await authResponse.json();
            const uploadResult = await imageKit.upload({
                file: imageFile,
                fileName: imageFile.name,
                token: authData.token,
                expire: authData.expire,
                signature: authData.signature,
            });
            imageUrl = uploadResult.url;
        }
      
      const productRef = doc(db, 'products', id as string);
      await updateDoc(productRef, { 
          ...productData,
          price: parseFloat(productData.price as any),
          image: imageUrl
      });
      toast({
        title: 'Product Updated!',
        description: `${productData.name}'s information has been updated.`,
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product: ', error);
      toast({
        title: 'Error',
        description: 'There was a problem updating the product.',
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
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Edit Product</h1>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Update the information for this product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={productData.name || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={productData.description || ''} onChange={handleInputChange}/>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (Ksh)</Label>
                    <Input id="price" type="number" value={productData.price || ''}  onChange={handleInputChange}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={productData.category || ''} onValueChange={handleCategoryChange}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cylinder">Cylinder</SelectItem>
                            <SelectItem value="accessory">Accessory</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
              <Label>Image Preview</Label>
              {imagePreview ? (
                <Image src={imagePreview} alt={productData.name || 'Product Image'} width={100} height={100} className="rounded-md border object-cover" />
              ) : (
                <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                </div>
              )}
            </div>
             <div className="space-y-2">
                <Label htmlFor="image">Upload New Image</Label>
                <Input id="image" type="file" onChange={handleImageChange} accept="image/*"/>
            </div>
            <Button className="w-full" onClick={handleUpdateProduct} disabled={saving}>
                 {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
