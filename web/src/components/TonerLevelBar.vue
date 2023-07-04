<template>
  <div class="mb-1">
    <div class="d-flex">
      <div class="flex-grow-1 align-self-center">
        <v-progress-linear
          :title="`${level}%`"
          :height="8"
          :color="bgColor"
          :model-value="level"
        />
      </div>
      <div class="align-self-center">
        <v-chip
          size="x-small"
          class="justify-center align-self-center ml-1"
          style="width: 32px"
          :color="level < 10 ? 'error' : level < 20 ? 'waring' : 'grey'"
          variant="text"
        >
          {{ level }}%
        </v-chip>
      </div>
    </div>
    <span class="text-grey-darken-1">
      {{ model }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  level: number
  color: 'black' | 'cyan' | 'magenta' | 'yellow'
  model: string
}>()

const bgColor = computed(() => {
  switch (props.color) {
    case 'cyan':
      return 'cyan'
    case 'magenta':
      return 'pink'
    case 'yellow':
      return 'yellow-darken-1'
    default:
      return 'black'
  }
})
</script>
