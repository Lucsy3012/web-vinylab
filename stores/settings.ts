import { defineStore } from "pinia";

export const useSettings = defineStore("settings", {
  state: () => ({
    display: "grid" as "grid" | "list" | "coverflow",
    mode: "explore" as "explore" | "experience",
    rpm: <number>45,
    volume: <number>0.75,
    playing: <boolean>false,
    filter: "",
  }),

  actions: {
    async setDisplay(value: "grid" | "list" | "coverflow"): Promise<void> {
      this.display = value;
    },
    async setMode(value: "explore" | "experience"): Promise<void> {
      this.mode = value;
    },
    async setRPM(value: number): Promise<void> {
      this.rpm = value;
    },
    async setVolume(value: number): Promise<void> {
      this.volume = value;
    },
    async setPlaying(value: boolean): Promise<void> {
      this.playing = value;
    },
    async togglePlaying(): Promise<void> {
      this.playing = !this.playing;
    },
    async setFilter(value: string): Promise<void> {
      this.filter = value;
    },
  },
});
