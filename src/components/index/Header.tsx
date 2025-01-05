import { SearchBar } from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const { user } = useUser();
  const [count, setCount] = useState(60);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAnimationComplete) return;

    const timer = setTimeout(() => {
      if (isCountingDown) {
        if (count > 0) {
          setCount(count - 1);
        } else {
          setIsCountingDown(false);
        }
      } else {
        if (count < 60) {
          setCount(count + 1);
        } else {
          setIsAnimationComplete(true);
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [count, isCountingDown, isAnimationComplete]);

  const handleDomainSubmit = (domain: string, startingPrice: number, buyNowPrice: number | null) => {
    toast.success("Domain submitted successfully!");
  };

  return (
    <div className="text-center mb-12 animate-fade-in relative">
      <DarkModeToggle />
      <div className="space-y-4 mt-16">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text hover:scale-105 transition-transform duration-300 cursor-default">
          <span className="font-mono">{count}</span>dna.com
        </h2>
      </div>
      <p className="text-lg text-foreground mb-8">
        Peer-to-Peer Simplicity: Trade directly with others using your X.com username
      </p>
      <div className="mt-8">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};