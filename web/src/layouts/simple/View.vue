<template>
  <v-app id="inspire">
    <v-main> <router-view /> </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const drawer = ref(true);
</script>
