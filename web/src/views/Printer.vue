<template>
  <v-container>
    <v-row>
      <v-col>
        <printer-card class="mb-2" v-if="printer" :printer="printer" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="printer?.avgMonthPrint" cols="12" lg="4">
        <v-card
          class="fill-height"
          title="Média mensal de impressões"
          prepend-icon="mdi-file-document-multiple-outline"
        >
          <v-card-text class="text-center align-stretch">
            <div class="text-h2 my-6">
              {{
                new Intl.NumberFormat('pt-BR').format(printer?.avgMonthPrint)
              }}
            </div>

            <small>Baseado nos dados dos últimos 180 dias</small>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <printer-toner-chart
          v-if="printer"
          :status="printer?.status"
          class="fill-height"
        />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <printer-counter-chart
          v-if="printer"
          :status="printer?.status"
          class="fill-height"
        />
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
