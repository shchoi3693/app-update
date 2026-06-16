import { trackService } from '@/services/trackService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Itunes } from '@/types/itunes';
import { Vibrant } from 'node-vibrant/browser';

export const useMainPlaylistTracks = () => {
  return useQuery({
    queryKey: ['main_playlist', 'tracks'],
    queryFn: () => trackService.getMainPlaylistTracks(),
  });
};

export const usePlaylistTrack = ({
  user_id,
  playlist_id,
}: {
  user_id: string | null;
  playlist_id: string | null;
}) => {
  return useQuery({
    queryKey: ['playlist', user_id, playlist_id, 'track'],
    queryFn: () => trackService.getPlaylistTracks({ user_id: user_id!, playlist_id: playlist_id! }),
    enabled: !!user_id && !!playlist_id, // ID가 있을 때만 실행
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
          youtube_video_id: ytbId,
        },
      });
    },

    onError: (error: any) => {
      if (error.code === '23505') {
        console.log('id unique toast');
      }
    },

    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['playlist', data.user_id, data.playlist_id, 'track'],
      });

      // queryClient.invalidateQueries({
      //   queryKey: ['playlist'],
      // });
    },
  });
};
