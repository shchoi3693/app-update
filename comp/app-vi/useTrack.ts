import { trackService } from '@/services/trackService';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Itunes } from '@/types/itunes';
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { PlaylistTrack } from '@/types/playlist';

export const trackKeys = {
  all: ['tracks'] as const,
  mainPlaylist: () => [...trackKeys.all, 'main'] as const,
  byPlaylist: (userId: string | null, playlistId: string | null) =>
    [...trackKeys.all, userId, playlistId] as const,
};

export const trackQueries = {
  mainPlaylist: () =>
    queryOptions({
      queryKey: trackKeys.mainPlaylist(), //['main_playlist', 'tracks'],
      queryFn: () => trackService.getMainPlaylistTracks(),
      staleTime: 1000 * 60 * 10,
    }),
};

export const usePlaylistTrack = ({
  userId,
  playlistId,
}: {
  userId: string | null;
  playlistId: string | null;
}) => {
  return useQuery({
    queryKey: trackKeys.byPlaylist(userId, playlistId), //['playlist', user_id, playlist_id, 'track'],
    queryFn: () => trackService.getPlaylistTracks({ userId: userId!, playlistId: playlistId! }),
    enabled: !!userId && !!playlistId, // ID가 있을 때만 실행
  });
};

export const useAddTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, track }: { userId: string; track: Itunes }) => {
      const searchQuery = `${track.trackName} ${track.artistName} official`;

      const [ytbResult, paletteResult] = await Promise.allSettled([
        fetch(`/api/youtube?q=${encodeURIComponent(searchQuery)}`).then(res => {
          if (!res.ok) throw new Error('youtube Api Fetch error');
          return res.json();
        }),
        fetch(`/api/palette?url=${encodeURIComponent(track.artworkUrl100)}`).then(res => {
          if (!res.ok) throw new Error('vibrant Api Fetch error');
          return res.json();
        }),
      ]);
      // console.log(ytbResult, paletteResult);

      const ytbId = ytbResult.status === 'fulfilled' ? ytbResult.value.id?.videoId : undefined;
      const palette = paletteResult.status === 'fulfilled' ? paletteResult.value : null;

      return trackService.addTrackToPlaylist({
        userId,
        newTrack: {
          album_name: track.collectionName,
          artist_name: track.artistName,
          title: track.trackName,
          image_url: track.artworkUrl100,
          palette,
          itunes_id: track.trackId,
          youtube_video_id: ytbId,
        },
      });
    },

    onError: (error: PostgrestError) => {
      if (error.code === '23505') {
        toast.error('이미 추가된 ');
      } else {
        console.log(error);
      }
    },

    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: trackKeys.byPlaylist(data.user_id, data.playlist_id), //['playlist', data.user_id, data.playlist_id, 'track'],
      });

      toast.success('good');

      // queryClient.invalidateQueries({
      //   queryKey: ['playlist'],
      // });
    },
  });
};

export const useRemoveTrackOpt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      playlistId,
      playlistTrackId,
    }: {
      userId: string;
      playlistId: string;
      playlistTrackId: string;
    }) => trackService.removeTrackFromPlaylist({ userId, playlistTrackId }),
    onMutate: async ({ userId, playlistId, playlistTrackId }) => {
      const targetQueryKey = trackKeys.byPlaylist(userId, playlistId);

      await queryClient.cancelQueries({ queryKey: targetQueryKey });
      const previousTracks = queryClient.getQueryData<PlaylistTrack[]>(targetQueryKey);
      queryClient.setQueryData<PlaylistTrack[]>(targetQueryKey, oldTracks =>
        oldTracks ? oldTracks.filter(track => track.id !== playlistTrackId) : [],
      );
      return { previousTracks, targetQueryKey };
    },

    onError: (error: PostgrestError, variables, context) => {
      console.error(error);
      if (context?.previousTracks) {
        queryClient.setQueryData(context.targetQueryKey, context.previousTracks);
      }
      toast.error('삭제에 실패했습니다.');
    },
    onSuccess: () => {
      toast.success('delete');
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: trackKeys.byPlaylist(variables.userId, variables.playlistTrackId),
      });
    },
  });
};
