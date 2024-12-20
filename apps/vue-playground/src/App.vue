<script setup lang="ts">
import { Modalor } from '@modalor/vue'
import UserProfile from './components/UserProfile.vue'
import ModalorPlayground from './views/Modalor.vue'
import NormalPlayground from './views/Normal.vue'
</script>

<template>
  <div>
    <div class="flex gap-4">
      <div class="w-1/2 border border-gray-200 rounded-lg p-4">
        <NormalPlayground />
      </div>
      <div class="w-1/2 border border-gray-200 rounded-lg p-4">
        <ModalorPlayground />
        <UserProfile name="John Doe" />
      </div>
    </div>
    <Modalor />
  </div>
</template>
