import { SearchBar } from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="text-center mb-8 sm:mb-12 px-4 animate-fade-in">
      <div className="fixed left-2 sm:left-4 top-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-black hover:bg-black/90 text-white border-none text-xs sm:text-sm"
          onClick={() => window.open('https://x.com/samcharles', '_blank')}
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
          Join our community
        </Button>
      </div>
      <DarkModeToggle />
      <div className="space-y-4 mt-12 sm:mt-16">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text hover:scale-105 transition-transform duration-300 cursor-default">
          <span className="font-mono">{count}</span>dna.com
        </h2>
      </div>
      <p className="text-base sm:text-lg text-foreground mb-6 sm:mb-8 px-4">
        Trade directly with others using your X.com username
      </p>
      <div className="mt-6 sm:mt-8 px-2">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};