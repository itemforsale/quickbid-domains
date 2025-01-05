import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationList } from "./notifications/NotificationList";
import { useNotifications } from "./notifications/useNotifications";
import { Domain } from "@/types/domain";

interface NotificationBellProps {
  username: string;
  domains: Domain[];
}

export const NotificationBell = ({ username, domains }: NotificationBellProps) => {
  const {
    notifications,
    hasUnread,
    clearNotifications,
    dismissNotification
  } = useNotifications({ username, domains });

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
        <NotificationList
          notifications={notifications}
          onDismiss={dismissNotification}
          onClearAll={clearNotifications}
        />
      </PopoverContent>
    </Popover>
  );
};