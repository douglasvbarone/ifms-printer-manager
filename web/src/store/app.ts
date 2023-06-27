// Utilities
import { defineStore } from "pinia";
import { api } from "@/api";
import { useRouter } from "vue-router";

export const useAppStore = defineStore("app", {
  state: () => ({
    me: null,
    printers: [],
  }),

  actions: {
    async fetchPrinters() {
      this.printers = await api("printer", { method: "GET" });
    },

    async fetchMe() {
      const router = useRouter();

      try {
        this.me = await api("me", { method: "GET" });
      } catch (error) {
        router.push({ name: "Login" });
      }
    },
  },
});
