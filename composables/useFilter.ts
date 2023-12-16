import type { Album, AlbumByArtist } from "~~/types/globalTypes";

export function useFilter() {
  function filterNameAndArtist(arr: any[], filter: string) {
    const filteredArtists = arr.filter((artist: AlbumByArtist) => {
      const existInArtist = artist.fields.artistName
        .toString()
        .toLowerCase()
        .includes(filter.toLowerCase());

      const existInAlbum = artist.albums.filter((album: Album) => {
        return album.fields.title
          .toString()
          .toLowerCase()
          .includes(filter.toLowerCase());
      });

      return existInArtist || existInAlbum.length > 0;
    });

    return filteredArtists.map((artist: AlbumByArtist) => {
      const filteredAlbum = artist.albums.filter((album: Album) => {
        if (album?.fields?.filterValue === undefined) return false;

        return album.fields.filterValue
          .toLowerCase()
          .includes(filter.toLowerCase());
      });

      return {
        ...artist,
        albums: filteredAlbum,
      };
    });
  }

  return {
    filterNameAndArtist,
  };
}
