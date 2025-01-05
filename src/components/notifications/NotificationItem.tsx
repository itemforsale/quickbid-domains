import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  id: string;
  message: string;
  onDismiss: (id: string) => void;
}

export const NotificationItem = ({ id, message, onDismiss }: NotificationItemProps) => {
  return (
    <div className="text-sm p-2 bg-muted rounded-lg flex justify-between items-center group">
      <span>{message}</span>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDismiss(id)}
      >
        Dismiss
      </Button>
    </div>
  );
};