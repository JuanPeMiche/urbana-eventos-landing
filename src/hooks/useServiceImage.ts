import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useServiceImage = (category: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('category', category)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(1)
        .single();

      if (!error && data) {
        setImageUrl(data.image_url);
      }
      setIsLoading(false);
    };

    fetchImage();
  }, [category]);

  return { imageUrl, isLoading };
};
