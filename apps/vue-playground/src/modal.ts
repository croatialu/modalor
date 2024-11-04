import { create } from '@modalor/vue'
import { h } from 'vue'
import Modal from './components/Modal.vue'

export const createModal = create<{ title: string, description: string }>(({ onCancel, onOk, open, isOkLoading, props }) => {
  return h(Modal, {
    open,
    onCancel,
    onOk,
    title: props.title,
    description: props.description,
    isOkLoading,
  }, props.renderChildren)
}, {
  removeDelay: 1000,
})
