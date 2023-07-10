<template>
  <v-container>
    <h1 class="text-h2 mb-16">Procurar novas impressoras</h1>
    <v-alert class="mb-8" type="info" variant="outlined">
      Se uma nova impressora foi conectada à rede e ainda não apareceu na lista
      de impressoras, clique no botão abaixo para forçar uma redescoberta. Isso
      leva cerca de 30 segundos.
    </v-alert>
    <v-btn
      color="primary"
      @click="discoverPrinters"
      size="x-large"
      :disabled="loading"
      :loading="loading"
    >
      <v-icon start>mdi-refresh</v-icon>
      Redescobrir impressoras
    </v-btn>

    <v-card
      class="mt-8"
      v-if="discoveredPrintersIPs.length || newPrinters.length"
    >
      <v-card-title>
        <h5 class="text-h5 mb-0">Impressoras encontradas</h5>
      </v-card-title>
      <v-card-text>
        <v-chip
          class="ma-1"
          v-for="printerIP in discoveredPrintersIPs"
          :key="printerIP"
          variant="outlined"
        >
          {{ printerIP }}
        </v-chip>
      </v-card-text>
      <v-card-title>
        <h5 class="text-h5 mb-0">Novas impressoras</h5>
      </v-card-title>
      <v-card-text v-if="newPrinters.length">
        <v-chip
          class="ma-1"
          v-for="printer in (newPrinters as Printer[])"
          :key="printer.ip"
          variant="outlined"
        >
          {{ printer.ip }} - {{ printer.model }}
        </v-chip>
      </v-card-text>
      <v-card-text v-else>
        <v-alert type="warning" variant="outlined">
          Nenhuma nova impressora foi encontrada!
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { api } from '@/api'
import { Printer } from '@prisma/client'
import { ref } from 'vue'

const loading = ref(false)

const discoveredPrintersIPs = ref([])

const newPrinters = ref([])

async function discoverPrinters() {
  try {
    loading.value = true

    const response = await api<any>('discovery', {
      method: 'POST'
    })

    discoveredPrintersIPs.value = response.discoveredPrintersIPs
    newPrinters.value = response.newPrinters
  } catch (error: any) {
    console.log(error.message)
  } finally {
    loading.value = false
  }
}
</script>
