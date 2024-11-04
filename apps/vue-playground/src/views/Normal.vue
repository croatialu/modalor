<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../components/Modal.vue'

const isOpen = ref(false)
</script>

<template>
  <div>
    <button @click="isOpen = true">
      Show
    </button>

    <Modal
      :open="isOpen"
      :is-loading="false"
      title="This is a title"
      description="This is a description"
      @cancel="isOpen = false"
      @ok="isOpen = false"
    >
      <p>This modal dialog has a groovy backdrop!</p>
    </Modal>
  </div>
</template>
