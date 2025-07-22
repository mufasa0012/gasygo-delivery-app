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
import { MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import { AssignDriverDropdown } from "./AssignDriverDropdown";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface OrdersTableProps {
    orders: Order[];
    drivers: Driver[];
    onDelete: (order: Order) => void;
}

export function OrdersTable({ orders, drivers, onDelete }: OrdersTableProps) {
    const inProgressOrders = orders.filter(doc => doc.status === 'In Progress').map(doc => doc.assignedDriverId);
    const availableDrivers = drivers.filter(driver => !inProgressOrders.includes(driver.id));
    
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
                           {order.status === 'Pending' ? (
                               <AssignDriverDropdown order={order} drivers={availableDrivers} />
                            ) : (
                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <AlertDialogTrigger asChild>
                                                 <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                                    <Trash2 className="mr-2 h-4 w-4"/> Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this order record.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDelete(order)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
