import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { DollarSign, Rocket } from "lucide-react";
import { FormHeader } from "./domain-submission/FormHeader";
import { DomainInput } from "./domain-submission/DomainInput";
import { PriceInput } from "./domain-submission/PriceInput";
import { SubmitButton } from "./domain-submission/SubmitButton";

interface DomainSubmissionFormProps {
  onSubmit: (domain: string, startingPrice: number, buyNowPrice: number | null) => void;
}

export const DomainSubmissionForm = ({ onSubmit }: DomainSubmissionFormProps) => {
  const [domainName, setDomainName] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");

  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const number = parseInt(digits);
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US');
  };

  const handleStartingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setStartingPrice(formatted);
  };

  const handleBuyNowPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setBuyNowPrice(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    const startingPriceNum = parseFloat(startingPrice.replace(/,/g, ''));
    const buyNowPriceNum = buyNowPrice ? parseFloat(buyNowPrice.replace(/,/g, '')) : null;

    if (isNaN(startingPriceNum) || startingPriceNum <= 0) {
      toast.error("Please enter a valid starting price");
      return;
    }

    if (buyNowPrice && (isNaN(buyNowPriceNum!) || buyNowPriceNum! <= startingPriceNum)) {
      toast.error("Buy now price must be higher than starting price");
      return;
    }

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
    <Card className="p-6 mb-8 backdrop-blur-sm bg-gradient-to-br from-white/50 to-white/30 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormHeader 
          title="List Your Domain" 
          subtitle="Start your auction in minutes" 
        />
        <div className="space-y-3">
          <DomainInput 
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
          <PriceInput
            value={startingPrice}
            onChange={handleStartingPriceChange}
            placeholder="Starting price"
            icon={DollarSign}
          />
          <PriceInput
            value={buyNowPrice}
            onChange={handleBuyNowPriceChange}
            placeholder="Buy now price (optional)"
            icon={Rocket}
          />
          <SubmitButton />
        </div>
      </form>
    </Card>
  );
};