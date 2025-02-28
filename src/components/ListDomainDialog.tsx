import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DomainSubmissionForm } from "@/components/DomainSubmissionForm";
import { useState } from "react";

interface ListDomainDialogProps {
  onDomainSubmit: (domain: string, startingPrice: number, buyNowPrice: number | null) => void;
}

export const ListDomainDialog = ({ onDomainSubmit }: ListDomainDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (domain: string, startingPrice: number, buyNowPrice: number | null) => {
    onDomainSubmit(domain, startingPrice, buyNowPrice);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          List Domain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DomainSubmissionForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};