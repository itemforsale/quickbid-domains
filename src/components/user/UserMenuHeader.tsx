import { ExternalLink, Mail } from "lucide-react";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface UserMenuHeaderProps {
  username: string;
  xUsername?: string;
  email?: string;
}

export const UserMenuHeader = ({ username, xUsername, email }: UserMenuHeaderProps) => {
  return (
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-2">
        <p className="text-lg font-bold leading-none text-primary">@{username}</p>
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
        {email && (
          <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
            <Mail size={12} />
            {email}
          </p>
        )}
      </div>
    </DropdownMenuLabel>
  );
};