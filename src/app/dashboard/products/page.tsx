'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { ProductsTable } from "@/components/dashboard/ProductsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { EditProductDialog } from "@/components/dashboard/EditProductDialog";

export default function ProductsPage() {
    const [productsCollection, loading, error] = useCollection(collection(db, 'products'));

    const products: Product[] = productsCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)) || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Products</h1>
                    <p className="text-muted-foreground">Manage your gas cylinders, accessories, and inventory.</p>
                </div>
                <EditProductDialog>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Product
                    </Button>
                </EditProductDialog>
            </div>
            
            {loading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {error && <p className="text-destructive text-center">Error: {error.message}</p>}
            {!loading && !error && <ProductsTable products={products} />}
        </div>
    );
}
