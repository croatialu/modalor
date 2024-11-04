<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  isOkLoading?: boolean
  title: string
  description: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'ok'): void
}>()

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
  <dialog ref="dialogRef" class="rounded-lg shadow-lg p-4">
    <h1 class="text-2xl font-bold">
      {{ title }}
    </h1>
    <p class="text-sm text-gray-500">
      {{ description }}
    </p>

    <slot />

    <br>
    <div class="flex justify-end gap-2">
      <button autofocus @click="cancel">
        Cancel
      </button>
      <button :disabled="isOkLoading" @click="ok">
        Ok{{ isOkLoading ? '(Loading...)' : '' }}
      </button>
    </div>
  </dialog>
</template>

<style scoped>
::backdrop {
  background-image: linear-gradient(45deg, magenta, rebeccapurple, dodgerblue, green);
  opacity: 0.75;
}
</style>
