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
import { useState, useRef, useEffect } from "react";
import { Image } from "@imagekit/next";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";
import { upload } from "@imagekit/next";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  category: z.enum(["Gas Cylinder", "Accessory", "Full Set"]),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  description: z.string().optional(),
  image: z.string().url("Please upload an image."),
});

interface EditProductDialogProps {
  product?: Product;
  children: React.ReactNode;
}

export function EditProductDialog({ product, children }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (open) {
        if (product) {
            form.reset(product);
        } else {
            form.reset({
                name: "",
                category: "Gas Cylinder",
                price: 0,
                stock: 0,
                description: "",
                image: "",
            });
        }
    }
  }, [open, product, form]);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
        const authResponse = await fetch('/api/imagekit/auth');
        if (!authResponse.ok) {
            const errorBody = await authResponse.json();
            throw new Error(errorBody.error || 'Failed to get authentication parameters');
        }
        const authParams = await authResponse.json();

        const response = await upload({
            file,
            fileName: file.name,
            ...authParams,
            publicKey: authParams.publicKey,
        });

        form.setValue("image", response.url, { shouldValidate: true });
        toast({
            title: "Image Uploaded!",
            description: "Your image has been successfully uploaded.",
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        toast({
          variant: "destructive",
          title: "Oh no! Image upload failed.",
          description: error.message || "There was a problem uploading your image. Please try again.",
        });
    } finally {
        setIsUploading(false);
    }
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const productData = {
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        description: values.description || "",
        image: values.image,
      };

      if (product) {
        // Editing existing product
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, productData);
        toast({
          title: "Product Updated!",
          description: `${product.name} has been successfully updated.`,
        });
      } else {
        // Adding new product
        await addDoc(collection(db, "products"), productData);
        toast({
          title: "Product Added!",
          description: `${values.name} has been successfully added.`,
        });
      }
      setOpen(false); // Close dialog on success
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
  
  const imageUrl = form.watch("image");

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
                control={form.control}
                name="image"
                render={() => (
                    <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center bg-secondary">
                                {imageUrl ? 
                                    <Image urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!} src={imageUrl} alt="Product preview" width={96} height={96} className="rounded-md object-cover" /> :
                                    <span className="text-xs text-muted-foreground">Preview</span>
                                }
                            </div>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                Upload
                            </Button>
                            <FormControl>
                                <Input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleImageUpload}
                                    accept="image/png, image/jpeg, image/webp"
                                    disabled={isUploading}
                                />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input placeholder="e.g. K-Gas 6kg" {...field} /></FormControl>
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
                  <FormControl><Textarea placeholder="Describe the product..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <Button type="submit" disabled={isUploading || isSubmitting}>
                  {(isUploading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
