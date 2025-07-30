export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    notes: string;
    items: {
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }[];
    status: 'Pending' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    totalPrice: number;
    createdAt: {
        toDate: () => Date;
    };
    driverId?: string;
    driverName?: string;
}
