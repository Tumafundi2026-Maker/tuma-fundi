import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

const DEFAULT_IMAGE = "https://storage.googleapis.com/dala-prod-public-storage/attachments/ab1da22d-5cd6-4d1d-8bd6-481183c231d1/1779863487840_Tuma_Fundi_LOgo_new.jpeg";

export const MetaTags: React.FC<SEOProps> = ({ title, description, image, canonical }) => {
  React.useEffect(() => {
    // Standard tags
    document.title = `${title} | Tuma Fundi Kenya`;
    
    const updateMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    updateMetaTag('description', description);
    
    // Open Graph
    updateMetaTag('og:title', `${title} | Tuma Fundi`, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image || DEFAULT_IMAGE, 'property');
    
    // Twitter
    updateMetaTag('twitter:title', `${title} | Tuma Fundi`, 'property');
    updateMetaTag('twitter:description', description, 'property');
    updateMetaTag('twitter:image', image || DEFAULT_IMAGE, 'property');

  }, [title, description, image]);

  return null;
};