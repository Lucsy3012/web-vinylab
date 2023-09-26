import { defineStore } from "pinia";
import { Album, Side, Song } from "~~/types/globalTypes";

export const useSelected = defineStore("selected", {
  state: () => ({
    album: <Album>{},
    sides: <Side[]>[],
    side: <Side>{},
    song: <Song>{},
    moodColor: <string>"#EBE7DD",
  }),

  actions: {
    async setAlbum(value: Album): Promise<void> {
      this.album = value;
      this.sides = value?.fields?.sides ?? [];
      this.side = value?.fields?.sides[0] ?? {};
      this.song = value?.fields?.sides[0]?.fields?.songs[0] ?? {};
      this.moodColor = value?.fields?.moodColor ?? "#EBE7DD";
    },
    async setSide(value: Side): Promise<void> {
      this.side = value ?? {};
      this.song = value?.fields?.songs[0] ?? {};
    },

    // Checks
    async checkAlbum(): Promise<boolean> {
      return Object.keys(this.album).length > 0;
    },
    async checkSide(): Promise<boolean> {
      return !!this.side?.id;
    },
    async checkSong(): Promise<boolean> {
      return !!this.song?.url;
    },
  },
});
