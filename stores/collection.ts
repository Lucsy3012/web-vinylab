import { defineStore } from "pinia";

export const useCollection = defineStore("collection", {
  state: () => ({
    data: {},
  }),

  actions: {
    async set(value: any): Promise<void> {
      this.data = value;
    },
    async check(): Promise<boolean> {
      // return !!this.data;
      return Object.keys(this.data).length > 0;
    },
    async clear(): Promise<void> {
      this.data = {};
    },
  },
});
