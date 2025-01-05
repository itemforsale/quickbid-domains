import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Domain {
  id: number;
  name: string;
  currentBid: number;
  currentBidder?: string;
  endTime: Date;
  status: 'pending' | 'active' | 'sold';
}

interface NotificationBellProps {
  username: string;
  domains: Domain[];
}

export const NotificationBell = ({ username, domains }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkAuctionStatus = () => {
      const newNotifications: string[] = [];
      
      domains.forEach(domain => {
        if (domain.status === 'active' && domain.currentBidder === username && 
            domain.currentBidder !== domain.currentBidder) {
          newNotifications.push(`You've been outbid on ${domain.name}!`);
          toast.warning(`You've been outbid on ${domain.name}!`);
        }
        
        if (domain.status === 'sold' && domain.currentBidder === username && 
            new Date() > domain.endTime) {
          newNotifications.push(`Congratulations! You've won the auction for ${domain.name}!`);
          toast.success(`Congratulations! You've won the auction for ${domain.name}!`);
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        setHasUnread(true);
      }
    };

    checkAuctionStatus();
    const interval = setInterval(checkAuctionStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [domains, username]);

  const clearNotifications = () => {
    setNotifications([]);
    setHasUnread(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500"
              variant="destructive"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearNotifications}>
                Clear all
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className="text-sm p-2 bg-muted rounded-lg"
                >
                  {notification}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};