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
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [shownNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkAuctionStatus = () => {
      domains.forEach(domain => {
        // Create unique IDs for notifications
        const outbidId = `outbid-${domain.id}`;
        const wonId = `won-${domain.id}`;
        
        if (domain.status === 'active' && 
            domain.currentBidder === username && 
            domain.currentBidder !== domain.currentBidder && 
            !shownNotifications.has(outbidId)) {
          const message = `You've been outbid on ${domain.name}!`;
          setNotifications(prev => [...prev, { id: outbidId, message }]);
          toast.warning(message);
          shownNotifications.add(outbidId);
          setHasUnread(true);
        }
        
        if (domain.status === 'sold' && 
            domain.currentBidder === username && 
            new Date() > domain.endTime && 
            !shownNotifications.has(wonId)) {
          const message = `Congratulations! You've won the auction for ${domain.name}!`;
          setNotifications(prev => [...prev, { id: wonId, message }]);
          toast.success(message);
          shownNotifications.add(wonId);
          setHasUnread(true);
          
          // Automatically dismiss win notification after 5 seconds
          setTimeout(() => {
            dismissNotification(wonId);
          }, 5000);
        }
      });
    };

    checkAuctionStatus();
    const interval = setInterval(checkAuctionStatus, 30000);

    return () => clearInterval(interval);
  }, [domains, username, shownNotifications]);

  const clearNotifications = () => {
    setNotifications([]);
    setHasUnread(false);
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notifications.length <= 1) {
      setHasUnread(false);
    }
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
              notifications.map(({ id, message }) => (
                <div 
                  key={id} 
                  className="text-sm p-2 bg-muted rounded-lg flex justify-between items-center group"
                >
                  <span>{message}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => dismissNotification(id)}
                  >
                    Dismiss
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};