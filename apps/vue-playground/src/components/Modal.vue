<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  isOkLoading?: boolean
  isOkDisabled?: boolean
  title: string
  description: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'ok'): void
  (e: 'update:open', value: boolean): void
}>()

const isOpen = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  },
})

function cancel() {
  emit('cancel')
}

function ok() {
  emit('ok')
}

const dialogRef = ref<HTMLDialogElement | null>(null)
watch(() => [props.open, dialogRef.value] as const, ([open, dialog]) => {
  if (!dialog)
    return
  if (open) {
    dialog.showModal()
  }
  else {
    dialog.close()
  }
}, {
  immediate: true,
})
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500" persistent>
    <template #default>
      <v-card :title="props.title">
        <v-card-subtitle>
          {{ props.description }}
        </v-card-subtitle>
        <v-card-text>
          <slot />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text="Cancel"
            @click="cancel"
          />
          <v-btn
            text="OK"
            :loading="props.isOkLoading"
            :disabled="props.isOkDisabled"
            color="primary"
            variant="outlined"
            @click="ok"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
</style>
