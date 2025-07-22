'use client';

import { useActionState, useEffect, useState } from 'react';
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
import type { Driver } from '@/lib/types';
import { addDriver, updateDriver } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().regex(/^0\d{9}$/, 'Please enter a valid Kenyan phone number.'),
  vehicle: z.string().min(2, 'Vehicle must be at least 2 characters.'),
});

interface EditDriverDialogProps {
  driver?: Driver;
  children: React.ReactNode;
}

export function EditDriverDialog({ driver, children }: EditDriverDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const action = driver ? updateDriver : addDriver;
  const [state, formAction, isPending] = useActionState(action, { success: false, message: '' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: driver ? { ...driver } : {
      name: '',
      phone: '',
      vehicle: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    formAction(formData);
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && state.success) {
      toast({
        title: driver ? 'Driver Updated!' : 'Driver Added!',
        description: state.message,
      });
      setOpen(false);
      form.reset();
    } else if (state.message && !state.success) {
       toast({
        variant: "destructive",
        title: 'An error occurred',
        description: state.message,
      });
    }
  }, [state, driver, form, toast]);

  useEffect(() => {
    if (open) {
      // Reset form state when dialog opens
      form.reset(driver || { name: '', phone: '', vehicle: '' });
      // also reset action state
      if(state.message || state.success) {
          state.message = '';
          state.success = false;
      }
    }
  }, [open, driver, form, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{driver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
          <DialogDescription>
            {driver ? 'Update the details for this driver.' : 'Fill in the details for the new driver.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {driver && <input type="hidden" value={driver.id} {...form.register('id')} />}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="0712345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota Hilux" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                 {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
