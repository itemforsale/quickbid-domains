import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { ListDomainDialog } from "@/components/ListDomainDialog";
import { NotificationBell } from "@/components/NotificationBell";
import { Domain } from "@/types/domain";
import { UserMenuItem } from "./user/UserMenuItem";
import { UserMenuHeader } from "./user/UserMenuHeader";

interface UserDropdownMenuProps {
  username: string;
  domains: Domain[];
  wonDomains: {
    id: number;
    name: string;
    finalPrice: number;
    purchaseDate: Date;
    listedBy: string;
  }[];
  onLogout: () => void;
  onDomainSubmit: (domain: string, startingPrice: number, buyNowPrice: number | null) => void;
}

export const UserDropdownMenu = ({
  username,
  domains,
  wonDomains,
  onLogout,
  onDomainSubmit,
}: UserDropdownMenuProps) => {
  const { users } = useUser();
  const userDetails = username === '60dna' 
    ? {
        username: '60dna',
        name: 'Sam Charles',
        email: 'sam@wizard.uk',
        xUsername: 'samcharles',
        isAdmin: true
      } 
    : users.find((u) => u.username.toLowerCase() === username.toLowerCase());

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <ListDomainDialog onDomainSubmit={onDomainSubmit} />
      <NotificationBell username={username} domains={domains} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end" forceMount>
          <UserMenuHeader 
            username={username}
            xUsername={userDetails?.xUsername}
            email={userDetails?.email}
          />
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-default">
              <User className="mr-2 h-4 w-4" />
              <span>Won Domains ({wonDomains.length})</span>
            </DropdownMenuItem>
            {wonDomains.map((domain) => {
              const sellerDetails = domain.listedBy === '60dna' 
                ? {
                    username: '60dna',
                    name: 'Sam Charles',
                    email: 'sam@wizard.uk',
                    xUsername: 'samcharles',
                    isAdmin: true
                  } 
                : users.find((u) => u.username.toLowerCase() === domain.listedBy.toLowerCase());

              return (
                <UserMenuItem
                  key={domain.id}
                  domain={domain}
                  sellerDetails={sellerDetails}
                />
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};