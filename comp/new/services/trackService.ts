import { createClient } from '@/lib/supabase/client';
import { MainPlaylistTrack, PlaylistTrack } from '@/types/playlist';
import { playlistService } from './playlistService';

const supabase = createClient();

export const trackService = {
  async addTrackToPlaylist({
    userId,
    newTrack,
  }: {
    userId: string;
    newTrack: Omit<PlaylistTrack, 'id' | 'user_id' | 'playlist_id' | 'added_at'>;
  }): Promise<PlaylistTrack> {
    const { data: playlist, error: pError } = await supabase
      .from('playlists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (pError) throw new Error(pError.message);

    let targetPlaylistId: string;
    if (!playlist) {
      const newInitPlaylist = await playlistService.createPlaylist({
        userId,
        title: 'NEW Play',
      });
      targetPlaylistId = newInitPlaylist.id;
    } else {
      targetPlaylistId = playlist.id;
    }

    const { data, error } = await supabase
      .from('playlist_tracks')
      .insert([{ ...newTrack, user_id: userId, playlist_id: targetPlaylistId }])
      .select('*, playlists(*)')
      .single();
    if (error) throw error;

    return data as PlaylistTrack;
  },

  async getPlaylistTracks({
    user_id,
    playlist_id,
  }: {
    user_id: string;
    playlist_id: string;
  }): Promise<PlaylistTrack[]> {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('*, playlists!inner(user_id)')
      .eq('playlist_id', playlist_id)
      .eq('user_id', user_id)
      .order('added_at', { ascending: true });

    if (error) throw error;

    return data as PlaylistTrack[];
  },

  async getMainPlaylistTracks(): Promise<MainPlaylistTrack[]> {
    const { data, error } = await supabase
      .from('main_playlist_tracks')
      .select('*')
      .order('added_at', { ascending: true });

    if (error) throw error;
    return data as MainPlaylistTrack[];
  },
};
