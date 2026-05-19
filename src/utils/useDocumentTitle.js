import { useEffect } from 'react';

/**
 * Hook for updating the document title (browser tab title).
 * @param {string} title - The specific page name.
 */
const useDocumentTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'TrustDocs';
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [title]);
};

export default useDocumentTitle;