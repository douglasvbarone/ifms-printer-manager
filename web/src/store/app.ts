// Utilities
import { defineStore } from "pinia"
import { api } from "@/api"
import { useRouter } from "vue-router"
import { Printer, User } from "@prisma/client"

const router = useRouter()

export const useAppStore = defineStore("app", {
  state: () => ({
    me: null as User | null,
    printers: [] as Printer[],
  }),

  actions: {
    async fetchPrinters() {
      this.printers = await api<Printer[]>("printer", { method: "GET" })
    },

    async fetchMe() {
      try {
        this.me = await api<User>("login/me", { method: "GET" })
      } catch (error) {
        router.push({ name: "Login" })
      }
    },
  },
})
