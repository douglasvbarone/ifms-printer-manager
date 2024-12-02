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

    <v-card class="mt-8" v-if="supportedPrintersIPs.length">
      <v-card-title>
        <h5 class="text-h5 mb-0">Impressoras suportadas encontradas</h5>
      </v-card-title>
      <v-card-text>
        <v-chip
          class="ma-1"
          v-for="printerIP in supportedPrintersIPs"
          :key="printerIP"
          variant="outlined"
        >
          {{ printerIP }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-card class="mt-8" v-if="unsupportedPrintersIPs.length">
      <v-card-title>
        <h5 class="text-h5 mb-8">Impressoras não suportadas encontradas</h5>
      </v-card-title>
      <v-card-text>
        <v-chip
          class="ma-1"
          v-for="printerIP in unsupportedPrintersIPs"
          :key="printerIP"
          variant="outlined"
        >
          {{ printerIP }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-card class="mt-8" v-if="newPrinters.length">
      <v-card-title>
        <h5 class="text-h5 mb-8">Novas impressoras adicionadas ao sistema</h5>
      </v-card-title>
      <v-card-text>
        <v-chip
          class="ma-1"
          v-for="printer in newPrinters"
          :key="printer"
          variant="outlined"
        >
          {{ printer.ip }} ({{ printer.model }})
        </v-chip>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { api } from '@/api'
import { ref } from 'vue'

const loading = ref(false)

const supportedPrintersIPs = ref([])
const unsupportedPrintersIPs = ref([])

const newPrinters = ref([])

async function discoverPrinters() {
  try {
    loading.value = true

    const response = await api<any>('discovery', {
      method: 'POST'
    })

    console.log(response)

    supportedPrintersIPs.value = response.supportedPrintersIPs
    unsupportedPrintersIPs.value = response.unsupportedPrintersIPs
    newPrinters.value = response.newPrinters
  } catch (error: any) {
    console.log(error.message)
  } finally {
    loading.value = false
  }
}
</script>
