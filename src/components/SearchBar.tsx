import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem('hideSearch') === 'true';
  });

  useEffect(() => {
    const checkSearchVisibility = () => {
      const hideSearch = localStorage.getItem('hideSearch') === 'true';
      setIsHidden(hideSearch);
    };

    // Check initially
    checkSearchVisibility();

    // Create a custom event for same-tab communication
    const handleCustomStorage = () => {
      checkSearchVisibility();
    };

    window.addEventListener('hideSearchChange', handleCustomStorage);
    window.addEventListener('storage', (e) => {
      if (e.key === 'hideSearch') {
        checkSearchVisibility();
      }
    });

    return () => {
      window.removeEventListener('hideSearchChange', handleCustomStorage);
      window.removeEventListener('storage', handleCustomStorage);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Input
        type="text"
        placeholder="Search domains..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-4 pr-10 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Search className="h-5 w-5 text-gray-500" />
      </Button>
    </div>
  );
};