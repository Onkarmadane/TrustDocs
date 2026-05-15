/**
 * Resolves an image source into a valid URL for the <img> tag.
 * Handles:
 * 1. Absolute URLs (http/https/data/blob)
 * 2. File/Blob objects (creates an object URL)
 * 3. Relative backend paths (prefixes with VITE_BACKEND_URL)
 * 
 * @param {string|File|Blob} img - The image source to resolve
 * @returns {string|null} - The resolved URL or null
 */
export const getResolvedImageUrl = (img) => {
    if (!img) return null;
    
    // Case 1: File or Blob object (from upload)
    if (img instanceof File || img instanceof Blob) {
        return URL.createObjectURL(img);
    }
    
    // Case 2: String path
    if (typeof img === 'string') {
        // If it's already an absolute URL or base64, return as-is
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:')) {
            return img;
        }
        
        // If it's a relative path, prefix with backend URL
        const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
        const cleanImg = img.startsWith('/') ? img.substring(1) : img;
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        
        return `${cleanBase}/${cleanImg}`;
    }
    
    return null;
};
