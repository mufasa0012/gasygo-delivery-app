'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Driver } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Loader2 } from "lucide-react";

export default function DriversPage() {
    const [driversCollection, loading, error] = useCollection(collection(db, 'drivers'));
    
    const drivers: Driver[] = driversCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)) || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Drivers</h1>
                    <p className="text-muted-foreground">Manage your delivery personnel.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Driver
                </Button>
            </div>
            
            {loading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {error && <p className="text-destructive text-center">Error: {error.message}</p>}
            {!loading && !error && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Driver ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Assigned Orders</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drivers.map((driver) => (
                            <TableRow key={driver.id}>
                                <TableCell className="font-mono">{driver.id}</TableCell>
                                <TableCell className="font-medium">{driver.name}</TableCell>
                                <TableCell>{driver.phone}</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
