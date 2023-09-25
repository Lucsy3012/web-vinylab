import { defineStore } from "pinia";

export const useSettings = defineStore("settings", {
  state: () => ({
    display: "grid" as "grid" | "list" | "coverflow",
    mode: "explore" as "explore" | "experience",
    volume: <number>0.75,
  }),

  actions: {
    async setDisplay(value: "grid" | "list" | "coverflow"): Promise<void> {
      this.display = value;
    },
    async setMode(value: "explore" | "experience"): Promise<void> {
      this.mode = value;
    },
    async setVolume(value: number): Promise<void> {
      this.volume = value;
    },
  },
});
