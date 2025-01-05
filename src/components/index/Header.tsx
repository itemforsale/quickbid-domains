import { SearchBar } from "@/components/SearchBar";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text animate-pulse hover:scale-105 transition-transform duration-300 cursor-default">
        60dna.com
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Exclusive domains available for auction
      </p>
      <div className="mt-8">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};