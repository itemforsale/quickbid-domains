import { useEffect, useState } from "react";

interface AdContent {
  title: string;
  description: string;
  link: string;
  type: 'text' | 'banner';
  imageUrl?: string;
}

export const Advertisement = () => {
  const [showAd, setShowAd] = useState(false);
  const [adContent, setAdContent] = useState<AdContent | null>(null);

  useEffect(() => {
    const isEnabled = localStorage.getItem('showAd');
    const content = localStorage.getItem('adContent');
    
    if (isEnabled && content) {
      setShowAd(JSON.parse(isEnabled));
      setAdContent(JSON.parse(content));
    }
  }, []);

  if (!showAd || !adContent) return null;

  return (
    <a
      href={adContent.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-2xl mx-auto mb-8 hover:opacity-90 transition-opacity"
    >
      {adContent.type === 'banner' && adContent.imageUrl ? (
        <img
          src={adContent.imageUrl}
          alt={adContent.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      ) : (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">{adContent.title}</h3>
          {adContent.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{adContent.description}</p>
          )}
        </div>
      )}
    </a>
  );
};