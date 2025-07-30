
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

interface Driver {
    id: string;
    name: string;
    phone: string;
    status: 'Available' | 'On Delivery' | 'Offline';
}

export default function DriversPage() {
    const [drivers, setDrivers] = React.useState<Driver[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedDriver, setSelectedDriver] = React.useState<Driver | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'drivers'), (snapshot) => {
            const driversData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
            setDrivers(driversData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async () => {
        if (selectedDriver) {
          try {
            await deleteDoc(doc(db, 'drivers', selectedDriver.id));
            toast({
              title: 'Driver Deleted',
              description: `${selectedDriver.name} has been removed.`,
            });
          } catch (error) {
             toast({
              title: 'Error',
              description: 'Could not delete driver. Please try again.',
              variant: 'destructive'
            });
          } finally {
            setShowDeleteDialog(false);
            setSelectedDriver(null);
          }
        }
      };


    const getStatusBadgeClass = (status: Driver['status']) => {
        switch (status) {
            case 'Available':
                return 'bg-green-500/20 text-green-700 border-green-500/30';
            case 'On Delivery':
                return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
            case 'Offline':
                return 'bg-red-500/20 text-red-700 border-red-500/30';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Drivers</h1>
          <p className="text-muted-foreground">Manage your delivery drivers.</p>
        </div>
        <Button asChild>
            <Link href="/admin/drivers/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Driver
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
          <CardDescription>A list of all registered drivers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Orders</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 3}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
              ) : drivers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    No drivers found. Add one to get started.
                    </TableCell>
                </TableRow>
              ) : (
                drivers.map(driver => (
                    <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>
                             <Badge variant="outline" className={cn("capitalize", getStatusBadgeClass(driver.status))}>
                                {driver.status}
                            </Badge>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link href={`/admin/drivers/edit/${driver.id}`}>Edit</Link></DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => {
                                        setSelectedDriver(driver);
                                        setShowDeleteDialog(true);
                                    }}
                                >
                                    Delete
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the driver
                &quot;{selectedDriver?.name}&quot; and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedDriver(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
       </AlertDialog>
    </div>
  );
}
