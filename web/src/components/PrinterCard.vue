<template>
  <v-card
    class="printer-card"
    :to="
      nav
        ? { name: 'Printer', params: { serialNumber: printer.serialNumber } }
        : undefined
    "
  >
    <v-row no-gutters wrap>
      <v-col cols="4" sm="2" align-self="center" class="pa-1">
        <v-icon
          v-if="printerAlert"
          class="ma-1 alert-icon"
          color="warning"
          icon="mdi-alert-circle"
          size="x-large"
        />
        <printer-img class="pa-2" :model="printer.model" />
      </v-col>
      <v-col cols="8" sm="4" align-self="center">
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title v-if="printer.friendlyName">
              {{ printer.friendlyName }} ({{ printer.serialNumber }})
            </v-list-item-title>

            <v-list-item-title v-else>
              {{ printer.serialNumber }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ printer.model }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              {{ printer.location || '-' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <a
                class="link"
                :href="`http://${printer.ip}`"
                target="_blank"
                rel="noreferrer"
                @click.stop
              >
                {{ printer.ip }} ({{ printer.network.name }})
                <v-icon size="x-small">mdi-open-in-new</v-icon>
              </a>
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              {{
                new Intl.NumberFormat('pt-BR').format(printer.status[0].counter)
              }}
            </v-list-item-title>
            <v-list-item-subtitle>Contador</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              {{
                new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                }).format(new Date(printer.status[0].timestamp))
              }}
            </v-list-item-title>
            <v-list-item-subtitle>Última atualização</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" sm="6" align-self="center" class="pa-4">
        <toner-level-bar
          :level="printer.status[0].tonerBlackLevel"
          :model="printer.blackTonerModel"
          color="black"
          :solo="!printer.status[0].tonerCyanLevel"
        />
        <toner-level-bar
          v-if="printer.status[0].tonerCyanLevel"
          :level="printer.status[0].tonerCyanLevel"
          :model="printer.cyanTonerModel"
          color="cyan"
        />
        <toner-level-bar
          v-if="printer.status[0].tonerMagentaLevel"
          :level="printer.status[0].tonerMagentaLevel"
          :model="printer.magentaTonerModel"
          color="magenta"
        />
        <toner-level-bar
          v-if="printer.status[0].tonerYellowLevel"
          :level="printer.status[0].tonerYellowLevel"
          :model="printer.yellowTonerModel"
          color="yellow"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
<script lang="ts" setup>
import PrinterImg from '@/components/PrinterImg.vue'
import TonerLevelBar from '@/components/TonerLevelBar.vue'

import { computed } from 'vue'

const props = defineProps<{
  printer: any
  nav?: boolean
}>()

const printerAlert = computed(() => {
  return (
    props.printer.status[0].tonerBlackLevel < 10 ||
    (props.printer.cyanTonerModel &&
      props.printer.status[0].tonerCyanLevel < 10) ||
    (props.printer.magentaTonerModel &&
      props.printer.status[0].tonerMagentaLevel < 10) ||
    (props.printer.yellowTonerModel &&
      props.printer.status[0].tonerYellowLevel < 10)
  )
})
</script>

<style scoped>
.printer-card {
  border-color: #7a7a7a;
}

.printer-alert {
  border-color: #fb8c00;
  border-width: 1px;
}

.alert-icon {
  position: absolute;
  top: 0;
  z-index: 99;
}

.link {
  color: inherit;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
