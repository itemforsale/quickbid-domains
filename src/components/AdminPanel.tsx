import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { UserCard } from "./admin/UserCard";
import { EditUserDialog } from "./admin/EditUserDialog";
import { DomainCard } from "./admin/DomainCard";
import { AdvertisementSettings } from "./admin/AdvertisementSettings";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface Domain {
  id: number;
  name: string;
  currentBid: number;
  buyNowPrice?: number;
  status: 'pending' | 'active' | 'sold';
  featured?: boolean;
}

interface User {
  name: string;
  email: string;
  username: string;
  xUsername?: string;
  isAdmin?: boolean;
}

interface AdminPanelProps {
  pendingDomains: Domain[];
  onApproveDomain: (domainId: number) => void;
  onRejectDomain: (domainId: number) => void;
  onDeleteListing?: (domainId: number) => void;
  onFeatureDomain?: (domainId: number) => void;
  activeDomains: Domain[];
}

export const AdminPanel = ({ 
  pendingDomains, 
  onApproveDomain, 
  onRejectDomain,
  onDeleteListing,
  onFeatureDomain,
  activeDomains 
}: AdminPanelProps) => {
  const { users, deleteUser, updateUser } = useUser();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [hideSearch, setHideSearch] = useState(() => {
    return localStorage.getItem('hideSearch') === 'true';
  });

  const handleApprove = (domainId: number) => {
    onApproveDomain(domainId);
    toast.success("Domain approved successfully!");
  };

  const handleReject = (domainId: number) => {
    onRejectDomain(domainId);
    toast.success("Domain rejected successfully!");
  };

  const handleDelete = (domainId: number) => {
    if (onDeleteListing) {
      onDeleteListing(domainId);
      toast.success("Listing deleted successfully!");
    }
  };

  const handleFeature = (domainId: number) => {
    if (onFeatureDomain) {
      onFeatureDomain(domainId);
      toast.success("Domain featured status updated!");
    }
  };

  const handleDeleteUser = (username: string) => {
    deleteUser(username);
    toast.success("User deleted successfully!");
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const originalUser = users.find(u => u.username === editingUser.username);
      if (originalUser) {
        updateUser({
          ...editingUser,
          password: originalUser.password
        });
        setIsEditDialogOpen(false);
        setEditingUser(null);
        toast.success("User updated successfully!");
      }
    }
  };

  const handleSearchVisibilityChange = (checked: boolean) => {
    setHideSearch(checked);
    localStorage.setItem('hideSearch', checked.toString());
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new Event('hideSearchChange'));
    toast.success(`Search bar ${checked ? 'hidden' : 'visible'} on main site`);
  };

  return (
    <div className="space-y-8">
      <AdvertisementSettings />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Site Settings</h2>
        <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border">
          <Switch
            id="hide-search"
            checked={hideSearch}
            onCheckedChange={handleSearchVisibilityChange}
          />
          <Label htmlFor="hide-search">Hide search bar on main site</Label>
        </div>
      </div>

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
      </div>

      <EditUserDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingUser={editingUser}
        onUserChange={setEditingUser}
        onSave={handleSaveEdit}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Pending Domains</h2>
        {pendingDomains.length === 0 ? (
          <p className="text-gray-500">No pending domains to review</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onApprove={handleApprove}
                onReject={handleReject}
                isPending={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Active Listings</h2>
        {activeDomains.length === 0 ? (
          <p className="text-gray-500">No active listings</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onFeature={handleFeature}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};