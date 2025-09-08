import { useEffect } from 'react';

const usePageTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = 'Obayi - Educate, Empower, Transform';
    const newTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    
    // Set the document title
    document.title = newTitle;
    
    // Also update meta tags for better SEO
    let titleMeta = document.querySelector('meta[property="og:title"]');
    if (!titleMeta) {
      titleMeta = document.createElement('meta');
      titleMeta.setAttribute('property', 'og:title');
      document.head.appendChild(titleMeta);
    }
    titleMeta.setAttribute('content', newTitle);
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default usePageTitle;