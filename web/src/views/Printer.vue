<template>
  <v-container>
    <v-row>
      <v-col>
        <printer-card class="mb-2" v-if="printer" :printer="printer" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <printer-toner-chart v-if="printer" :status="printer?.status" />
      </v-col>
      <v-col>
        <printer-counter-chart v-if="printer" :status="printer?.status" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { api } from '@/api'
import { Printer } from '@prisma/client'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import PrinterCard from '@/components/PrinterCard.vue'
import PrinterTonerChart from '@/components/PrinterTonerChart.vue'
import PrinterCounterChart from '@/components/PrinterCounterChart.vue'

const router = useRouter()

const printer = ref()

const serialNumber = router.currentRoute.value.params.serialNumber as string

async function getPrinter() {
  try {
    printer.value = await api<Printer>(`printer/${serialNumber}`, {
      method: 'GET'
    })
  } catch (error: any) {
    if (error.message == 'Printer not found') {
      router.push({ name: 'NotFound' })
    } else console.log(error.message)
  }
}

getPrinter()
</script>
