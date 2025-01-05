import { SearchBar } from "@/components/SearchBar";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Premium Domains
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