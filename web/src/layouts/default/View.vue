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
        @update:model-value="() => appStore.fetchPrinters(true)"
        hide-details
        center-affix
        variant="solo"
        density="compact"
        style="max-width: 220px"
        prepend-inner-icon="mdi-domain"
        label="Campus"
        rounded
        :disabled="appStore.loadingPrinters"
      />
      <v-text-field
        v-if="mdAndUp"
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
        :disabled="appStore.loadingPrinters"
      />

      <v-btn
        icon="mdi-refresh"
        class="ml-2"
        title="Atualizar"
        @click="appStore.fetchPrinters(true)"
        :disabled="appStore.loadingPrinters"
      />
      <v-spacer />

      <user-chip />
      <v-btn class="mx-2" @click="logout" icon size="small">
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in menuItems"
            :key="i"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import UserChip from '@/components/UserChip.vue'
import { useAppStore } from '@/store/appStore'
import { useDisplay } from 'vuetify'

import { removeJwtToken } from '@/auth'

import { useRouter } from 'vue-router'

const appStore = useAppStore()

const router = useRouter()

const { mdAndUp } = useDisplay()

const menuItems = [
  {
    title: 'Procurar impressoras...',
    action: () => router.push({ name: 'Discovery' })
  },
  {
    title: 'Sobre',
    action: () => router.push({ name: 'About' })
  }
]

const campiSelectItems = [
  {
    title: 'Todos',
    value: 'ALL'
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
    title: 'Dourados',
    value: 'DR'
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
    title: 'Nova Andradina',
    value: 'NA'
  },
  {
    title: 'Ponta Porã',
    value: 'PP'
  },
  {
    title: 'Reitoria',
    value: 'RT'
  },

  {
    title: 'Três Lagoas',
    value: 'TL'
  }
]

function logout() {
  removeJwtToken()

  router.push({ name: 'Login' })

  appStore.me = null
}
</script>
