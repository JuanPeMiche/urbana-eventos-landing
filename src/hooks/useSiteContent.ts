import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteContent {
  [key: string]: string;
}

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('id, content');

    if (error) {
      console.error('Error fetching site content:', error);
    } else if (data) {
      const contentMap: SiteContent = {};
      data.forEach((item) => {
        contentMap[item.id] = item.content;
      });
      setContent(contentMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (id: string, newContent: string) => {
    const { error } = await supabase
      .from('site_content')
      .upsert({ id, content: newContent, updated_at: new Date().toISOString() });

    if (error) {
      throw error;
    }
    
    setContent(prev => ({ ...prev, [id]: newContent }));
  };

  const get = (key: string, fallback: string = '') => {
    return content[key] || fallback;
  };

  return { content, loading, updateContent, get, refetch: fetchContent };
};
