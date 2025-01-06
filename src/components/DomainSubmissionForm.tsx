import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { FormHeader } from "./domain-submission/FormHeader";
import { DomainInput } from "./domain-submission/DomainInput";
import { PriceInput } from "./domain-submission/PriceInput";
import { SubmitButton } from "./domain-submission/SubmitButton";

interface DomainSubmissionFormProps {
  onSubmit: (domain: string, price: number) => void;
}

export const DomainSubmissionForm = ({ onSubmit }: DomainSubmissionFormProps) => {
  const [domainName, setDomainName] = useState("");
  const [price, setPrice] = useState("");

  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const number = parseInt(digits);
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setPrice(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    const priceNum = parseFloat(price.replace(/,/g, ''));

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const traditionalDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    const web3DomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.(eth|crypto|nft|blockchain|dao|x|888|wallet|bitcoin|coin|zil|luxe)$/;

    if (!traditionalDomainRegex.test(domainName) && !web3DomainRegex.test(domainName)) {
      toast.error("Please enter a valid domain name (traditional or web3)");
      return;
    }

    onSubmit(domainName, priceNum);
    setDomainName("");
    setPrice("");
    toast.success("Domain submitted for listing!");
  };

  return (
    <Card className="p-6 mb-8 backdrop-blur-sm bg-gradient-to-br from-white/50 to-white/30 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormHeader 
          title="List Your Domain" 
          subtitle="List traditional (.com, .net, etc.) or web3 domains (.eth, .crypto, etc.)" 
        />
        <div className="space-y-3">
          <DomainInput 
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
          <PriceInput
            value={price}
            onChange={handlePriceChange}
            placeholder="Price"
            icon={DollarSign}
          />
          <SubmitButton />
        </div>
      </form>
    </Card>
  );
};