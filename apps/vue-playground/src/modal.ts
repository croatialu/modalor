import { create } from '@modalor/vue'
import { h } from 'vue'
import Modal from './components/Modal.vue'

export const createModal = create<{ title: string, description: string }>(({ onCancel, onOk, open, isOkLoading, isOkDisabled, props }) => {
  return h(Modal, {
    open,
    onCancel,
    onOk,
    title: props.title,
    description: props.description,
    isOkLoading,
    isOkDisabled,
  }, props.renderChildren)
}, {
  removeDelay: 1000,
})
