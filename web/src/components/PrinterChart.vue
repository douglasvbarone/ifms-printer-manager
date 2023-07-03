<template>
  <apexchart
    type="line"
    :options="chartOptions"
    :series="chartSeries"
    width="100%"
    height="100%"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const chartOptions = ref({
  chart: {
    // id: 'chart',
    type: 'line',

    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    }
  }
})

const chartSeries = ref([
  {
    name: 'A',
    data: [
      { x: 'test1', y: 32 },
      { x: 'test2', y: 35 }
    ]
  },
  {
    name: 'B',
    data: [
      { x: 'test1', y: 11 },
      { x: 'test2', y: 15 }
    ]
  }
])
</script>
