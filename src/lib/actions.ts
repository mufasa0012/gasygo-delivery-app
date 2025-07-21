'use server';

import { z } from 'zod';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const DriverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  vehicle: z.string().min(1, 'Vehicle is required'),
});

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Invalid image URL'),
  description: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
});

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export async function addDriver(formData: FormData) {
  try {
    const data = DriverSchema.parse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      vehicle: formData.get('vehicle'),
    });

    await addDoc(collection(db, 'drivers'), {
      ...data,
      available: true,
      location: {
        latitude: 0,
        longitude: 0,
      },
    });
    revalidatePath('/dashboard/drivers');
    return { success: true };
  } catch (error) {
    console.error('Error adding driver:', error);
    return { success: false, error: 'Failed to add driver.' };
  }
}

export async function addProduct(formData: FormData) {
  try {
    const data = ProductSchema.parse({
      name: formData.get('name'),
      price: formData.get('price'),
      category: formData.get('category'),
      imageUrl: formData.get('imageUrl'),
      description: formData.get('description'),
      stock: formData.get('stock'),
    });

    await addDoc(collection(db, 'products'), data);
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: 'Failed to add product.' };
  }
}

export async function addUser(formData: FormData) {
  try {
    const data = UserSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
    });

    await addDoc(collection(db, 'users'), data);
    revalidatePath('/dashboard/users'); // Assuming a dashboard page for users
    return { success: true };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, error: 'Failed to add user.' };
  }
}
