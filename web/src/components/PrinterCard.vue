<template>
  <v-card>
    <v-row>
      <v-col :cols="4">
        <printer-img :model="printer.model" />
      </v-col>
      <v-col :cols="6">{{ printer.serialNumber }}</v-col>
    </v-row>
  </v-card>
</template>
<script lang="ts" setup>
import PrinterImg from '@/components/PrinterImg.vue'
import { Printer } from '@prisma/client'

defineProps<{
  printer: Printer
}>()
</script>
