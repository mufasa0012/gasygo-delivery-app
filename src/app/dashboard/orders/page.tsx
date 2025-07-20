import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { orders } from "@/lib/data";

export default function OrdersPage() {

    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const inProgressOrders = orders.filter(o => o.status === 'In Progress');
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const declinedOrders = orders.filter(o => o.status === 'Declined');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
                <p className="text-muted-foreground">Manage and track all customer orders.</p>
            </div>
            
            <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="declined">Declined</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Orders</CardTitle>
                            <CardDescription>These orders need to be accepted or declined.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={pendingOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="in-progress">
                    <Card>
                        <CardHeader>
                            <CardTitle>In Progress Orders</CardTitle>
                            <CardDescription>These orders are currently out for delivery.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={inProgressOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="delivered">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivered Orders</CardTitle>
                            <CardDescription>A history of all completed orders.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={deliveredOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="declined">
                    <Card>
                        <CardHeader>
                            <CardTitle>Declined Orders</CardTitle>
                            <CardDescription>A history of all declined orders.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={declinedOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
