<template>
  <v-img :height="size" :src="`/img/${model}.png`" />
</template>

<script lang="ts" setup>
defineProps({
  model: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 128,
  },
})
</script>
