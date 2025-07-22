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
import { MapPin } from "lucide-react";
import { AssignDriverDropdown } from "./AssignDriverDropdown";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OrdersTableProps {
    orders: Order[];
    drivers: Driver[];
}

export function OrdersTable({ orders, drivers }: OrdersTableProps) {
    
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
                        <TableCell className="font-medium">{order.createdAt ? format(order.createdAt, 'PPp') : 'N/A'}</TableCell>
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
                                order.status === 'Delivered' ? 'default' 
                                : order.status === 'In Progress' ? 'secondary'
                                : order.status === 'Pending' ? 'outline'
                                : 'destructive'
                            }
                        >
                            {order.status}
                        </Badge>
                        </TableCell>
                        <TableCell>{order.assignedDriver || 'Unassigned'}</TableCell>
                        <TableCell className="text-right">
                           {order.status === 'Pending' && <AssignDriverDropdown order={order} drivers={drivers} />}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
