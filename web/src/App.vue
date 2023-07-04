<template>
  <div class="alpha-banner py-1 px-3 bg-amber text-black">
    <v-icon size="small" icon="mdi-bug" />
    Em desenvolvimento! Versão 0.0.0.½ Alpha Gambiarra
  </div>
  <v-app>
    <v-main>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from './store/appStore'
import { onMounted } from 'vue'

const router = useRouter()
const appStore = useAppStore()

onMounted(async () => {
  await appStore.fetchMe()

  if (!appStore.me) {
    console.log('Not logged in')
    router.replace({ name: 'Login' })
  }

  appStore.selectedCampus = appStore.me?.campus || ''
})
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
