import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const AboutBioBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full bg-background border rounded-lg p-4 mb-8 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">About 60DNA.com</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-4 space-y-4">
        <p className="text-lg leading-relaxed">
          Welcome to 60DNA.com—the ultimate, streamlined platform for trading domain names in just 60 minutes! 🚀
        </p>
        <p className="text-muted-foreground">
          At 60DNA, we make domain trading fast, fun, and hassle-free. Here's how:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <span className="font-semibold text-foreground">Peer-to-Peer Simplicity:</span>{" "}
            Trade directly with others using your X.com username—no emails or complex marketplaces required.
          </li>
          <li>
            <span className="font-semibold text-foreground">Quick Auctions:</span>{" "}
            Every trade lasts just 60 minutes, keeping the process efficient and exciting.
          </li>
          <li>
            <span className="font-semibold text-foreground">Seamless Connections:</span>{" "}
            When you win, you'll connect with the seller instantly via their X.com username to finalize the deal.
          </li>
          <li>
            <span className="font-semibold text-foreground">Fair Trading Fun:</span>{" "}
            Focus on trading at realistic, market-friendly prices to keep the experience enjoyable for everyone.
          </li>
        </ul>
        <p className="text-muted-foreground mt-4">
          Skip the red tape, embrace the thrill, and discover a fresh way to buy and sell domains with 60DNA.com. Let the fun begin! 🕒 🌐
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};