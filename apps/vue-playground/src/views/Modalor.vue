<script setup lang="ts">
import { userProfileModal } from '../modals/userProfile'

function showUserProfile() {
  userProfileModal.show({
    name: 'John Doe',
  }, {
    title: `User Profile ${Math.random()}`,
  })
}
</script>

<template>
  <div>
    <button @click="showUserProfile">
      Show User Profile
    </button>
  </div>
</template>
