import { useEffect } from 'react';

const usePageTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = 'Obayi - Educate, Empower, Transform';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default usePageTitle;