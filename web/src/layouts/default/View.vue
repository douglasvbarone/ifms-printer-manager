<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer"> </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-avatar rounded>
        <v-img :src="me?.thumbnailPhoto || undefined" />
      </v-avatar>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useAppStore } from "@/store/app";

const { me } = useAppStore();

const drawer = ref(true);
</script>
