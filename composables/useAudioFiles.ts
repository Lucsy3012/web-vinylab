import { createSharedComposable } from "@vueuse/core/index";
import { Song } from "~/types/globalTypes";
// import lamejs from "lamejs";
import Crunker from "crunker";

export function useAudioFilesService() {
  const crunker = new Crunker();

  async function concat(uris: string[]) {
    const proms = uris.map((uri) => fetch(uri).then((r) => r.blob()));
    return await Promise.all(proms).then((blobs) => {
      const blob = new Blob(blobs);
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
      // return new Audio(blobUrl);
    });
  }

  async function concat2(uris: string[]) {
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

  /* second approach, also not working
  async function concat(uris: string[]) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const buffers = [];

    try {
      for (const uri of uris) {
        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        buffers.push(audioBuffer);
      }

      // Concatenate the audio buffers
      let concatenatedBuffer = null;
      for (const buffer of buffers) {
        if (!concatenatedBuffer) {
          concatenatedBuffer = audioContext.createBuffer(
            buffer.numberOfChannels,
            buffer.length,
            buffer.sampleRate,
          );
        }

        concatenatedBuffer.getChannelData(0).set(buffer.getChannelData(0), 0);
        concatenatedBuffer.getChannelData(1).set(buffer.getChannelData(1), 0);
      }

      // Encode the concatenated audio buffer back to an MP3 file using lamejs
      const mp3encoder = new lamejs.Mp3Encoder(
        2,
        concatenatedBuffer.sampleRate,
        128,
      ); // 2 channels, sample rate, and bit rate

      const leftData = concatenatedBuffer.getChannelData(0);
      const rightData = concatenatedBuffer.getChannelData(1);
      const samples = leftData.length;

      const mp3Data = [];

      for (let i = 0; i < samples; i++) {
        const leftSample = leftData[i] * 32767.0; // Convert to 16-bit PCM
        const rightSample = rightData[i] * 32767.0;
        const mp3Buffer = mp3encoder.encodeBuffer([leftSample, rightSample]);
        mp3Data.push(new Int8Array(mp3Buffer));
      }

      const mp3Buffer = mp3encoder.flush();
      if (mp3Buffer.length > 0) {
        mp3Data.push(new Int8Array(mp3Buffer));
      }

      // Concatenate the MP3 data arrays
      const finalMp3Data = [].concat.apply([], mp3Data);

      // Create a Blob from the encoded MP3 data
      const mp3Blob = new Blob([new Uint8Array(finalMp3Data)], {
        type: "audio/mp3",
      });

      // Create a URL for the Blob
      const mp3Url = URL.createObjectURL(mp3Blob);

      return mp3Url;
    } catch (error) {
      console.error("Error concatenating MP3 files:", error);
    }
  }
  */

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

    // return await concat(allSongs as string[]);
    return await concat2(allSongs as string[]);
  }

  return {
    getDurations,
    getComposedSideUrls,
  };
}

export const useAudioFiles = createSharedComposable(useAudioFilesService);
