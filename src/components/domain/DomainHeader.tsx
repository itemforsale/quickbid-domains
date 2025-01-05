import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const formatDomainName = (name: string) => {
    const formattedName = name.trim().toLowerCase();
    return formattedName.endsWith('.com') ? formattedName : `${formattedName}.com`;
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex items-start justify-between gap-4">
        <h3 className={cn(
          "text-lg font-semibold text-left break-all max-w-[70%]",
          isEnded ? "text-gray-500" : "text-gray-900",
          "line-clamp-2"
        )}>
          {formatDomainName(domain)}
        </h3>
        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
          {isNew && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 whitespace-nowrap">
              New
            </Badge>
          )}
          {featured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 whitespace-nowrap">
              Featured
            </Badge>
          )}
          {isEnded && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 whitespace-nowrap">
              Ended
            </Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 text-left">{`Listed by ${listedBy}`}</p>
    </div>
  );
};