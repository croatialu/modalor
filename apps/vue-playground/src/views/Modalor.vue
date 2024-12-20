<script setup lang="ts">
import { userProfileModal } from '../modals/userProfile'
import { confirmModal } from '../modals/confirm'

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

async function showConfirm() {
  const [isOk, result] = await confirmModal.show()

  console.log(isOk, result)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <button @click="showUserProfile">
      Show User Profile
    </button>
    <button @click="showConfirm">
      Show Confirm
    </button>
  </div>
</template>
