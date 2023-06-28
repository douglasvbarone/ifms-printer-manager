<template>
  <v-app id="inspire">
    <v-app-bar :elevation="0">
      <v-text-field
        class="ml-2"
        density="compact"
        style="max-width: 350px"
        placeholder="Pesquisar"
        hide-details
        rounded
        variant="solo"
        prepend-inner-icon="mdi-printer-search"
        clearable
      />

      <v-spacer />

      <v-chip variant="flat" color="primary">
        <v-avatar v-if="me?.thumbnailPhoto" :image="me?.thumbnailPhoto" start />
        {{ me?.displayName }}
      </v-chip>
      <v-btn class="ml-2" variant="text" @click="logout" icon size="small">
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import { removeJwtToken } from "@/auth";

import { useRouter } from "vue-router";

const { me } = useAppStore();

const router = useRouter();

function logout() {
  removeJwtToken();

  router.push({ name: "Login" });
}
</script>
