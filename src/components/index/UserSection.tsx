import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Domain } from "@/types/domain";
import type { User } from "@/contexts/UserContext";

interface UserSectionProps {
  user: User | null;
  domains: Domain[];
  wonDomains: {
    id: number;
    name: string;
    finalPrice: number;
    purchaseDate: Date;
  }[];
  onLogout: () => void;
  onDomainSubmit: (domain: string, startingPrice: number, buyNowPrice: number | null, durationDays: number) => void;
}

export const UserSection = ({
  user,
  domains,
  wonDomains,
  onLogout,
  onDomainSubmit,
}: UserSectionProps) => {
  const [domainName, setDomainName] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [durationDays, setDurationDays] = useState("7");

  const handleSubmit = () => {
    const startingPriceNum = parseFloat(startingPrice);
    const buyNowPriceNum = buyNowPrice ? parseFloat(buyNowPrice) : null;
    const durationDaysNum = parseInt(durationDays);

    onDomainSubmit(domainName, startingPriceNum, buyNowPriceNum, durationDaysNum);
    setDomainName("");
    setStartingPrice("");
    setBuyNowPrice("");
    setDurationDays("7");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Welcome, {user?.username}</h2>
      <Button onClick={onLogout}>Logout</Button>
      <div>
        <h3 className="text-md font-semibold">Submit a Domain</h3>
        <input
          type="text"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Domain name"
        />
        <input
          type="number"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          placeholder="Starting price"
        />
        <input
          type="number"
          value={buyNowPrice}
          onChange={(e) => setBuyNowPrice(e.target.value)}
          placeholder="Buy now price (optional)"
        />
        <select value={durationDays} onChange={(e) => setDurationDays(e.target.value)}>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="21">21 days</option>
          <option value="30">30 days</option>
        </select>
        <Button onClick={handleSubmit}>Submit Domain</Button>
      </div>
      <div>
        <h3 className="text-md font-semibold">Your Won Domains</h3>
        {wonDomains.map((domain) => (
          <div key={domain.id}>
            <p>{domain.name} - ${domain.finalPrice} (Purchased on: {domain.purchaseDate.toLocaleDateString()})</p>
          </div>
        ))}
      </div>
    </div>
  );
};