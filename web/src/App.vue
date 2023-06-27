<template>
  <v-app>
    <v-main><RouterView /></v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAppStore } from "./store/app";

const appStore = useAppStore();

appStore.fetchMe();
</script>
