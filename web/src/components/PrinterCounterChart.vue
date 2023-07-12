<template>
  <v-card title="Contador" prepend-icon="mdi-counter">
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
    counter: number
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

  colors: ['#000000'],

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
      text: 'Contador'
    },
    tickAmount: 5
  }
})

const chartSeries = ref([
  {
    name: 'Contador',
    data: props.status.map(s => ({
      x: new Date(s.timestamp).getTime(),
      y: s.counter
    }))
  }
])
</script>
