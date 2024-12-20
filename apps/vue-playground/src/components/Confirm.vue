<script setup lang="ts">
import { useModalor } from '@modalor/vue'
import { ref, watch } from 'vue'

const text = ref('')

const { onOk, resolve, isOkLoading, isOkDisabled } = useModalor()

watch(text, (value) => {
  isOkDisabled.value = value !== 'confirm'

  console.log(isOkDisabled.value)
}, {
  immediate: true,
})

onOk(() => {
  isOkLoading.value = true
  setTimeout(() => {
    isOkLoading.value = false
    resolve(null)
  }, 2000)
})
</script>

<template>
  <div>
    type "confirm" to confirm:

    <br>

    <v-text-field v-model="text" label="text" />
  </div>
</template>
