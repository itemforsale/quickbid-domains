import { Card } from "@/components/ui/card";

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
                <p className="text-sm text-gray-500">
                  Won on {domain.purchaseDate.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};