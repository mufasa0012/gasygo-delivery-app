import type { Product, Order, Driver } from './types';

// This file is now used for providing type information and potentially for seeding the database.
// The application fetches real-time data from Firebase Firestore.

export const products: Product[] = [];
export const orders: Order[] = [];
export const drivers: Driver[] = [];
