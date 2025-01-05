import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface Domain {
  id: number;
  name: string;
  finalPrice: number;
  purchaseDate: Date;
}

interface UserProfileProps {
  username: string;
  wonDomains: Domain[];
}

export const UserProfile = ({ username, wonDomains }: UserProfileProps) => {
  const { users } = useUser();
  
  // Find user's X.com username if available
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
            {wonDomains.map((domain) => (
              <div
                key={domain.id}
                className="p-3 bg-white/80 rounded-lg border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{domain.name}</span>
                  <span className="text-green-600">${domain.finalPrice}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Won on {domain.purchaseDate.toLocaleDateString()}
                  </p>
                  {xUsername ? (
                    <a
                      href={`https://x.com/${xUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      @{xUsername} <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">
                      @{username}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};