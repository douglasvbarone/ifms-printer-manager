<template>
  <v-card variant="outlined" class="printer-card">
    <div class="d-flex align-center">
      <div class="flex-shrink-1 fill-height" style="width: 128px">
        <printer-img class="pa-2" :model="printer.model" />
      </div>
      <div>
        <v-list density="compact">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-printer"></v-icon>
            </template>

            <v-list-item-title>{{ printer.serialNumber }}</v-list-item-title>
            <v-list-item-subtitle>{{ printer.model }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-map"></v-icon>
            </template>

            <v-list-item-title>
              {{ printer.location || '-' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ printer.ip }} ({{ printer.network.name }})
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-clock"></v-icon>
            </template>
            <v-list-item-title>
              {{ new Date(printer.updatedAt).toLocaleString() }}
            </v-list-item-title>
            <v-list-item-subtitle>Última atualização</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
      <div class="flex-grow-1">
        <v-list density="compact">
          <v-list-subheader>Toner</v-list-subheader>
          <v-list-item>
            <v-list-item-title>
              <v-progress-linear
                :title="`${printer.status[0].tonerBlackLevel}%`"
                class="mb-1"
                height="5"
                :model-value="printer.status[0].tonerBlackLevel"
              />
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
          <v-list-item>
            <v-list-item-title>
              {{ printer.location || '-' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ printer.ip }} ({{ printer.network.name }})
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import PrinterImg from '@/components/PrinterImg.vue'

defineProps<{
  printer: any
}>()
</script>

<style scoped>
.printer-card {
  border-color: #efefef;
}
</style>
