import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '@/services/playlistService';

export const playlistKeys = {
  all: ['playlists'] as const,
  detail: (userId: string) => [...playlistKeys.all, userId] as const,
};

export const usePlaylist = (userId: string) => {
  return useQuery({
    queryKey: playlistKeys.detail(userId), //['playlist', userId],
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
