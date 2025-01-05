import { Badge } from "@/components/ui/badge";

interface DomainHeaderProps {
  domain: string;
  isNew: boolean;
  featured: boolean;
  isEnded: boolean;
  listedBy: string;
}

export const DomainHeader = ({
  domain,
  isNew,
  featured,
  isEnded,
  listedBy,
}: DomainHeaderProps) => {
  // Format domain name to ensure proper display
  const formatDomainName = (name: string) => {
    // Remove any whitespace and ensure lowercase
    const formattedName = name.trim().toLowerCase();
    // Ensure .com suffix is present and properly formatted
    return formattedName.endsWith('.com') ? formattedName : `${formattedName}.com`;
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex items-start justify-between gap-4">
        <h3 className={`text-lg font-semibold text-left break-all ${isEnded ? 'opacity-75' : ''}`}>
          {formatDomainName(domain)}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          {isNew && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              New
            </Badge>
          )}
          {featured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Featured
            </Badge>
          )}
          {isEnded && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              Ended
            </Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 text-left">Listed by {listedBy}</p>
    </div>
  );
};