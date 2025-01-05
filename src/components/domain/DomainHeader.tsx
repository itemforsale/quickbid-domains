import { Star, Sparkles } from "lucide-react";

interface DomainHeaderProps {
  domain: string;
  isNew: boolean;
  featured: boolean;
  isEnded: boolean;
  listedBy: string;
}

export const DomainHeader = ({ domain, isNew, featured, isEnded, listedBy }: DomainHeaderProps) => {
  return (
    <div>
      <div className="flex gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          isEnded 
            ? 'bg-gray-100 text-gray-600'
            : 'bg-primary/10 text-primary animate-pulse'
        }`}>
          {isEnded ? 'Ended' : 'Active'}
        </span>
        {featured && (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-500" />
            Featured
          </span>
        )}
        {isNew && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            NEW
          </span>
        )}
      </div>
      <h3 className="mt-2 text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
        {domain}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Auction by <span className="font-medium text-gray-700">{listedBy}</span>
      </p>
    </div>
  );
};