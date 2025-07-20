import { products } from "@/lib/data";
import { ProductsTable } from "@/components/dashboard/ProductsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EditProductDialog } from "@/components/dashboard/EditProductDialog";

export default function ProductsPage() {
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
            
            <ProductsTable products={products} />
        </div>
    );
}
