// Utilities
import { defineStore } from "pinia";
import { api } from "@/api";
import { useRouter } from "vue-router";
import { User } from "@prisma/client";

export const useAppStore = defineStore("app", {
  state: () => ({
    me: null as User | null,
    printers: [],
  }),

  actions: {
    async fetchPrinters() {
      this.printers = await api("printer", { method: "GET" });
    },

    async fetchMe() {
      const router = useRouter();

      try {
        this.me = await api<User>("login/me", { method: "GET" });
      } catch (error) {
        router.push({ name: "Login" });
      }
    },
  },
});
