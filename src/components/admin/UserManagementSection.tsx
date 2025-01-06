import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditUserDialog } from "./EditUserDialog";
import { UserCard } from "./UserCard";
import { User } from "@/types/domain";

interface UserManagementSectionProps {
  users: User[];
  onUpdateUser: (user: User) => void;
}

export const UserManagementSection = ({ users, onUpdateUser }: UserManagementSectionProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserChange = (user: User | null) => {
    setEditingUser(user);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        onUpdateUser(editingUser);
        setIsEditDialogOpen(false);
        setEditingUser(null);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User Management</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => handleEditUser(user)}
          />
        ))}
      </div>

      <EditUserDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingUser={editingUser}
        onUserChange={handleUserChange}
        onSave={handleSaveEdit}
      />
    </div>
  );
};