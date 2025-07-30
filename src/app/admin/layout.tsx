

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Package,
  Truck,
  Users,
  Settings,
  LogOut,
  LayoutGrid,
  ChevronRight,
  Flame,
  Bell,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useSound from 'use-sound';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Order } from '@/lib/orders';


const menuItems = [
  { href: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/admin/orders', icon: Package, label: 'Orders' },
  { href: '/admin/products', icon: Flame, label: 'Products' },
  { href: '/admin/drivers', icon: Truck, label: 'Drivers' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

const bottomMenuItems = [
    { href: '/driver/deliveries', icon: Truck, label: 'Driver View' },
    { href: '/login', icon: LogOut, label: 'Log Out' },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <Link href="/" className="flex items-center space-x-2">
                <Flame className="h-8 w-8 text-primary" />
            </Link>
          <h2
            className={cn(
              'text-xl font-semibold transition-opacity duration-200',
              state === 'collapsed' ? 'opacity-0' : 'opacity-100'
            )}
          >
            GasyGo Admin
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{
                      children: item.label,
                  }}
                >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full h-px bg-sidebar-border" />
        <SidebarMenu>
            {bottomMenuItems.map((item) => (
                 <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{
                        children: item.label,
                    }}
                    >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function OrderNotifications() {
    const [pendingOrders, setPendingOrders] = React.useState(0);
    const [ringtoneUrl, setRingtoneUrl] = React.useState<string | undefined>(undefined);
    const [play] = useSound(ringtoneUrl!, { volume: 0.5 });
    const { toast } = useToast();
    const router = useRouter();

    // Fetch ringtone setting
    React.useEffect(() => {
      const fetchSettings = async () => {
        const docRef = doc(db, 'settings', 'businessInfo');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().newOrderRingtoneUrl) {
          setRingtoneUrl(docSnap.data().newOrderRingtoneUrl);
        }
      };
      fetchSettings();
    }, []);

    // Listen for new orders
    React.useEffect(() => {
        const q = query(collection(db, "orders"), where("status", "==", "Pending"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
             setPendingOrders(snapshot.size);

            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const newOrder = { id: change.doc.id, ...change.doc.data() } as Order;
                    // Play sound if URL is set
                    if (ringtoneUrl) {
                       play();
                    }
                    // Show toast notification
                    toast({
                      title: "New Order Received!",
                      description: `${newOrder.customerName} has placed an order for Ksh${newOrder.totalPrice.toFixed(2)}.`,
                      duration: 10000, // 10 seconds
                      action: (
                         <ToastAction altText="View Order" onClick={() => router.push(`/admin/orders/${newOrder.id}`)}>
                            View
                         </ToastAction>
                      )
                    });
                }
            });
        });
        return () => unsubscribe();
    }, [play, toast, router, ringtoneUrl]);

  return (
    <Popover>
        <PopoverTrigger asChild>
             <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {pendingOrders > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center"
                    >
                        {pendingOrders}
                    </Badge>
                )}
                <span className="sr-only">Open notifications</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent align="end">
            <div className="p-4 text-center">
                <h4 className="font-semibold">Notifications</h4>
                <p className="text-sm text-muted-foreground mt-2">
                    {pendingOrders > 0 ? `You have ${pendingOrders} new pending orders.` : 'No new notifications.'}
                </p>
                {pendingOrders > 0 &&
                    <Button size="sm" className="mt-4 w-full" asChild>
                        <Link href="/admin/orders">View Orders</Link>
                    </Button>
                }
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <SidebarInset>
            <header className="flex h-16 items-center justify-between border-b px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Admin Panel</h1>
                </div>
                <div className="flex items-center gap-4">
                    <OrderNotifications />
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
