import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, LogOut, User, Mail } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { ListDomainDialog } from "@/components/ListDomainDialog";
import { NotificationBell } from "@/components/NotificationBell";
import { Domain } from "@/types/domain";

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
  const userDetails = users.find((u) => u.username === username);
  const xUsername = userDetails?.xUsername;

  console.log('Users in context:', users);
  console.log('Won domains:', wonDomains);

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
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">@{username}</p>
              {xUsername && (
                <p className="text-xs leading-none text-muted-foreground">
                  <a
                    href={`https://x.com/${xUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    @{xUsername} <ExternalLink size={12} />
                  </a>
                </p>
              )}
              {userDetails?.email && (
                <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                  <Mail size={12} />
                  {userDetails.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-default">
              <User className="mr-2 h-4 w-4" />
              <span>Won Domains ({wonDomains.length})</span>
            </DropdownMenuItem>
            {wonDomains.map((domain) => {
              const sellerDetails = users.find((u) => u.username === domain.listedBy);
              console.log('Seller details for domain:', domain.name, sellerDetails);

              return (
                <DropdownMenuItem key={domain.id} className="pl-8 text-sm flex-col items-start py-2 cursor-default">
                  <div className="flex w-full justify-between items-center">
                    <span className="font-medium">{domain.name}</span>
                    <span className="text-green-600">${domain.finalPrice}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 space-y-1">
                    <div>
                      Listed by:{" "}
                      {sellerDetails ? (
                        <>
                          {sellerDetails.xUsername ? (
                            <a
                              href={`https://x.com/${sellerDetails.xUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              @{sellerDetails.xUsername} <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span>@{domain.listedBy}</span>
                          )}
                          {sellerDetails.email && (
                            <div className="flex items-center gap-1 mt-1">
                              <Mail size={12} />
                              <a
                                href={`mailto:${sellerDetails.email}`}
                                className="text-blue-600 hover:text-blue-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {sellerDetails.email}
                              </a>
                            </div>
                          )}
                        </>
                      ) : (
                        <span>@{domain.listedBy}</span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
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