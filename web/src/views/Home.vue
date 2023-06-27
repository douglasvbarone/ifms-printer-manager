<template>
  <div>
    <h1>Home</h1>
    {{ printers }}
  </div>
</template>

<script lang="ts" setup>
import { api } from "@/api";
import { ref } from "vue";

const printers = ref([]);

async function getPrinters() {
  const data = await api("printer", {
    method: "GET",
  });

  printers.value = data;
}

getPrinters();
</script>
