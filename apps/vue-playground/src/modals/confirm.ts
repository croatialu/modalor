import { h } from 'vue'
import Confirm from '../components/Confirm.vue'
import { createModal } from '../modal'

export const confirmModal = createModal(() => {
  return h(Confirm)
}, {
  title: 'Confirm',
  description: 'This is a confirm',
})
