<template>
  <v-card title="Toner" prepend-icon="mdi-liquid-spot">
    <apexchart
      type="line"
      :options="chartOptions"
      :series="chartSeries"
      width="100%"
      height="250px"
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
  }[]
}>()

const chartOptions = ref({
  chart: {
    animations: {
      enabled: false
    },

    type: 'line',

    toolbar: {
      show: true
    }
  },

  colors: ['#000000', '#00BCD4', '#E91E63', '#FDD835'],

  stroke: {
    curve: 'smooth',
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

const tonerBlackLevelSeries = {
  name: 'Preto',
  data: props.status.map(s => ({
    x: new Date(s.timestamp).getTime(),
    y: s.tonerBlackLevel
  }))
}

const tonerCyanLevelSeries = {
  name: 'Ciano',
  data: props.status.map(s => ({
    x: new Date(s.timestamp).getTime(),
    y: s.tonerCyanLevel
  }))
}

const tonerMagentaLevelSeries = {
  name: 'Magenta',
  data: props.status.map(s => ({
    x: new Date(s.timestamp).getTime(),
    y: s.tonerMagentaLevel
  }))
}

const tonerYellowLevelSeries = {
  name: 'Amarelo',
  data: props.status.map(s => ({
    x: new Date(s.timestamp).getTime(),
    y: s.tonerYellowLevel
  }))
}

const series = []

if (props.status[0].tonerBlackLevel !== null) {
  series.push(tonerBlackLevelSeries)
}

if (props.status[0].tonerCyanLevel) {
  series.push(tonerCyanLevelSeries)
}

if (props.status[0].tonerMagentaLevel) {
  series.push(tonerMagentaLevelSeries)
}

if (props.status[0].tonerYellowLevel) {
  series.push(tonerYellowLevelSeries)
}

const chartSeries = ref(series)
</script>
