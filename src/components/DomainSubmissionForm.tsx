import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface DomainSubmissionFormProps {
  onSubmit: (domain: string, startingPrice: number, buyNowPrice: number | null) => void;
}

export const DomainSubmissionForm = ({ onSubmit }: DomainSubmissionFormProps) => {
  const [domainName, setDomainName] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    const startingPriceNum = parseFloat(startingPrice);
    const buyNowPriceNum = buyNowPrice ? parseFloat(buyNowPrice) : null;

    if (isNaN(startingPriceNum) || startingPriceNum <= 0) {
      toast.error("Please enter a valid starting price");
      return;
    }

    if (buyNowPrice && (isNaN(buyNowPriceNum!) || buyNowPriceNum! <= startingPriceNum)) {
      toast.error("Buy now price must be higher than starting price");
      return;
    }

    // Basic domain name validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainName)) {
      toast.error("Please enter a valid domain name");
      return;
    }

    onSubmit(domainName, startingPriceNum, buyNowPriceNum);
    setDomainName("");
    setStartingPrice("");
    setBuyNowPrice("");
    toast.success("Domain submitted for auction!");
  };

  return (
    <Card className="p-6 mb-8 backdrop-blur-sm bg-white/50 border border-gray-200 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Submit a Domain for Auction</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter the domain details for auction
          </p>
        </div>
        <div className="space-y-3">
          <Input
            type="text"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            placeholder="Domain name (e.g., example.com)"
          />
          <Input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="Starting price ($)"
            min="0"
            step="0.01"
          />
          <Input
            type="number"
            value={buyNowPrice}
            onChange={(e) => setBuyNowPrice(e.target.value)}
            placeholder="Buy now price (optional)"
            min="0"
            step="0.01"
          />
          <Button type="submit" className="w-full">
            Submit Domain
          </Button>
        </div>
      </form>
    </Card>
  );
};