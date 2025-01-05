import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { UserProfile } from "@/components/UserProfile";
import { AuthDialogs } from "@/components/AuthDialogs";
import { ListDomainDialog } from "@/components/ListDomainDialog";
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
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4 mb-8">
        <p className="text-gray-700">
          Welcome, <span className="font-semibold">{user.username}</span>!
        </p>
        <ListDomainDialog onDomainSubmit={onDomainSubmit} />
        <NotificationBell username={user.username} domains={domains} />
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>
      <UserProfile username={user.username} wonDomains={wonDomains} />
    </div>
  );
};