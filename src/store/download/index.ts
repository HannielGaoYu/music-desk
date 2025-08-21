import { defineStore } from "pinia";

export const useDownloadStore = defineStore('download', {
  state: () => ({
    progress: 0
  }),
  actions: {
    async fetchProgress(progress: number) {
      this.progress = progress
    }
  }
})