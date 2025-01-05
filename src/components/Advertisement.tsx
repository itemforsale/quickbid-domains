import { useEffect, useState } from "react";

interface AdContent {
  title: string;
  description: string;
  link: string;
  type: 'text' | 'banner';
  imageUrl?: string;
}

export const Advertisement = () => {
  const [showAd, setShowAd] = useState<boolean>(false);
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
    <div className="w-full max-w-2xl mx-auto mb-8">
      <a
        href={adContent.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-90 transition-opacity"
      >
        {adContent.type === 'banner' && adContent.imageUrl ? (
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]">
            <img
              src={adContent.imageUrl}
              alt={adContent.title}
              className="w-full h-full object-contain rounded-lg shadow-md"
            />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">{adContent.title}</h3>
            {adContent.description && (
              <p className="text-base text-gray-600 dark:text-gray-300">{adContent.description}</p>
            )}
          </div>
        )}
      </a>
    </div>
  );
};