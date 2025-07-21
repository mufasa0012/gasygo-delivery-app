'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Driver } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Loader2, Pencil, Trash2 } from "lucide-react";
import { EditDriverDialog } from '@/components/dashboard/EditDriverDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function DriversPage() {
    const [driversCollection, loading, error] = useCollection(collection(db, 'drivers'));
    const { toast } = useToast();
    
    const drivers: Driver[] = driversCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)) || [];

    const handleDelete = async (driver: Driver) => {
        try {
            await deleteDoc(doc(db, "drivers", driver.id));
            toast({
                title: "Driver Deleted",
                description: `"${driver.name}" has been successfully deleted.`
            });
        } catch (error) {
            console.error("Error deleting driver:", error);
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "There was a problem deleting the driver."
            });
        }
    }


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Drivers</h1>
                    <p className="text-muted-foreground">Manage your delivery personnel.</p>
                </div>
                 <EditDriverDialog>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Driver
                    </Button>
                </EditDriverDialog>
            </div>
            
            {loading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {error && <p className="text-destructive text-center">Error: {error.message}</p>}
            {!loading && !error && (
                <div className="overflow-x-auto">
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
                                    <TableCell className="font-mono text-xs">{driver.id.substring(0,6)}...</TableCell>
                                    <TableCell className="font-medium">{driver.name}</TableCell>
                                    <TableCell>{driver.phone}</TableCell>
                                    <TableCell>3</TableCell>
                                    <TableCell className="text-right">
                                         <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <EditDriverDialog driver={driver}>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Pencil className="mr-2 h-4 w-4"/> Edit
                                                        </DropdownMenuItem>
                                                    </EditDriverDialog>
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
                                                    This action cannot be undone. This will permanently delete the
                                                    driver "{driver.name}".
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(driver)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
