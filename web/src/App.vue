<template>
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
import { onBeforeMount } from 'vue'

const router = useRouter()
const appStore = useAppStore()

onBeforeMount(async () => {
  await appStore.fetchMe()

  if (!appStore.me) {
    console.log('Not logged in')
    router.replace({ name: 'Login' })
  }

  appStore.selectedCampus = appStore.me?.campus || ''

  await appStore.fetchPrinters()
})
</script>
