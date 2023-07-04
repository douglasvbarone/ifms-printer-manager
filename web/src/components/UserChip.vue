<template>
  <v-chip color="primary">
    <v-avatar
      v-if="appStore.me?.thumbnailPhoto"
      :image="appStore.me?.thumbnailPhoto"
      :start="smAndUp"
    />
    <span v-if="smAndUp">
      {{ appStore.me?.displayName }}
    </span>
  </v-chip>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/appStore'
import { useDisplay } from 'vuetify'

const { smAndUp } = useDisplay()

const appStore = useAppStore()
</script>
