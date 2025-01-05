import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Domain } from "@/types/domain";

interface FeaturedDomainsSectionProps {
  onFeatureDomain: (domainId: number) => void;
}

export const FeaturedDomainsSection = ({ onFeatureDomain }: FeaturedDomainsSectionProps) => {
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const [newFeatureDomain, setNewFeatureDomain] = useState({
    name: '',
    buyNowPrice: ''
  });

  const handleAddFeatureDomain = () => {
    if (!newFeatureDomain.name || !newFeatureDomain.buyNowPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    const price = parseFloat(newFeatureDomain.buyNowPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const newDomain = {
      id: Date.now(),
      name: newFeatureDomain.name,
      currentBid: price,
      buyNowPrice: price,
      status: 'featured' as const,
      featured: true,
      isFixedPrice: true
    };

    onFeatureDomain(newDomain.id);
    setIsFeatureDialogOpen(false);
    setNewFeatureDomain({ name: '', buyNowPrice: '' });
    toast.success("Featured domain added successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Featured Domains</h2>
        <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Featured Domain</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Featured Domain</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain-name">Domain Name</Label>
                <Input
                  id="domain-name"
                  value={newFeatureDomain.name}
                  onChange={(e) => setNewFeatureDomain(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="example.com"
                />
              </div>
              <div>
                <Label htmlFor="buy-now-price">Buy Now Price ($)</Label>
                <Input
                  id="buy-now-price"
                  value={newFeatureDomain.buyNowPrice}
                  onChange={(e) => setNewFeatureDomain(prev => ({ ...prev, buyNowPrice: e.target.value }))}
                  placeholder="1000"
                  type="number"
                />
              </div>
              <Button onClick={handleAddFeatureDomain}>Add Domain</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};