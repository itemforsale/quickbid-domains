import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { UserCard } from "./UserCard";
import { EditUserDialog } from "./EditUserDialog";
import { User } from "@/types/domain";

export const UserManagementSection = () => {
  const { users, deleteUser, updateUser } = useUser();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDeleteUser = async (username: string) => {
    try {
      await deleteUser(username);
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

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
        await updateUser(editingUser);
        setIsEditDialogOpen(false);
        setEditingUser(null);
        toast.success("User updated successfully!");
      } catch (error) {
        toast.error("Failed to update user");
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <UserCard
            key={user.username}
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
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