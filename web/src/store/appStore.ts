// Utilities
import { defineStore } from 'pinia'
import { api } from '@/api'
import { useRouter } from 'vue-router'
import type { Printer, User } from '@prisma/client'

export const useAppStore = defineStore('app', {
  state: () => ({
    me: null as User | null,
    printers: [] as any[],
    printerFilter: '',
    selectedCampus: '',
    loadingPrinters: false
  }),

  actions: {
    async fetchPrinters(force = false) {
      if (this.loadingPrinters) return

      this.loadingPrinters = true

      try {
        this.printers = await api<any[]>(
          `printer?${new URLSearchParams({
            campus: this.selectedCampus,
            force: force ? 'true' : ''
          })}`,
          { method: 'GET' }
        )
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingPrinters = false
      }
    },

    async fetchMe() {
      const router = useRouter()

      try {
        this.me = await api<User>('login/me', { method: 'GET' })
      } catch (error) {
        router.push({ name: 'Login' })
      }
    }
  },
  getters: {
    filteredPrinters(state): Printer[] {
      const filter = this.printerFilter?.trim().toLowerCase()

      if (!filter) {
        return state.printers
      }

      return state.printers.filter(
        printer =>
          printer.friendlyName?.toLowerCase().includes(filter) ||
          printer.serialNumber.toLowerCase().includes(filter) ||
          printer.model.toLowerCase().includes(filter) ||
          printer.location?.toLowerCase().includes(filter) ||
          printer.ip.toLowerCase().includes(filter)
      )
    }
  }
})
