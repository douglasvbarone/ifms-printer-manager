<template>
  <v-img height="300" :src="`/img/${model}.png`" />
</template>

<script lang="ts" setup>
defineProps({
  model: {
    type: String,
    required: true,
  },
});
</script>
