import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TicketDropdownProps {
  onTicketChange: (tickets: { [key: string]: number }) => void;
}

const TicketDropdown = ({ onTicketChange }: TicketDropdownProps) => {
  const [tickets, setTickets] = useState({
    vvip: 0,
    vip: 0,
    regular: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = parseInt(e.target.value) || 0;
    setTickets((prev) => ({ ...prev, [type]: value }));
    onTicketChange({ ...tickets, [type]: value });
  };

  const getTotalTickets = () => {
    return Object.values(tickets).reduce((sum, count) => sum + count, 0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Tickets ({getTotalTickets()})</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Tickets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(tickets).map(([type, count]) => (
          <div key={type} className="flex items-center justify-between p-2">
            <Label htmlFor={type} className="capitalize">
              {type}
            </Label>
            <Input
              id={type}
              type="number"
              value={count}
              onChange={(e) => handleInputChange(e, type)}
              className="w-20"
              min="0"
            />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketDropdown;
