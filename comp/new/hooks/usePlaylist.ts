import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '@/services/playlistService';

export const usePlaylist = (userId: string | null) => {
  return useQuery({
    queryKey: ['playlist', userId],
    queryFn: () => playlistService.getPlaylist(userId!),
    enabled: !!userId,
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistService.createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist'] });
    },
  });
};
