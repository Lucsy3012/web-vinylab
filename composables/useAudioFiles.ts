import { createSharedComposable } from "@vueuse/core/index";
import { useCompression } from "~/composables/useCompression";
import { useComposition } from "~/composables/useComposition";
import { Song } from "~/types/globalTypes";
import Crunker from "crunker";

export function useAudioFilesService() {
  const crunker = new Crunker();
  const composition = useComposition();

  async function concat(uris: string[]) {
    return await crunker
      .fetchAudio(...uris)
      .then((buffers) => crunker.concatAudio(buffers))
      .then((merged) => crunker.export(merged, "audio/mp3"))
      .then((output) => {
        return output.url;
      })
      .catch((error) => {
        throw new Error(error);
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

  async function getComposedSideUrls(selected, songs: Song[]) {
    if (!songs) return;

    const allSongs = songs.map((song) => {
      return song.fields?.file?.url ?? "";
    });

    const concattedSongUrl: string = await concat(allSongs as string[]);

    // todo continue here: convert file via freeconvert api (doesn't work locally)
    /*
    if (process.env.NODE_ENV !== "development") {
      const result = await useCompression().compress(
        concattedSongUrl,
        composition.getFileName(selected),
        "mp3",
      );

      console.log("result", result);
    }
     */

    return concattedSongUrl;
  }

  return {
    getDurations,
    getComposedSideUrls,
  };
}

export const useAudioFiles = createSharedComposable(useAudioFilesService);
