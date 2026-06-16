import { useQuery } from '@tanstack/react-query';

export const useSearchTracks = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await fetch(`/api/itunes?term=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search error');
      return res.json();
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 10,
  });
};
