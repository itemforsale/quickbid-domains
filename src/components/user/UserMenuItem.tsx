import { ExternalLink, Mail } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface UserMenuItemProps {
  domain: {
    id: number;
    name: string;
    finalPrice: number;
    listedBy: string;
  };
  sellerDetails?: {
    username: string;
    email?: string;
    xUsername?: string;
  };
}

export const UserMenuItem = ({ domain, sellerDetails }: UserMenuItemProps) => {
  const sellerXUsername = sellerDetails?.xUsername || sellerDetails?.username;

  return (
    <DropdownMenuItem className="pl-8 text-sm flex-col items-start py-2 cursor-default">
      <div className="flex w-full justify-between items-center">
        <span className="font-medium">{domain.name}</span>
        <span className="text-green-600">${domain.finalPrice}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1 space-y-1">
        <div>
          Listed by:{" "}
          {sellerDetails ? (
            <>
              {sellerXUsername ? (
                <a
                  href={`https://x.com/${sellerXUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{sellerXUsername} <ExternalLink size={12} />
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
};