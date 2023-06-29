// Utilities
import { defineStore } from 'pinia'
import { api } from '@/api'
import { useRouter } from 'vue-router'
import type { Printer, User, Network } from '@prisma/client'

const router = useRouter()

export const useAppStore = defineStore('app', {
  state: () => ({
    me: null as User | null,
    printers: [] as any[],
    printerFilter: '',
    onlyMyCampus: true,
    loadingPrinters: false
  }),

  actions: {
    async fetchPrinters() {
      this.loadingPrinters = true
      try {
        this.printers = await api<any[]>(
          `printer?${new URLSearchParams({
            campus: this.onlyMyCampus ? this.me?.campus || '' : ''
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
      try {
        this.me = await api<User>('login/me', { method: 'GET' })
      } catch (error) {
        router.push({ name: 'Login' })
      }
    }
  },
  getters: {
    filteredPrinters(state): Printer[] {
      const filter = this.printerFilter?.trim()

      if (!filter) {
        return state.printers
      }

      return state.printers.filter(printer => {
        return (
          printer.friendlyName?.toLowerCase().includes(filter.toLowerCase()) ||
          printer.serialNumber.toLowerCase().includes(filter.toLowerCase()) ||
          printer.model.toLowerCase().includes(filter.toLowerCase()) ||
          printer.location?.toLowerCase().includes(filter.toLowerCase()) ||
          printer.ip.toLowerCase().includes(filter.toLowerCase())
        )
      })
    }
  }
})