'use server';

import { z } from 'zod';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { adminAuth } from './firebase-admin';

// Schema for adding a new driver
const AddDriverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().regex(/^0\d{9}$/, 'Please enter a valid Kenyan phone number.'),
  vehicle: z.string().min(2, 'Vehicle must be at least 2 characters.'),
});

// Schema for updating an existing driver
const UpdateDriverSchema = AddDriverSchema.extend({
  id: z.string().min(1, 'Driver ID is required.'),
});

// Schema for adding a new product
const AddProductSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  category: z.enum(['Gas Cylinder', 'Accessory', 'Full Set']),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  description: z.string().optional(),
  image: z.string().url('An image URL is required.'),
});

// Schema for updating an existing product
const UpdateProductSchema = AddProductSchema.extend({
  id: z.string().min(1, 'Product ID is required.'),
});


const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['admin', 'customer', 'driver']),
});


export async function addDriver(prevState: any, formData: FormData) {
  try {
    const data = AddDriverSchema.parse(Object.fromEntries(formData));

    const docRef = await addDoc(collection(db, 'drivers'), {
      ...data,
      available: true, // Default availability
      location: { latitude: 0, longitude: 0 }, // Default location
    });
    revalidatePath('/dashboard/drivers');
    return { success: true, message: `Driver "${data.name}" added successfully.` };
  } catch (error: any) {
    console.error('Error adding driver:', error);
    const errorMessage = error.issues ? error.issues.map((e: any) => e.message).join(', ') : 'Failed to add driver.';
    return { success: false, message: errorMessage };
  }
}

export async function updateDriver(prevState: any, formData: FormData) {
    try {
        const data = UpdateDriverSchema.parse(Object.fromEntries(formData));
        const { id, ...driverData } = data;
        
        await updateDoc(doc(db, 'drivers', id), driverData);
        revalidatePath('/dashboard/drivers');
        return { success: true, message: `Driver "${data.name}" updated successfully.` };

    } catch (error: any) {
        console.error('Error updating driver:', error);
        const errorMessage = error.issues ? error.issues.map((e: any) => e.message).join(', ') : 'Failed to update driver.';
        return { success: false, message: errorMessage };
    }
}


export async function addProduct(prevState: any, formData: FormData) {
  try {
    const data = AddProductSchema.parse(Object.fromEntries(formData));
    await addDoc(collection(db, 'products'), data);
    revalidatePath('/dashboard/products');
    return { success: true, message: `Product "${data.name}" added successfully.` };
  } catch (error: any) {
    console.error('Error adding product:', error);
    const errorMessage = error.issues ? error.issues.map((e: any) => e.message).join(', ') : 'Failed to add product.';
    return { success: false, message: errorMessage };
  }
}

export async function updateProduct(prevState: any, formData: FormData) {
    try {
        const data = UpdateProductSchema.parse(Object.fromEntries(formData));
        const { id, ...productData } = data;

        await updateDoc(doc(db, 'products', id), productData);
        revalidatePath('/dashboard/products');
        return { success: true, message: `Product "${data.name}" updated successfully.` };

    } catch (error: any) {
        console.error('Error updating product:', error);
        const errorMessage = error.issues ? error.issues.map((e: any) => e.message).join(', ') : 'Failed to update product.';
        return { success: false, message: errorMessage };
    }
}

export async function addUser(prevState: any, formData: FormData) {
  try {
    const data = UserSchema.parse(Object.fromEntries(formData));

    // Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
      disabled: false,
    });
    
    // Set custom claim for role
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: data.role });

    // Save user details in Firestore
    await addDoc(collection(db, 'users'), {
      uid: userRecord.uid,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    
    revalidatePath('/dashboard/users');
    return { success: true, message: `User "${data.name}" created successfully.` };

  } catch (error: any) {
    console.error('Error adding user:', error);
    let errorMessage = 'Failed to add user.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email address is already in use.';
    } else if (error.issues) {
      errorMessage = error.issues.map((e: any) => e.message).join(', ');
    }
    return { success: false, message: errorMessage };
  }
}

export async function assignDriver(orderId: string, driverId: string, driverName: string) {
    try {
        await updateDoc(doc(db, "orders", orderId), {
            assignedDriver: driverName,
            assignedDriverId: driverId,
            status: "Out for Delivery",
        });
        revalidatePath('/dashboard/orders');
        return { success: true, message: `Order assigned to ${driverName}.` };
    } catch (error) {
        console.error("Error assigning driver:", error);
        return { success: false, message: "Failed to assign driver." };
    }
}
