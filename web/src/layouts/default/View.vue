<template>
  <v-app>
    <v-progress-linear
      v-if="appStore.loadingPrinters"
      style="position: fixed; z-index: 9999"
      color="primary"
      indeterminate
    />
    <v-app-bar :elevation="0">
      <v-select
        class="ml-2"
        :items="campiSelectItems"
        v-model="appStore.selectedCampus"
        @update:model-value="appStore.fetchPrinters"
        hide-details
        center-affix
        variant="solo"
        density="compact"
        style="max-width: 200px"
        prepend-inner-icon="mdi-domain"
        label="Campus"
        rounded
      />
      <v-text-field
        class="ml-2"
        density="compact"
        style="max-width: 200px"
        placeholder="Pesquisar"
        hide-details
        rounded
        variant="solo"
        prepend-inner-icon="mdi-printer-search"
        clearable
        v-model.lazy="appStore.printerFilter"
      />

      <v-spacer />
      <v-btn
        icon="mdi-refresh"
        class="mr-1"
        color="primary"
        title="Atualizar"
        @click="appStore.fetchPrinters"
        :disabled="appStore.loadingPrinters"
      ></v-btn>

      <v-chip color="primary">
        <v-avatar
          v-if="appStore.me?.thumbnailPhoto"
          :image="appStore.me?.thumbnailPhoto"
          start
        />
        {{ appStore.me?.displayName }}
      </v-chip>
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
import { useAppStore } from '@/store/appStore'

import { removeJwtToken } from '@/auth'

import { useRouter } from 'vue-router'

const appStore = useAppStore()

const router = useRouter()

const campiSelectItems = [
  {
    title: 'Todos',
    value: ''
  },
  {
    title: 'Reitoria',
    value: 'RT'
  },
  {
    title: 'Aquidauana',
    value: 'AQ'
  },
  {
    title: 'Campo Grande',
    value: 'CG'
  },
  {
    title: 'Corumbá',
    value: 'CB'
  },
  {
    title: 'Coxim',
    value: 'CX'
  },
  {
    title: 'Nova Andradina',
    value: 'NA'
  },
  {
    title: 'Ponta Porã',
    value: 'PP'
  },
  {
    title: 'Três Lagoas',
    value: 'TL'
  },
  {
    title: 'Jardim',
    value: 'JD'
  },
  {
    title: 'Naviraí',
    value: 'NV'
  },
  {
    title: 'Dourados',
    value: 'DR'
  }
]

function logout() {
  removeJwtToken()

  router.push({ name: 'Login' })
}
</script>
