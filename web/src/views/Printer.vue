<template>
  <v-container>
    <printer-card class="mb-2" v-if="printer" :printer="printer" />

    <printer-toner-chart v-if="printer" :status="printer?.status" />
  </v-container>
</template>
<script lang="ts" setup>
import { api } from '@/api'
import { Printer } from '@prisma/client'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import PrinterCard from '@/components/PrinterCard.vue'
import PrinterTonerChart from '@/components/PrinterTonerChart.vue'

const route = useRoute()

const printer = ref()

const serialNumber = route.params.serialNumber as string

async function getPrinter() {
  printer.value = await api<Printer>(`printer/${serialNumber}`, {
    method: 'GET'
  })
}

getPrinter()
</script>
