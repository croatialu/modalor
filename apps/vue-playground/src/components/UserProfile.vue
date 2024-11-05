<script setup lang="ts">
import { useModalor } from '@modalor/vue'
import { ref } from 'vue'

const props = defineProps<{
  name: string
}>()

const name = ref(props.name)

const { onOk, resolve, isOkLoading } = useModalor()

onOk(() => {
  isOkLoading.value = true

  setTimeout(() => {
    isOkLoading.value = false
    resolve({
      name: name.value,
    })
  }, 2000)
})
</script>

<template>
  <div>
    User Profile:

    <br>

    my name is {{ props.name }}

    <v-text-field v-model="name" label="Name" />
  </div>
</template>
