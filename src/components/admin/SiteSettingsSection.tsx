import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const SiteSettingsSection = () => {
  const [hideSearch, setHideSearch] = useState(() => {
    return localStorage.getItem('hideSearch') === 'true';
  });

  const handleSearchVisibilityChange = (checked: boolean) => {
    setHideSearch(checked);
    localStorage.setItem('hideSearch', checked.toString());
    window.dispatchEvent(new Event('hideSearchChange'));
    toast.success(`Search bar ${checked ? 'hidden' : 'visible'} on main site`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Site Settings</h2>
      <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border">
        <Switch
          id="hide-search"
          checked={hideSearch}
          onCheckedChange={handleSearchVisibilityChange}
        />
        <Label htmlFor="hide-search">Hide search bar on main site</Label>
      </div>
    </div>
  );
};