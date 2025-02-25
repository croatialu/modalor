import { Confirm } from '@/components/Confirm'
import { createModal } from '../modal'

export const confirmModal = createModal(() => {
  return <Confirm />
}, {
  title: 'Confirm',
  description: 'This is a confirm',
})
