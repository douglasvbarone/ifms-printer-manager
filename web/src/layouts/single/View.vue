<template>
  <v-app>
    <v-progress-linear
      v-if="appStore.loadingPrinters"
      style="position: fixed; z-index: 9999"
      color="primary"
      indeterminate
    />
    <v-app-bar :elevation="0">
      <v-btn icon="mdi-arrow-left" @click="router.back" />
      <v-spacer />

      <user-chip />

      <v-btn class="mx-2" @click="logout" icon size="small">
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import UserChip from '@/components/UserChip.vue'

import { useAppStore } from '@/store/appStore'
import { removeJwtToken } from '@/auth'

import { useRouter } from 'vue-router'

const appStore = useAppStore()

const router = useRouter()

function logout() {
  removeJwtToken()

  router.push({ name: 'Login' })
}
</script>
