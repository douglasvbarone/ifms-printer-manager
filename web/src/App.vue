<template>
  <div class="alpha-banner py-1 px-3 bg-amber text-black">
    <v-icon size="small" icon="mdi-bug" />
    Em desenvolvimento! Versão 0.0.0.½ Alpha Gambiarra
  </div>
  <v-app>
    <v-main><RouterView /></v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAppStore } from './store/appStore'

const appStore = useAppStore()

appStore.fetchMe()
</script>
<style>
.alpha-banner {
  position: fixed;
  bottom: 5px;
  right: 5px;
  z-index: 99999;
  opacity: 0.7;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
    0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
    0 16px 16px rgba(0, 0, 0, 0.12);
}
</style>
