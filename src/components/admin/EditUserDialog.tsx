import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  name: string;
  email: string;
  username: string;
  xUsername?: string;
}

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  onUserChange: (user: User | null) => void;
  onSave: (e: React.FormEvent) => void;
}

export const EditUserDialog = ({
  isOpen,
  onOpenChange,
  editingUser,
  onUserChange,
  onSave
}: EditUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editingUser?.name || ''}
              onChange={(e) => onUserChange(editingUser ? {...editingUser, name: e.target.value} : null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editingUser?.email || ''}
              onChange={(e) => onUserChange(editingUser ? {...editingUser, email: e.target.value} : null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="xUsername">X.com Username (optional)</Label>
            <Input
              id="xUsername"
              value={editingUser?.xUsername || ''}
              onChange={(e) => onUserChange(editingUser ? {...editingUser, xUsername: e.target.value} : null)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};