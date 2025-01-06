import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Domain } from "@/types/domain";
import { parseDate } from "@/utils/dateUtils";

interface UseNotificationsProps {
  username: string;
  domains: Domain[];
}

export const useNotifications = ({ username, domains }: UseNotificationsProps) => {
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [shownNotifications] = useState<Set<string>>(new Set());
  const [lastCheckTime] = useState<Date>(new Date());

  useEffect(() => {
    const checkAuctionStatus = () => {
      domains.forEach(domain => {
        const outbidId = `outbid-${domain.id}`;
        const wonId = `won-${domain.id}`;
        const buyNowId = `buynow-${domain.id}`;
        
        // Check for outbids
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
        
        // Check for auction wins
        if (domain.status === 'sold' && 
            domain.currentBidder === username && 
            parseDate(domain.endTime) < new Date() && 
            !shownNotifications.has(wonId) &&
            domain.purchaseDate && 
            parseDate(domain.purchaseDate) > lastCheckTime) {
          const message = `🎉 Congratulations! You've won the auction for ${domain.name}!`;
          setNotifications(prev => [...prev, { id: wonId, message }]);
          
          toast.success(message, {
            duration: Infinity,
            action: {
              label: "View Details",
              onClick: () => {
                const userDropdownButton = document.querySelector('[aria-haspopup="menu"]') as HTMLButtonElement;
                if (userDropdownButton) {
                  userDropdownButton.click();
                }
              },
            },
            onDismiss: () => {
              dismissNotification(wonId);
            }
          });
          
          shownNotifications.add(wonId);
          setHasUnread(true);
        }

        // Check for buy now purchases
        if (domain.status === 'sold' && 
            domain.currentBidder === username && 
            !shownNotifications.has(buyNowId) &&
            domain.purchaseDate && 
            parseDate(domain.purchaseDate) > lastCheckTime) {
          const message = `🎉 Success! You've purchased ${domain.name} using Buy Now!`;
          setNotifications(prev => [...prev, { id: buyNowId, message }]);
          
          toast.success(message, {
            duration: Infinity,
            action: {
              label: "View Details",
              onClick: () => {
                const userDropdownButton = document.querySelector('[aria-haspopup="menu"]') as HTMLButtonElement;
                if (userDropdownButton) {
                  userDropdownButton.click();
                }
              },
            },
            onDismiss: () => {
              dismissNotification(buyNowId);
            }
          });
          
          shownNotifications.add(buyNowId);
          setHasUnread(true);
        }
      });
    };

    checkAuctionStatus();
    const interval = setInterval(checkAuctionStatus, 30000);

    return () => clearInterval(interval);
  }, [domains, username, shownNotifications, lastCheckTime]);

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