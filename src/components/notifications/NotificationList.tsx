import { Button } from "@/components/ui/button";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  notifications: Array<{ id: string; message: string }>;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationList = ({ 
  notifications, 
  onDismiss, 
  onClearAll 
}: NotificationListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Notifications</h4>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new notifications</p>
        ) : (
          notifications.map(({ id, message }) => (
            <NotificationItem
              key={id}
              id={id}
              message={message}
              onDismiss={onDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
};