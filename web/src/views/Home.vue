<template>
  <v-card
    class="ma-1"
    v-for="printer in appStore.filteredPrinters"
    :key="printer.id"
  >
    <v-card-title class="font-weight-regular">
      {{ printer.friendlyName || printer.serialNumber }}
    </v-card-title>
    <v-card-text>
      <printer-img :model="printer.model" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import PrinterImg from "@/components/PrinterImg.vue"

import { useAppStore } from "@/store/app"

import { onMounted } from "vue"

const appStore = useAppStore()

onMounted(() => {
  appStore.fetchPrinters()
})
</script>
