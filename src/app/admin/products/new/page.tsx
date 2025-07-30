
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import ImageKit from 'imagekit-javascript';

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export default function NewProductPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [productData, setProductData] = React.useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProductData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
     setProductData((prev) => ({ ...prev, category: value }));
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleAddProduct = async () => {
    if (!productData.name || !productData.price || !productData.category || !productData.image) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    try {
      // 1. Get ImageKit authentication
      const authResponse = await fetch('/api/imagekit-auth');
      if (!authResponse.ok) {
          throw new Error('Failed to get ImageKit auth credentials');
      }
      const authData = await authResponse.json();

      // 2. Upload image to ImageKit
      const uploadResult = await imageKit.upload({
          file: productData.image,
          fileName: productData.image.name,
          token: authData.token,
          expire: authData.expire,
          signature: authData.signature,
      });
      const imageUrl = uploadResult.url;


      // 3. Save product data to Firestore
      await addDoc(collection(db, 'products'), {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        image: imageUrl,
        hint: 'product image', // Or generate a hint based on name/category
        createdAt: new Date(),
      });

      toast({
        title: 'Product Added!',
        description: `${productData.name} has been successfully added.`,
      });

      // Reset form
      setProductData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: null,
      });
      // A type assertion is used to reset the file input
      (document.getElementById('image') as HTMLInputElement).value = '';


    } catch (error) {
      console.error('Error adding product: ', error);
      toast({
        title: 'Error',
        description: 'There was a problem adding the product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Add New Product</h1>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill in the information for the new product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="e.g., 12kg Propane Cylinder" value={productData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="A short description of the product." value={productData.description} onChange={handleInputChange}/>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (Ksh)</Label>
                    <Input id="price" type="number" placeholder="e.g., 2300" value={productData.price} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={handleCategoryChange} value={productData.category}>
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
                <Label htmlFor="image">Product Image</Label>
                <Input id="image" type="file" onChange={handleImageChange} />
            </div>
            <Button className="w-full" onClick={handleAddProduct} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Add Product'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
