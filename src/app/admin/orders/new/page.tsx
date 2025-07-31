

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/products';
import { Skeleton } from '@/components/ui/skeleton';

interface Driver {
    id: string;
    name: string;
    status: 'Available' | 'On Delivery' | 'Offline';
}

export default function NewOrderPage() {
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [drivers, setDrivers] = React.useState<Driver[]>([]);
    const [loadingProducts, setLoadingProducts] = React.useState(true);
    const [loadingDrivers, setLoadingDrivers] = React.useState(true);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

    React.useEffect(() => {
        const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) }));
            setProducts(productsData);
            setLoadingProducts(false);
        });

        const unsubscribeDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
            const driversData = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Driver, 'id'>) }));
            setDrivers(driversData);
            setLoadingDrivers(false);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeDrivers();
        };
    }, []);
    
    // Form state
    const [formData, setFormData] = React.useState({
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
        productId: '',
        quantity: '1',
        driverId: '',
        status: 'Pending',
        notes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({...prev, [id]: value === 'unassigned' ? '' : value }));
        if (id === 'productId') {
            const product = products.find(p => p.id === value) || null;
            setSelectedProduct(product);
        }
    }

    const calculateTotal = () => {
        if (!selectedProduct) return 0;
        const quantity = parseInt(formData.quantity, 10);
        if (isNaN(quantity) || quantity < 1) return 0;
        return selectedProduct.price * quantity;
    }

    const handleCreateOrder = async () => {
        if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress || !formData.productId) {
            toast({
                title: 'Missing Fields',
                description: 'Please fill in all customer and product details.',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);

        const driver = drivers.find(d => d.id === formData.driverId);
        const orderItems = selectedProduct ? [{
            productId: selectedProduct.id,
            name: selectedProduct.name,
            quantity: parseInt(formData.quantity, 10),
            price: selectedProduct.price
        }] : [];

        try {
            await addDoc(collection(db, 'orders'), {
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                deliveryAddress: formData.deliveryAddress,
                notes: formData.notes,
                items: orderItems,
                totalPrice: calculateTotal(),
                status: formData.status,
                driverId: formData.driverId || null,
                driverName: driver ? driver.name : null,
                createdAt: new Date(),
            });

            toast({
                title: 'Order Created!',
                description: 'The new order has been successfully created.',
            });

            // Reset form
            setFormData({
                customerName: '',
                customerPhone: '',
                deliveryAddress: '',
                productId: '',
                quantity: '1',
                driverId: '',
                status: 'Pending',
                notes: ''
            });
            setSelectedProduct(null);

        } catch (error) {
            console.error('Error creating order: ', error);
            toast({
                title: 'Error',
                description: 'There was a problem creating the order.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Create New Order</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Fill in the customer and product information for the new order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Customer Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Full Name</Label>
                            <Input id="customerName" placeholder="e.g., Jane Doe" value={formData.customerName} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customerPhone">Phone Number</Label>
                            <Input id="customerPhone" type="tel" placeholder="e.g., +254712345678" value={formData.customerPhone} onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deliveryAddress">Delivery Address</Label>
                        <Textarea id="deliveryAddress" placeholder="e.g., 123 Main St, Apartment 4B, Nairobi" value={formData.deliveryAddress} onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="w-full border-t border-border"></div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Product Information</h3>
                     <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productId">Product</Label>
                            {loadingProducts ? <Skeleton className="h-10 w-full" /> : (
                             <Select onValueChange={(value) => handleSelectChange('productId', value)} value={formData.productId}>
                                <SelectTrigger id="productId">
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(product => (
                                        <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input id="quantity" type="number" min="1" value={formData.quantity} onChange={handleInputChange}/>
                        </div>
                     </div>
                </div>

                <div className="w-full border-t border-border"></div>
                
                 <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea id="notes" placeholder="Any special instructions for this order." value={formData.notes} onChange={handleInputChange}/>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="driverId">Assign Driver</Label>
                     {loadingDrivers ? <Skeleton className="h-10 w-full" /> : (
                    <Select onValueChange={(value) => handleSelectChange('driverId', value)} value={formData.driverId || 'unassigned'}>
                        <SelectTrigger id="driverId">
                            <SelectValue placeholder="Select a driver" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="unassigned">Unassigned</SelectItem>
                            {drivers.map(driver => (
                                <SelectItem key={driver.id} value={driver.id} disabled={driver.status !== 'Available'}>
                                    {driver.name} ({driver.status})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Order Status</Label>
                    <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full border-t border-border my-4"></div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>Ksh{calculateTotal().toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Calculated from product price and quantity.</p>
                </div>

                <Button className="w-full" size="lg" onClick={handleCreateOrder} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Create Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
