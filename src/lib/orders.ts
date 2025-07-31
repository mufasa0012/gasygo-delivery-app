
export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryLocation: {
        lat: number;
        lng: number;
    } | null;
    driverLocation?: {
        lat: number;
        lng: number;
    } | null;
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
