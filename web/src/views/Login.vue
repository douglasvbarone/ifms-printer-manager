<template>
  <v-container class="fill-height">
    <v-form
      :disabled="loading"
      style="width: 480px"
      class="mx-auto"
      @submit.prevent="login"
      v-model="valid"
    >
      <v-card :loading="loading">
        <v-card-title class="mb-2 font-weight-regular">Login</v-card-title>
        <v-card-text>
          <v-text-field
            placeholder="SIAPE"
            variant="outlined"
            label="Usuário"
            color="primary"
            v-model="username"
            autocomplete="username"
            required
          />
          <v-text-field
            placeholder="Senha do SUAP"
            type="password"
            variant="outlined"
            label="Senha"
            color="primary"
            v-model="password"
            autocomplete="current-password"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :disabled="loading || !valid"
          >
            Entrar
          </v-btn>
        </v-card-actions>
      </v-card>
      <div v-if="errors.length">
        <v-alert
          v-for="error in errors"
          icon="mdi-alert-circle"
          :key="error"
          color="error"
          class="mt-2"
          variant="outlined"
          closable
        >
          {{ error }}
        </v-alert>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { api } from "@/api";
import { saveJwtToken } from "@/auth";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";

const username = ref<string>("");
const password = ref<string>("");

const valid = ref(false);
const errors = reactive<string[]>([]);

const loading = ref(false);

const router = useRouter();

const { fetchMe } = useAppStore();

async function login() {
  errors.splice(0, errors.length);

  try {
    loading.value = true;
    const data = await api<{ token: string }>("login", {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const token = data.token;

    saveJwtToken(token);

    await fetchMe();

    router.push({ name: "Home" });
  } catch (error: any) {
    errors.push(error.message);
  } finally {
    loading.value = false;
  }
}
</script>
