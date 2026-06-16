export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  user_id: string;
  album_name: string;
  artist_name: string;
  title: string;
  image_url: string;
  palette: {
    vibrant?: string;
    muted?: string;
    darkVibrant?: string;
    lightVibrant?: string;
    darkMuted?: string;
    lightMuted?: string;
  } | null;
  youtube_video_id: string;
  added_at: string;
}

export interface MainPlaylistTrack {
  album_name: string;
  artist_name: string;
  title: string;
  image_url: string;
  palette: {
    vibrant?: string;
    muted?: string;
    darkVibrant?: string;
    lightVibrant?: string;
    darkMuted?: string;
    lightMuted?: string;
  } | null;
  added_at: string;
}
