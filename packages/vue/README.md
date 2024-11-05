# @modalor/vue

A modal state manager for Vue3.

## Install

```bash
pnpm add @modalor/vue
```

## Usage

### create a modal with your own modal component

```ts
// modal.ts
import { create } from '@modalor/vue'
import { h } from 'vue'

interface ModalProps {
  title: string
  // ...
}

// 1. create modal wrapper
export const createModal = create<ModalProps>(({ onCancel, onOk, open, isOkLoading, props: { renderChildren, ...rest } }) => (
  h(YourModalComponent, { onCancel, onOk, open, isOkLoading, ...rest }, renderChildren)
))
```

### create a modal with a content component

```ts
// modals/userProfile.ts
import { createModal } from './../modal'

// 1.define modal content props
interface ModalContentProps {
  username: string
  // ...
}

// 2. define modal content resolve values
interface ModalContentResolveValues {
  newUsername: string
  // ...
}
// 3. create modal wrapper with modal content props and resolve values
const userProfileModal = createModal<ModalContentProps, ModalContentResolveValues>(props => (
  h(YourModalContentComponent, { ...props })
))
```

### use api to show modal

```vue
<script setup>
// 1. import your modal
import { userProfileModal } from '@/modals/userProfile'

async function showModal() {
  // 2. show modal
  const [isOk, result] = await userProfileModal.show({
    username: 'John'
  }, {
    title: 'User Profile', // you can override modal props
  })

  // 3. handle result
  if (isOk) {
    console.log(result.newUsername) // will be your resolve values
  }
}
</script>

<template>
  <button @click="showModal">
    Show Modal
  </button>
</template>
```
