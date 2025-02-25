import { create } from '@modalor/react'
import { Modal } from './components/Modal'
import { createElement } from 'react'

export const createModal = create<{ title: string, description: string }>(({
  onCancel, onOk, open, isOkLoading, isOkDisabled, props
}) => {
  return createElement(Modal, {
    open,
    onCancel,
    onOk,
    title: props.title,
    description: props.description,
    isOkLoading,
    isOkDisabled,
  }, props.renderChildren())
}, {
  removeDelay: 1000,
})
