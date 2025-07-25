import type { Timestamp, GeoPoint } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  category: 'Gas Cylinder' | 'Accessory' | 'Full Set';
  price: number;
  stock: number;
  image: string;
  description?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'In Progress' | 'Delivered' | 'Declined';
  paymentMethod: 'M-Pesa' | 'Cash on Delivery';
  deliveryAddress: string;
  location?: GeoPoint;
  assignedDriver?: string;
  assignedDriverId?: string; // This will now be the Firebase Auth UID of the driver
  createdAt: Date;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  orderHistory: string[];
};

export type Driver = {
  id: string; // This is the Firebase Auth UID
  name: string;
  phone: string;
  vehicle: string;
  available: boolean;
  location?: GeoPoint;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer' | 'driver';
}

    