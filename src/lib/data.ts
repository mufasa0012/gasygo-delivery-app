import type { Product, Order } from './types';

export const products: Product[] = [
  { id: '1', name: 'K-Gas 6kg', category: 'Gas Cylinder', price: 1200, stock: 50, image: 'https://placehold.co/400x400.png', description: 'Reliable 6kg K-Gas cylinder for your cooking needs.' },
  { id: '2', name: 'K-Gas 13kg', category: 'Gas Cylinder', price: 2500, stock: 30, image: 'https://placehold.co/400x400.png', description: 'Larger 13kg K-Gas cylinder for extended use.' },
  { id: '3', name: 'Total Gas 6kg', category: 'Gas Cylinder', price: 1250, stock: 45, image: 'https://placehold.co/400x400.png', description: '6kg Total Gas cylinder, a trusted brand.' },
  { id: '4', name: 'Total Gas 13kg', category: 'Gas Cylinder', price: 2600, stock: 25, image: 'https://placehold.co/400x400.png', description: '13kg Total Gas cylinder for heavy users.' },
  { id: '5', name: 'Afrigas 6kg', category: 'Gas Cylinder', price: 1150, stock: 60, image: 'https://placehold.co/400x400.png', description: 'Affordable and reliable 6kg Afrigas cylinder.' },
  { id: '6', name: 'DrachenGas 13kg', category: 'Gas Cylinder', price: 2550, stock: 20, image: 'https://placehold.co/400x400.png', description: 'Premium 13kg DrachenGas cylinder.' },
  { id: '7', name: 'Gas Regulator', category: 'Accessory', price: 800, stock: 100, image: 'https://placehold.co/400x400.png', description: 'High-quality gas regulator for safety.' },
  { id: '8', name: 'Hosepipe', category: 'Accessory', price: 300, stock: 150, image: 'https://placehold.co/400x400.png', description: 'Durable gas hosepipe, 1.5m length.' },
  { id: '9', name: 'Gas Lighter', category: 'Accessory', price: 150, stock: 200, image: 'https://placehold.co/400x400.png', description: 'Easy-to-use gas lighter.' },
  { id: '10', name: 'Portable Grill', category: 'Accessory', price: 3500, stock: 15, image: 'https://placehold.co/400x400.png', description: 'Compact grill for outdoor cooking.' },
];

export const orders: Order[] = [
    { 
        id: 'ORD-001', 
        customerName: 'John Doe',
        customerPhone: '0712345678',
        items: [{ product: products[1], quantity: 1 }, { product: products[6], quantity: 1 }], 
        total: 5050, 
        status: 'Pending', 
        paymentMethod: 'M-Pesa',
        deliveryAddress: '123 Main St, Kilimani, Nairobi',
        createdAt: new Date('2024-07-20T10:30:00Z'),
    },
    { 
        id: 'ORD-002', 
        customerName: 'Jane Smith',
        customerPhone: '0723456789',
        items: [{ product: products[2], quantity: 1 }], 
        total: 1250, 
        status: 'In Progress', 
        paymentMethod: 'Cash on Delivery',
        deliveryAddress: '456 Rhapta Rd, Westlands, Nairobi',
        driverId: 'DRV-01',
        createdAt: new Date('2024-07-20T11:00:00Z'),
    },
    { 
        id: 'ORD-003', 
        customerName: 'Peter Jones',
        customerPhone: '0734567890',
        items: [{ product: products[4], quantity: 2 }], 
        total: 2300, 
        status: 'Delivered', 
        paymentMethod: 'M-Pesa',
        deliveryAddress: '789 Ngong Rd, Karen, Nairobi',
        driverId: 'DRV-02',
        createdAt: new Date('2024-07-19T14:00:00Z'),
    },
     { 
        id: 'ORD-004', 
        customerName: 'Mary Anne',
        customerPhone: '0745678901',
        items: [{ product: products[0], quantity: 1 }], 
        total: 1200, 
        status: 'Declined', 
        paymentMethod: 'M-Pesa',
        deliveryAddress: '101 Thika Road, Roysambu, Nairobi',
        createdAt: new Date('2024-07-19T09:15:00Z'),
    },
];

export const drivers = [
    { id: 'DRV-01', name: 'James Kamau', phone: '0711111111' },
    { id: 'DRV-02', name: 'David Odhiambo', phone: '0722222222' },
];
