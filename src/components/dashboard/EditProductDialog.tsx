'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/lib/types';
import { Image } from '@imagekit/next';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { upload } from '@imagekit/next';
import { addProduct, updateProduct } from '@/lib/actions';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is too short'),
  category: z.enum(['Gas Cylinder', 'Accessory', 'Full Set']),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  description: z.string().optional(),
  image: z.string().url('An image URL is required.'),
});

interface EditProductDialogProps {
  product?: Product;
  children: React.ReactNode;
}

export function EditProductDialog({ product, children }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const action = product ? updateProduct : addProduct;
  const [state, formAction] = useActionState(action, { success: false, message: '' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product ? { ...product } : {
      name: '',
      category: 'Gas Cylinder',
      price: 0,
      stock: 0,
      description: '',
      image: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    // Manually construct FormData from react-hook-form values
    for (const [key, value] of Object.entries(values)) {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    }
    startTransition(() => {
        formAction(formData);
    });
  };


  useEffect(() => {
    if (form.formState.isSubmitSuccessful && state.success) {
      toast({
        title: product ? 'Product Updated!' : 'Product Added!',
        description: state.message,
      });
      setOpen(false);
      form.reset();
    } else if (form.formState.isSubmitSuccessful && state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.message,
      });
    }
  }, [state, product, form, toast, form.formState.isSubmitSuccessful]);

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset(product);
      } else {
        form.reset({
          name: '',
          category: 'Gas Cylinder',
          price: 0,
          stock: 0,
          description: '',
          image: '',
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
      });

      form.setValue('image', response.url, { shouldValidate: true });
      toast({
        title: 'Image Uploaded!',
        description: 'Your image has been successfully uploaded.',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Image upload failed.',
        description: error.message || 'There was a problem uploading your image. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const imageUrl = form.watch('image');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details of this product.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             {product && <input type="hidden" {...form.register('id')} />}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center bg-secondary">
                      {imageUrl ? (
                        <Image
                          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
                          src={imageUrl}
                          alt="Product preview"
                          width={96}
                          height={96}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">Preview</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="mr-2 h-4 w-4" />
                      )}
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
                  <FormControl>
                    <Input placeholder="e.g. K-Gas 6kg" {...field} />
                  </FormControl>
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
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
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
                  <FormControl>
                    <Textarea placeholder="Describe the product..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending || isUploading}>
                {(isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
