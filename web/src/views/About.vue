<template>
  <v-container fluid class="fill-height">
    <div style="width: 100%" class="text-center">
      <h1 class="text-h1 mb-16">Sobre</h1>
      <p class="mb-16">Versão {{ version }}</p>
      <p>Desenvolvido pelo SERTI Ponta Porã</p>
      <p><a href="mailto:serti.pp@ifms.edu.br">serti.pp@ifms.edu.br</a></p>
      <v-btn class="mt-16" :to="{ name: 'Home' }" color="primary">
        <v-icon start>mdi-home</v-icon>
        Início
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { version } from '../../../package.json'
</script>
