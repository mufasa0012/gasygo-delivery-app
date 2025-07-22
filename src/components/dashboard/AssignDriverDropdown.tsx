
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
import { Truck, Loader2 } from "lucide-react";
import type { Order, Driver } from "@/lib/types";
import { assignDriver } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AssignDriverDropdownProps {
    order: Order;
    drivers: Driver[];
}

export function AssignDriverDropdown({ order, drivers }: AssignDriverDropdownProps) {
    const { toast } = useToast();
    const [isAssigning, setIsAssigning] = useState(false);

    const handleAssignDriver = async (driver: Driver) => {
        setIsAssigning(true);
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
        setIsAssigning(false);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isAssigning}>
                    {isAssigning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Truck className="h-4 w-4 mr-2" />}
                    Assign
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Assign an Available Driver</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {drivers.length > 0 ? (
                    drivers.map(driver => (
                        <DropdownMenuItem key={driver.id} onClick={() => handleAssignDriver(driver)} disabled={isAssigning}>
                            {driver.name}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No drivers available</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
