import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Globe, DollarSign, Rocket, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DomainSubmissionFormProps {
  onSubmit: (domain: string, startingPrice: number, buyNowPrice: number | null, durationDays: number) => void;
}

export const DomainSubmissionForm = ({ onSubmit }: DomainSubmissionFormProps) => {
  const [domainName, setDomainName] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [durationDays, setDurationDays] = useState("7");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    const startingPriceNum = parseFloat(startingPrice);
    const buyNowPriceNum = buyNowPrice ? parseFloat(buyNowPrice) : null;
    const durationDaysNum = parseInt(durationDays);

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

    onSubmit(domainName, startingPriceNum, buyNowPriceNum, durationDaysNum);
    setDomainName("");
    setStartingPrice("");
    setBuyNowPrice("");
    setDurationDays("7");
    toast.success("Domain submitted for auction!");
  };

  return (
    <Card className="p-6 mb-8 backdrop-blur-sm bg-gradient-to-br from-white/50 to-white/30 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">List Your Domain</h3>
          <p className="text-sm text-gray-600">
            Start your auction in minutes
          </p>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="yourdomain.com"
              className="pl-10"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="Starting price"
              min="0"
              step="0.01"
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Rocket className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="number"
              value={buyNowPrice}
              onChange={(e) => setBuyNowPrice(e.target.value)}
              placeholder="Buy now price (optional)"
              min="0"
              step="0.01"
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Select value={durationDays} onValueChange={setDurationDays}>
              <SelectTrigger className="w-full pl-10">
                <SelectValue placeholder="Select auction duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="21">21 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
            Submit Domain
          </Button>
        </div>
      </form>
    </Card>
  );
};