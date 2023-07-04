<template>
  <v-card
    variant="outlined"
    class="printer-card"
    :class="{ 'printer-alert': printerAlert }"
    :to="{ name: 'Printer', params: { serialNumber: printer.serialNumber } }"
  >
    <v-row no-gutters wrap>
      <v-col cols="4" sm="2" align-self="center">
        <v-icon
          v-if="printerAlert"
          class="ma-1 alert"
          color="warning"
          icon="mdi-alert"
          size="large"
        />
        <printer-img class="pa-2" :model="printer.model" />
      </v-col>
      <v-col cols="8" sm="4">
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
              {{ printer.ip }} ({{ printer.network.name }})
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
      <v-col cols="12" sm="6" align-self="center">
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title>
              <v-progress-linear
                :title="`${printer.status[0].tonerBlackLevel}%`"
                class="mb-1"
                height="6"
                color="black"
                :model-value="printer.status[0].tonerBlackLevel"
              ></v-progress-linear>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ printer.blackTonerModel }}

              <v-chip
                size="x-small"
                title="Nível do toner"
                variant="tonal"
                :color="
                  printer.status[0].tonerBlackLevel < 10
                    ? 'error'
                    : printer.status[0].tonerBlackLevel < 20
                    ? 'warning'
                    : ''
                "
              >
                {{ printer.status[0].tonerBlackLevel }}%
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="printer.status[0].tonerCyanLevel">
            <v-list-item-title>
              <v-progress-linear
                :title="`${printer.status[0].tonerCyanLevel}%`"
                class="mb-1"
                height="6"
                :model-value="printer.status[0].tonerCyanLevel"
                color="cyan"
              />
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ printer.cyanTonerModel }}
              <v-chip
                size="x-small"
                title="Nível do toner"
                variant="tonal"
                :color="
                  printer.status[0].tonerCyanLevel < 10
                    ? 'error'
                    : printer.status[0].tonerCyanLevel < 20
                    ? 'warning'
                    : ''
                "
              >
                {{ printer.status[0].tonerCyanLevel }}%
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="printer.status[0].tonerMagentaLevel">
            <v-list-item-title>
              <v-progress-linear
                :title="`${printer.status[0].tonerMagentaLevel}%`"
                class="mb-1"
                height="6"
                :model-value="printer.status[0].tonerMagentaLevel"
                color="pink"
              />
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ printer.magentaTonerModel }}
              <v-chip
                size="x-small"
                title="Nível do toner"
                variant="tonal"
                :color="
                  printer.status[0].tonerMagentaLevel < 10
                    ? 'error'
                    : printer.status[0].tonerMagentaLevel < 20
                    ? 'warning'
                    : ''
                "
              >
                {{ printer.status[0].tonerMagentaLevel }}%
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="printer.status[0].tonerYellowLevel">
            <v-list-item-title>
              <v-progress-linear
                :title="`${printer.status[0].tonerYellowLevel}%`"
                class="mb-1"
                height="6"
                :model-value="printer.status[0].tonerYellowLevel"
                color="yellow darken-3"
              />
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ printer.yellowTonerModel }}
              <v-chip
                size="x-small"
                title="Nível do toner"
                variant="tonal"
                :color="
                  printer.status[0].tonerYellowLevel < 10
                    ? 'error'
                    : printer.status[0].tonerYellowLevel < 20
                    ? 'warning'
                    : ''
                "
              >
                {{ printer.status[0].tonerYellowLevel }}%
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>
<script lang="ts" setup>
import PrinterImg from '@/components/PrinterImg.vue'

import { computed } from 'vue'

const props = defineProps<{
  printer: any
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
}

.alert {
  position: absolute;
  top: 0;
  z-index: 99;
}
</style>
