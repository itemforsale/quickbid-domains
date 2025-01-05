import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Domain } from "@/types/domain";

interface UseNotificationsProps {
  username: string;
  domains: Domain[];
}

export const useNotifications = ({ username, domains }: UseNotificationsProps) => {
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [shownNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkAuctionStatus = () => {
      domains.forEach(domain => {
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

  return {
    notifications,
    hasUnread,
    clearNotifications,
    dismissNotification
  };
};