<template>
  <v-container class="page text-center fill-height">
    <div style="width: 100%">
      <h1 class="text-h1 mb-16">404</h1>
      <p class="mb-16 text-h5">
        <v-icon start>mdi-file-search-outline</v-icon>
        Página não encontrada...
      </p>
      <br />

      <p>Talvez tenha acabado o toner...</p>
      <p>Chacoalhe o computador, as vezes resolve... 🤷</p>

      <v-btn
        size="x-large"
        class="mt-16"
        color="primary"
        :to="{ name: 'Home' }"
      >
        <v-icon start>mdi-home</v-icon>
        Início
      </v-btn>
    </div>
  </v-container>
</template>
