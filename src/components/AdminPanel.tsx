import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Star, User, Edit } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

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
  const { users, deleteUser } = useUser();

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

  const handleEditUser = (username: string) => {
    // For now just show a toast, we can implement the edit functionality later
    toast.info("Edit user functionality coming soon!");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Admin Panel - User Management</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => (
            <Card key={user.username} className="p-4 bg-background border-border">
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
                      onClick={() => handleEditUser(user.username)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user.username)}
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
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Admin Panel - Pending Domains</h2>
        {pendingDomains.length === 0 ? (
          <p className="text-gray-500">No pending domains to review</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingDomains.map((domain) => (
              <Card key={domain.id} className="p-4 backdrop-blur-sm bg-white/50">
                <div className="space-y-2">
                  <h3 className="font-medium">{domain.name}</h3>
                  <p className="text-sm text-gray-600">Starting Price: ${domain.currentBid}</p>
                  {domain.buyNowPrice && (
                    <p className="text-sm text-gray-600">Buy Now Price: ${domain.buyNowPrice}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleApprove(domain.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(domain.id)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Admin Panel - Active Listings</h2>
        {activeDomains.length === 0 ? (
          <p className="text-gray-500">No active listings</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeDomains.map((domain) => (
              <Card key={domain.id} className="p-4 backdrop-blur-sm bg-white/50">
                <div className="space-y-2">
                  <h3 className="font-medium">{domain.name}</h3>
                  <p className="text-sm text-gray-600">Current Bid: ${domain.currentBid}</p>
                  {domain.buyNowPrice && (
                    <p className="text-sm text-gray-600">Buy Now Price: ${domain.buyNowPrice}</p>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={() => handleFeature(domain.id)}
                      variant="outline"
                      size="sm"
                      className={domain.featured ? "bg-yellow-100 text-yellow-700" : ""}
                    >
                      <Star className={`h-4 w-4 mr-2 ${domain.featured ? "fill-yellow-500" : ""}`} />
                      {domain.featured ? "Featured" : "Feature"}
                    </Button>
                    <Button
                      onClick={() => handleDelete(domain.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Listing
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};