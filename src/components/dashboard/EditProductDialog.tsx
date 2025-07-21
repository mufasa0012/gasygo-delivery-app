'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/types";
import { useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { IKContext, IKUpload } from 'imagekitio-react';

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  category: z.enum(["Gas Cylinder", "Accessory", "Full Set"]),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  description: z.string().optional(),
  image: z.string().optional(), // Now storing the URL string
});

interface EditProductDialogProps {
  product?: Product;
  children: React.ReactNode;
}

export function EditProductDialog({ product, children }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image || null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "Gas Cylinder",
      price: product?.price || 0,
      stock: product?.stock || 0,
      description: product?.description || "",
      image: product?.image || "",
    },
  });

  // Set image url in form when it changes
  useState(() => {
    form.setValue("image", imageUrl || "");
  });
  
  const handleUploadSuccess = (res: any) => {
    setImageUrl(res.url);
    form.setValue("image", res.url);
    setIsSubmitting(false); // Re-enable submit button
    toast({
        title: "Image Uploaded!",
        description: "Your image has been successfully uploaded.",
    });
  };

  const handleUploadError = (err: any) => {
    console.error("Upload error:", err);
    setIsSubmitting(false); // Re-enable submit button
    toast({
      variant: "destructive",
      title: "Oh no! Image upload failed.",
      description: "There was a problem uploading your image. Please try again.",
    });
  };

  const handleUploadStart = () => {
    setIsSubmitting(true); // Disable submit button during upload
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const productData = {
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        description: values.description || "",
        image: imageUrl, // Use the state variable which holds the new URL
      };

      if (!productData.image) {
        toast({
            variant: "destructive",
            title: "Image is required",
            description: "Please upload an image for the product.",
        });
        setIsSubmitting(false);
        return;
      }

      if (product) {
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, productData);
        toast({
          title: "Product Updated!",
          description: `${product.name} has been successfully updated.`,
        });
      } else {
        await addDoc(collection(db, "products"), productData);
        toast({
          title: "Product Added!",
          description: `${values.name} has been successfully added.`,
        });
        form.reset();
        setImageUrl(null);
      }

      setOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem saving the product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update the details of this product." : "Fill in the details for the new product."}
          </DialogDescription>
        </DialogHeader>
        <IKContext 
            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} 
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
            authenticator={async () => {
                const response = await fetch('/api/imagekit/auth');
                return await response.json();
            }}
        >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormItem>
                <FormLabel>Product Image</FormLabel>
                <div className="flex items-center gap-4">
                    {imageUrl && <Image src={imageUrl} alt="Product preview" width={64} height={64} className="rounded-md object-cover" />}
                    <FormControl>
                        <IKUpload
                            fileName="product-image.jpg"
                            onUploadStart={handleUploadStart}
                            onSuccess={handleUploadSuccess}
                            onError={handleUploadError}
                            className="bg-primary text-primary-foreground h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium"
                        />
                    </FormControl>
                </div>
                <FormMessage />
            </FormItem>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Gas Cylinder">Gas Cylinder</SelectItem>
                            <SelectItem value="Accessory">Accessory</SelectItem>
                            <SelectItem value="Full Set">Full Set</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price (Ksh)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
        </IKContext>
      </DialogContent>
    </Dialog>
  );
}
