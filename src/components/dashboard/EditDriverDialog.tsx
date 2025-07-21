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
import type { Driver } from "@/lib/types";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^0\d{9}$/, "Please enter a valid Kenyan phone number."),
});

interface EditDriverDialogProps {
  driver?: Driver;
  children: React.ReactNode;
}

export function EditDriverDialog({ driver, children }: EditDriverDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: driver?.name || "",
      phone: driver?.phone || "",
    },
  });

  useEffect(() => {
    if (open) {
        if (driver) {
            form.reset(driver);
        } else {
            form.reset({
                name: "",
                phone: "",
            });
        }
    }
  }, [open, driver, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const driverData = {
        name: values.name,
        phone: values.phone,
      };

      if (driver) {
        // Editing existing driver
        const driverRef = doc(db, "drivers", driver.id);
        await updateDoc(driverRef, driverData);
        toast({
          title: "Driver Updated!",
          description: `${driver.name}'s details have been successfully updated.`,
        });
      } else {
        // Adding new driver
        await addDoc(collection(db, "drivers"), driverData);
        toast({
          title: "Driver Added!",
          description: `${values.name} has been successfully added.`,
        });
      }
      setOpen(false); // Close dialog on success
    } catch (error) {
      console.error("Error saving driver:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem saving the driver. Please try again.",
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
          <DialogTitle>{driver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
          <DialogDescription>
            {driver ? "Update the details for this driver." : "Fill in the details for the new driver."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
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
                  <FormControl><Input placeholder="0712345678" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
