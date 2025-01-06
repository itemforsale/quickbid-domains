import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EditUserDialog } from "./EditUserDialog";
import { UserCard } from "./UserCard";
import { User } from "@/types/user";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserManagementSectionProps {
  onUpdateUser: (user: User) => void;
}

export const UserManagementSection = ({ onUpdateUser }: UserManagementSectionProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      toast.error('Failed to load users');
      return;
    }

    setUsers(profiles.map(profile => ({
      id: profile.id,
      username: profile.username,
      email: profile.email,
      xUsername: profile.x_username,
      isAdmin: profile.is_admin,
      createdAt: profile.created_at
    })));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        username: updatedUser.username,
        email: updatedUser.email,
        x_username: updatedUser.xUsername,
        is_admin: updatedUser.isAdmin
      })
      .eq('id', updatedUser.id);

    if (error) {
      toast.error('Failed to update user');
      return;
    }

    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    onUpdateUser(updatedUser);
    setIsDialogOpen(false);
    toast.success('User updated successfully');
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <div className="grid gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => handleEditUser(user)}
            />
          ))}
        </div>
      </Card>

      <EditUserDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleUpdateUser}
      />
    </div>
  );
};