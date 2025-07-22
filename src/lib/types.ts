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
  assignedDriverId?: string;
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
  id: string;
  name: string;
  phone: string;
  vehicle: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer' | 'driver';
}
