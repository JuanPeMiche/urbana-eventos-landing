// Import all gallery assets for mapping
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import eventWedding from '@/assets/event-wedding.jpg';
import eventCorporate from '@/assets/event-corporate.jpg';
import eventBirthday from '@/assets/event-birthday.jpg';
import eventInfantiles from '@/assets/event-infantiles.jpg';

// Map asset paths to imported images
export const assetMap: Record<string, string> = {
  '/src/assets/gallery-1.jpg': gallery1,
  '/src/assets/gallery-2.jpg': gallery2,
  '/src/assets/gallery-3.jpg': gallery3,
  '/src/assets/gallery-4.jpg': gallery4,
  '/src/assets/gallery-5.jpg': gallery5,
  '/src/assets/gallery-6.jpg': gallery6,
  '/src/assets/event-wedding.jpg': eventWedding,
  '/src/assets/event-corporate.jpg': eventCorporate,
  '/src/assets/event-birthday.jpg': eventBirthday,
  '/src/assets/event-infantiles.jpg': eventInfantiles,
};

/**
 * Resolves an image URL - if it's a local asset path, returns the imported version
 * Otherwise returns the URL as-is (for Supabase storage URLs)
 */
export const resolveImageUrl = (url: string): string => {
  if (assetMap[url]) {
    return assetMap[url];
  }
  return url;
};

/**
 * Checks if the image URL is from local assets
 */
export const isLocalAsset = (url: string): boolean => {
  return url.startsWith('/src/assets/');
};