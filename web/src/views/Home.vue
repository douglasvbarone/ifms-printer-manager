<template>
  <v-container fluid>
    <v-alert
      type="info"
      v-if="appStore.filteredPrinters.length == 0 && appStore.printerFilter"
      closable
      variant="outlined"
    >
      Nenhuma impressora encontrada com este filtro
    </v-alert>
    <v-row>
      <v-col
        cols="12"
        lg="6"
        xxl="4"
        v-for="printer in appStore.filteredPrinters"
        :key="printer.id"
      >
        <printer-card :printer="printer" nav />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import {onActivated} from 'vue'
import PrinterCard from '@/components/PrinterCard.vue'
import { useAppStore } from '@/store/appStore'

const appStore = useAppStore()

onActivated(async () => {
  await appStore.fetchPrinters()
})
</script>
