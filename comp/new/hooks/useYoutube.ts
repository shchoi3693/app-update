import { useQuery } from '@tanstack/react-query';

export const useYoutubeVideo = (query: string) => {
  return useQuery({
    queryKey: ['youtube', query],
    queryFn: async () => {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('useYoutube error');
      return res.json();
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 60,
  });
};
