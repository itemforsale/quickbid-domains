import { Domain } from "@/types/domain";
import { AdvertisementSettings } from "./admin/AdvertisementSettings";
import { FeaturedDomainsSection } from "./admin/FeaturedDomainsSection";
import { SiteSettingsSection } from "./admin/SiteSettingsSection";
import { UserManagementSection } from "./admin/UserManagementSection";
import { DomainListingsSection } from "./admin/DomainListingsSection";
import { useUser } from "@/contexts/UserContext";

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
  const { users, updateUser } = useUser();

  return (
    <div className="space-y-8">
      <AdvertisementSettings />
      
      <FeaturedDomainsSection onFeatureDomain={onFeatureDomain!} />
      
      <SiteSettingsSection />
      
      <UserManagementSection 
        users={users} 
        onUpdateUser={updateUser}
      />

      <DomainListingsSection
        pendingDomains={pendingDomains}
        activeDomains={activeDomains}
        onApproveDomain={onApproveDomain}
        onRejectDomain={onRejectDomain}
        onDeleteListing={onDeleteListing}
        onFeatureDomain={onFeatureDomain}
      />
    </div>
  );
};