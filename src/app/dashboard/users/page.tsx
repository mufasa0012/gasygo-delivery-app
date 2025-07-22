import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditUserDialog } from '@/components/dashboard/EditUserDialog';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

async function getUsers() {
  try {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as User[];
    return userList;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // In a real app, you might want to handle this error more gracefully
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and roles.</p>
        </div>
        <EditUserDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </EditUserDialog>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
