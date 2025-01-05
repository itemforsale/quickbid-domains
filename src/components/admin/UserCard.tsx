import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2 } from "lucide-react";

interface UserCardProps {
  user: {
    name: string;
    email: string;
    username: string;
    xUsername?: string;
    isAdmin?: boolean;
  };
  onEdit: (user: UserCardProps['user']) => void;
  onDelete: (username: string) => void;
}

export const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  return (
    <Card className="p-4 bg-background border-border">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium text-foreground">{user.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground">Username: {user.username}</p>
        <p className="text-sm text-muted-foreground">Email: {user.email}</p>
        {user.xUsername && (
          <p className="text-sm text-muted-foreground">X.com: @{user.xUsername}</p>
        )}
        {!user.isAdmin && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => onEdit(user)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(user.username)}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};