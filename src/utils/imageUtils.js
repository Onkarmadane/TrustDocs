
export const getResolvedImageUrl = (img) => {
    if (!img) return null;
    
    if (img instanceof File || img instanceof Blob) {
        return URL.createObjectURL(img);
    }
    
    if (typeof img === 'string') {
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:')) {
            return img;
        }
        
        const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
        const cleanImg = img.startsWith('/') ? img.substring(1) : img;
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        
        return `${cleanBase}/${cleanImg}`;
    }
    
    return null;
};
