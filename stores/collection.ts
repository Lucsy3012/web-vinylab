import { defineStore } from "pinia";

export const useCollection = defineStore("collection", {
  state: () => ({
    data: {},
    sortedByArtists: [],
  }),

  actions: {
    async set(value: any): Promise<void> {
      this.data = value;
    },
    async setSortedByArtists(value: any): Promise<void> {
      this.sortedByArtists = value;
    },
    async check(): Promise<boolean> {
      return Object.keys(this.data).length > 0;
    },
    async clear(): Promise<void> {
      this.data = {};
    },
  },
});
