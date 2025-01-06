import { Card } from "@/components/ui/card";
import { ExternalLink, Mail } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Domain } from "@/types/domain";

interface UserProfileProps {
  username: string;
  wonDomains: Domain[];
}

export const UserProfile = ({ username, wonDomains }: UserProfileProps) => {
  const { users } = useUser();
  
  const userDetails = users.find(u => u.username === username);
  const xUsername = userDetails?.xUsername;

  return (
    <Card className="p-6 mb-8 backdrop-blur-sm bg-white/50 border border-gray-200 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Profile: @{username}</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Won Auctions</h3>
        {wonDomains.length === 0 ? (
          <p className="text-gray-500">No domains won yet</p>
        ) : (
          <div className="grid gap-3">
            {wonDomains.map((domain) => {
              const sellerDetails = users.find(u => u.username === domain.listedBy);
              const sellerXUsername = sellerDetails?.xUsername;

              return (
                <div
                  key={domain.id}
                  className="p-3 bg-white/80 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{domain.name}</span>
                    <span className="text-green-600">
                      ${domain.finalPrice || domain.currentBid}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Won on {domain.purchaseDate?.toLocaleDateString() || 'Pending'}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                    <p className="text-sm text-gray-600">
                      Listed by:{" "}
                      {sellerXUsername ? (
                        <a
                          href={`https://x.com/${sellerXUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          @{sellerXUsername} <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span>@{domain.listedBy}</span>
                      )}
                    </p>
                    {sellerDetails?.email && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <a
                          href={`mailto:${sellerDetails.email}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {sellerDetails.email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};