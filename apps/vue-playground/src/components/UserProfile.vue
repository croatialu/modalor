<script setup lang="ts">
import { useModalor } from '@modalor/vue'

const props = defineProps<{
  name: string
}>()

const { onOk, resolve, isOkLoading } = useModalor()

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
    User Profile:

    <br>

    my name is {{ props.name }}
  </div>
</template>
