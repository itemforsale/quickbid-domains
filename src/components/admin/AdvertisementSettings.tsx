import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdContent {
  title: string;
  description: string;
  link: string;
  type: 'text' | 'banner';
  imageUrl?: string;
}

export const AdvertisementSettings = () => {
  const [showAd, setShowAd] = useState(() => {
    const saved = localStorage.getItem('showAd');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [adContent, setAdContent] = useState<AdContent>(() => {
    const saved = localStorage.getItem('adContent');
    return saved ? JSON.parse(saved) : {
      title: '',
      description: '',
      link: '',
      type: 'text',
      imageUrl: ''
    };
  });

  const handleAdToggle = (checked: boolean) => {
    setShowAd(checked);
    toast.success(`Advertisement ${checked ? 'enabled' : 'disabled'}`);
    localStorage.setItem('showAd', JSON.stringify(checked));
  };

  const handleAdContentChange = (field: keyof AdContent, value: string) => {
    setAdContent(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('adContent', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Advertisement Settings</h2>
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-ad">Enable Advertisement</Label>
          <Switch
            id="show-ad"
            checked={showAd}
            onCheckedChange={handleAdToggle}
          />
        </div>
        
        {showAd && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ad-type">Advertisement Type</Label>
              <Select
                value={adContent.type}
                onValueChange={(value: 'text' | 'banner') => handleAdContentChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Advertisement</SelectItem>
                  <SelectItem value="banner">Banner Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-title">Advertisement Title</Label>
              <Input
                id="ad-title"
                value={adContent.title}
                onChange={(e) => handleAdContentChange('title', e.target.value)}
                placeholder="Enter advertisement title"
              />
            </div>
            
            {adContent.type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor="ad-description">Advertisement Description</Label>
                <Input
                  id="ad-description"
                  value={adContent.description}
                  onChange={(e) => handleAdContentChange('description', e.target.value)}
                  placeholder="Enter advertisement description"
                />
              </div>
            )}

            {adContent.type === 'banner' && (
              <div className="space-y-2">
                <Label htmlFor="ad-image">Banner Image URL</Label>
                <Input
                  id="ad-image"
                  value={adContent.imageUrl}
                  onChange={(e) => handleAdContentChange('imageUrl', e.target.value)}
                  placeholder="Enter banner image URL"
                  type="url"
                />
                {adContent.imageUrl && (
                  <img 
                    src={adContent.imageUrl} 
                    alt="Ad banner preview" 
                    className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                  />
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="ad-link">Advertisement Link</Label>
              <Input
                id="ad-link"
                value={adContent.link}
                onChange={(e) => handleAdContentChange('link', e.target.value)}
                placeholder="Enter advertisement link"
                type="url"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};