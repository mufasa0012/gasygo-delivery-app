
'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { Truck } from "lucide-react";
import type { Order, Driver } from "@/lib/types";
import { assignDriver } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface AssignDriverDropdownProps {
    order: Order;
    drivers: Driver[];
}

export function AssignDriverDropdown({ order, drivers }: AssignDriverDropdownProps) {
    const { toast } = useToast();

    const handleAssignDriver = async (driver: Driver) => {
        const result = await assignDriver(order.id, driver.id, driver.name);
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Truck className="h-4 w-4 mr-2" />
                    Assign
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Assign a Driver</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {drivers.map(driver => (
                     <DropdownMenuItem key={driver.id} onClick={() => handleAssignDriver(driver)}>
                        {driver.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
