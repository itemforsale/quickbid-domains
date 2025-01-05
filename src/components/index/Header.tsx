import { SearchBar } from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
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

  return (
    <div className="text-center mb-12 animate-fade-in">
      <DarkModeToggle />
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text hover:scale-105 transition-transform duration-300 cursor-default">
        <span className="font-mono">{count}</span>dna.com
      </h1>
      <p className="text-lg text-foreground mb-8">
        Only 60 minutes left to bid on a domain name
      </p>
      <div className="mt-8">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};
