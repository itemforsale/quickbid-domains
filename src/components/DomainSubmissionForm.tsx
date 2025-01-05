import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface DomainSubmissionFormProps {
  onSubmit: (domain: string) => void;
}

export const DomainSubmissionForm = ({ onSubmit }: DomainSubmissionFormProps) => {
  const [domainName, setDomainName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    // Basic domain name validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainName)) {
      toast.error("Please enter a valid domain name");
      return;
    }

    onSubmit(domainName);
    setDomainName("");
    toast.success("Domain submitted for auction!");
  };

  return (
    <Card className="p-6 mb-8 backdrop-blur-sm bg-white/50 border border-gray-200 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Submit a Domain for Auction</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter the domain name you'd like to put up for auction
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            placeholder="e.g., example.com"
            className="flex-1"
          />
          <Button type="submit">
            Submit Domain
          </Button>
        </div>
      </form>
    </Card>
  );
};