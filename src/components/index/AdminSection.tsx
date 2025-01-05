import { QueryClient } from "@tanstack/react-query";
import { AdminPanel } from "@/components/AdminPanel";
import { PendingDomains } from "@/components/PendingDomains";
import { Domain } from "@/types/domain";
import { broadcastManager } from "@/utils/broadcastManager";

interface AdminSectionProps {
  pendingDomains: Domain[];
  activeDomains: Domain[];
  queryClient: QueryClient;
}

export const AdminSection = ({ 
  pendingDomains, 
  activeDomains, 
  queryClient 
}: AdminSectionProps) => {
  const handleDeleteListing = (domainId: number) => {
    const currentDomains = queryClient.getQueryData<Domain[]>(['domains']) || [];
    const updatedDomains = currentDomains.filter((domain) => domain.id !== domainId);
    queryClient.setQueryData(['domains'], updatedDomains);
    broadcastManager.broadcast('domains_updated', updatedDomains);
  };

  const handleFeatureDomain = (domainId: number) => {
    const currentDomains = queryClient.getQueryData<Domain[]>(['domains']) || [];
    const updatedDomains = currentDomains.map((domain) =>
      domain.id === domainId
        ? { ...domain, featured: !domain.featured }
        : domain
    );
    queryClient.setQueryData(['domains'], updatedDomains);
    broadcastManager.broadcast('domains_updated', updatedDomains);
  };

  return (
    <>
      <AdminPanel
        pendingDomains={pendingDomains}
        activeDomains={activeDomains}
        onApproveDomain={(id) => {
          const currentDomains = queryClient.getQueryData<Domain[]>(['domains']) || [];
          const updatedDomains = currentDomains.map(domain =>
            domain.id === id ? { ...domain, status: 'active' } : domain
          );
          queryClient.setQueryData(['domains'], updatedDomains);
          broadcastManager.broadcast('domains_updated', updatedDomains);
        }}
        onRejectDomain={(id) => {
          const currentDomains = queryClient.getQueryData<Domain[]>(['domains']) || [];
          const updatedDomains = currentDomains.filter(domain => domain.id !== id);
          queryClient.setQueryData(['domains'], updatedDomains);
          broadcastManager.broadcast('domains_updated', updatedDomains);
        }}
        onDeleteListing={handleDeleteListing}
        onFeatureDomain={handleFeatureDomain}
      />
      <PendingDomains domains={pendingDomains} />
    </>
  );
};