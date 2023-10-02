import { createSharedComposable } from "@vueuse/core/index";
// import { useCompound } from "~/composables/useCompound";
import { Song } from "~/types/globalTypes";

export function useAudioFilesService() {
  async function concat(uris: string[]) {
    const proms = uris.map((uri) => fetch(uri).then((r) => r.blob()));
    return await Promise.all(proms).then((blobs) => {
      const blob = new Blob(blobs);
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
      // return new Audio(blobUrl);
    });
  }

  async function getDurations(songs: Song[]) {
    return await Promise.all(
      songs.map(async (song) => {
        // Create a non-dom allocated Audio element
        const audio = document.createElement("audio");

        // Define the URL of the MP3 audio file
        audio.src = `https:${song?.fields?.file?.url}` ?? "";

        // Create a Promise to resolve when the metadata is loaded
        const metadataLoadedPromise = new Promise((resolve) => {
          audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
          });
        });

        // Wait for the metadata to be loaded and get the duration
        return await metadataLoadedPromise;
      }),
    );
  }

  async function getComposedSideUrls(songs: Song[]) {
    if (!songs) return;

    const allSongs = songs.map((song) => {
      return song.fields?.file?.url;
    });

    return await concat(allSongs as string[]);
  }

  // todo fix
  async function getComposedSideSizes(songs: Song[]) {
    if (!songs) return;

    let songSize = 0;

    const individual = songs.map((song) => {
      return song.fields?.file?.details?.size ?? 0;
    });
    const compound = songs.map((song) => {
      songSize += song.fields?.file?.details?.size ?? 0;
    });

    return {
      individual,
      compound,
    };
  }

  return {
    concat,
    getDurations,
    getComposedSideUrls,
    getComposedSideSizes,
  };
}

export const useAudioFiles = createSharedComposable(useAudioFilesService);
