<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar :image="me?.thumbnailPhoto || undefined" />
          </template>
          <v-list-item-title>{{ me?.displayName }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ me?.campus }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block variant="text" @click="logout">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout"></v-icon>
            </template>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title
        ><v-icon icon="mdi-printer" /> Impressoras</v-toolbar-title
      >
      <v-spacer />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useAppStore } from "@/store/app";
import { removeJwtToken } from "@/auth";

import { useRouter } from "vue-router";

const { me } = useAppStore();

const drawer = ref(true);

const router = useRouter();

function logout() {
  removeJwtToken();

  router.push({ name: "Login" });
}
</script>
