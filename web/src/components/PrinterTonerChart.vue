<template>
  <v-card>
    <apexchart
      type="line"
      :options="chartOptions"
      :series="chartSeries"
      width="100%"
      height="300px"
    />
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  status: {
    timestamp: Date
    tonerBlackLevel: number
    tonerCyanLevel: number
    tonerMagentaLevel: number
    tonerYellowLevel: number
    counter: number
  }[]
}>()

const chartOptions = ref({
  chart: {
    animations: {
      enabled: false
    },
    // id: 'chart',
    type: 'line',

    title: 'Toner',

    toolbar: {
      show: true
    }
  },

  colors: ['#000000', '#00BCD4', '#E91E63', '#FDD835'],

  stroke: {
    curve: 'stepline',
    width: 4
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    }
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    title: {
      text: 'Nível de toner'
    },
    min: 0,
    max: 100,
    tickAmount: 4
  }
})

const chartSeries = ref([
  {
    name: 'Preto',
    data: props.status.map(s => ({
      x: new Date(s.timestamp).getTime(),
      y: s.tonerBlackLevel
    }))
  },
  {
    name: 'Ciano',
    data: props.status.map(s => ({
      x: new Date(s.timestamp).getTime(),
      y: s.tonerCyanLevel
    }))
  },
  {
    name: 'Magenta',
    data: props.status.map(s => ({
      x: new Date(s.timestamp).getTime(),
      y: s.tonerMagentaLevel
    }))
  },
  {
    name: 'Amarelo',
    data: props.status.map(s => ({
      x: new Date(s.timestamp).getTime(),
      y: s.tonerYellowLevel
    }))
  }
])
</script>
