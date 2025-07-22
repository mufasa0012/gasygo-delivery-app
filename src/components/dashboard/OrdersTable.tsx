'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order, Driver } from "@/lib/types";
import { format } from 'date-fns';
import { Button } from "../ui/button";
import { MapPin, Truck } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { assignDriver } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function OrdersTable({ orders }: { orders: Order[] }) {
    const { toast } = useToast();
    const [driversCollection] = useCollection(collection(db, 'drivers'));
    const drivers = driversCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)) || [];

    const handleAssignDriver = async (orderId: string, driver: Driver) => {
        const result = await assignDriver(orderId, driver.id, driver.name);
        if (result.success) {
            toast({
                title: 'Driver Assigned!',
                description: result.message,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Assignment Failed',
                description: result.message,
            });
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Driver</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{format(order.createdAt.toDate(), 'PPp')}</TableCell>
                        <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{order.deliveryAddress}</TableCell>
                        <TableCell>
                            {order.location ? (
                                <Button variant="outline" size="icon" asChild>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${order.location.latitude},${order.location.longitude}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                       <MapPin className="h-4 w-4" />
                                    </a>
                                </Button>
                            ) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">Ksh {order.total.toLocaleString()}</TableCell>
                        <TableCell>
                        <Badge 
                            variant={
                                order.status === 'Delivered' ? 'success' 
                                : order.status === 'Out for Delivery' ? 'default'
                                : 'secondary'
                            }
                        >
                            {order.status}
                        </Badge>
                        </TableCell>
                        <TableCell>{order.assignedDriver || 'Unassigned'}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Truck className="h-4 w-4 mr-2" />
                                    Assign
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Assign a Driver</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {drivers.map(driver => (
                                     <DropdownMenuItem key={driver.id} onClick={() => handleAssignDriver(order.id, driver)}>
                                        {driver.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
