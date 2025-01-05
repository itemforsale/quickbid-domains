import { AuthDialogs } from "@/components/AuthDialogs";
import { UserDropdownMenu } from "@/components/UserDropdownMenu";
import { Domain } from "@/types/domain";

interface UserSectionProps {
  user: {
    username: string;
    isAdmin?: boolean;
  } | null;
  domains: Domain[];
  wonDomains: {
    id: number;
    name: string;
    finalPrice: number;
    purchaseDate: Date;
  }[];
  onLogout: () => void;
  onDomainSubmit: (domain: string, startingPrice: number, buyNowPrice: number | null) => void;
}

export const UserSection = ({ 
  user, 
  domains, 
  wonDomains, 
  onLogout, 
  onDomainSubmit 
}: UserSectionProps) => {
  if (!user) {
    return <AuthDialogs />;
  }

  return (
    <UserDropdownMenu
      username={user.username}
      domains={domains}
      wonDomains={wonDomains}
      onLogout={onLogout}
      onDomainSubmit={onDomainSubmit}
    />
  );
};