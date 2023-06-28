<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="printer in appStore.printers"
        :key="printer.id"
      >
        <printer-card :printer="printer" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import PrinterCard from '@/components/PrinterCard.vue'
import { useAppStore } from '@/store/app'

import { onMounted } from 'vue'

const appStore = useAppStore()

onMounted(async () => {
  await appStore.fetchMe()
  await appStore.fetchPrinters()
})
</script>
