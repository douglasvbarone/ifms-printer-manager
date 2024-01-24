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
import { BASE_URL } from './api'

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

  const eventURI = `${BASE_URL}events`

  const events = new EventSource(eventURI)

  events.onmessage = async event => {
    console.log('Event:', event)
    await appStore.fetchPrinters()
  }
})
</script>
