<script setup lang="ts">
import { userProfileModal } from '../modals/userProfile'

async function showUserProfile() {
  const [isOk, result] = await userProfileModal.show({
    name: 'John Doe',
  }, {
    title: `User Profile ${Math.random()}`,
  })

  console.log(isOk, result)
  if (isOk) {
    console.log(result)
  }
}
</script>

<template>
  <div>
    <button @click="showUserProfile">
      Show User Profile
    </button>
  </div>
</template>
