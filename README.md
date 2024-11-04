# modalor

## Useage

### Vue

```ts
import { create } from '@modalor/vue'
import { h } from 'vue'

interface ModalProps {
  title: string
  // ...
}

// 1. create modal wrapper
const createModal = create<ModalProps>(({ onCancel, onOk, open, isOkLoading, props: { children, ...rest } }) => (
  h(YourModalComponent, { onCancel, onOk, open, isOkLoading, ...rest }, () => children)
))

// 2. use modal wrapper
// 2.1 define modal content props
interface ModalContentProps {
  username: string
  // ...
}

// 2.2 define modal content resolve values
interface ModalContentResolveValues {
  newUsername: string
  // ...
}
// 2.3 create modal wrapper with modal content props and resolve values
const yourModal = createModal<ModalContentProps, ModalContentResolveValues>(props => (
  h(YourModalContentComponent, { ...props })
))
```

```vue
<script setup>
// 1. import your modal
import { yourModal } from 'yourModal.ts'

async function showModal() {
  // 2. show modal
  const [isOk, result] = await yourModal.show({
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

## Build

To build all apps and packages, run the following command:

```
cd modalor
pnpm build
```

## Develop

To develop all apps and packages, run the following command:

```
cd modalor
pnpm dev
```
