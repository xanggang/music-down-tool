
declare module 'music-api' {
  type source = 'netease' | 'xiami' | 'qq' | 'all'
  interface SearchPar {
    key: string;
    limit: number;
    page: number;
    raw?: boolean;
  }
  interface SearchSongPar {
    id: number;
    raw: boolean;
    br?: 999000 | 128000 | 192000 | 320000;
  }
  export function searchSong (type: source, config: SearchPar): Promise<any>;
  export function searchAlbum (type: source, config: SearchPar): Promise<any>;
  export function searchPlaylist (type: source, config: SearchPar): Promise<any>;
  export function getSong (type: source, config: SearchSongPar): Promise<any>;
  export function getAlbum (type: source, config: SearchSongPar): Promise<any>;
  export function getPlaylist (type: source, config: SearchSongPar): Promise<any>;
}

// declare const musicApi: MusicApi
