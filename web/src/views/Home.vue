<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        lg="6"
        xxl="4"
        v-for="printer in appStore.filteredPrinters"
        :key="printer.id"
      >
        <printer-card :printer="printer" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import PrinterCard from '@/components/PrinterCard.vue'
import { useAppStore } from '@/store/appStore'

import { onMounted } from 'vue'

const appStore = useAppStore()

onMounted(async () => {
  await appStore.fetchPrinters()
})
</script>
