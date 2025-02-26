import type { JSX } from 'react'
import { createElement, useEffect, useState } from 'react'
import { useModalorGlobalActions } from './state'
import { ModalorContext, useProvideModalor } from './useModalor'

interface ModalOptions<T extends AnyObject> {
  open: boolean
  isOkLoading: boolean
  setOkLoading: (value: boolean) => void
  isOkDisabled: boolean
  setOkDisabled: (value: boolean) => void
  onOk: () => void
  onCancel: () => void
  onRemove: () => void
  props: T & {
    renderChildren: () => JSX.Element
  }
}

interface AnyObject {
  [key: string]: any
}

interface CreateOptions<ModalProps extends AnyObject> {
  transformers?: {
    modalProps?: (propsWhenCreating: ModalProps, propsWhenShow: Partial<ModalProps>) => ModalProps
  }
  /**
   * 移除组件的延迟时间 (ms)
   * @default 300
   */
  removeDelay?: number
}

const defaultTransformers = {
  modalProps: (propsWhenCreating: any, propsWhenShow: any) => ({ ...propsWhenCreating, ...propsWhenShow }),
}

export function create<ModalProps extends AnyObject>(
  renderModalWrapper: (options: ModalOptions<ModalProps>) => JSX.Element,
  options: CreateOptions<ModalProps> = { transformers: defaultTransformers },
) {
  return <
    ModalContentProps extends AnyObject,
    ResolveValues = unknown,
    PropsWhenCreating extends AnyObject = ModalProps,
  >(
    renderModalContent: (props: ModalContentProps) => JSX.Element,
    /** createModal 时传入的 modal props */
    propsWhenCreating: PropsWhenCreating | ((props: ModalContentProps) => PropsWhenCreating) = {} as PropsWhenCreating,
  ) => {
    const actions = useModalorGlobalActions()
    const Component = ({
      onOk,
      onCancel,
      onClose,
      ...props
    }: {
      onOk?: (values: ResolveValues) => void
      onCancel?: () => void
      onClose?: () => void
      modalProps: Partial<ModalProps>
      modalContentProps: ModalContentProps
      [x: string]: any
    }) => {
      const modalorCtx = useProvideModalor()
      const { modalProps: _modalProps, modalContentProps, ...otherProps } = props
      const propsWhenShow = _modalProps
      const [open, setOpenStatus] = useState(true)

      const handleClose = () => {
        setOpenStatus(false)
      }

      const handleOk = async () => {
        try {
          await modalorCtx.emit('ok')
        }
        catch (error) {
          console.error(error)
        }
      }

      const handleCancel = () => {
        handleClose()
        onCancel?.()
        modalorCtx.emit('cancel')
      }

      const handleRemove = () => {
        onClose?.()
      }

      useEffect(() => {
        if (!open) {
          setTimeout(() => {
            handleRemove()
          }, options.removeDelay ?? 300)
        }
      }, [open])

      useEffect(() => {
        if (modalorCtx.isResolved) {
          onOk?.(modalorCtx.resolvedValues as ResolveValues)
          handleClose()
        }
      }, [modalorCtx.isResolved])

      const renderChildren = () => {
        return renderModalContent(modalContentProps)
      }

      const tmpPropsWhenCreating = (typeof propsWhenCreating === 'function'
        ? propsWhenCreating(otherProps as ModalContentProps)
        : propsWhenCreating) as unknown as ModalProps

      const modalProps = options.transformers?.modalProps?.(tmpPropsWhenCreating, propsWhenShow) ?? {
        ...tmpPropsWhenCreating,
        ...propsWhenShow,
      }

      return createElement(ModalorContext.Provider, { value: modalorCtx }, renderModalWrapper({
        open,
        onOk: handleOk,
        onCancel: handleCancel,
        onRemove: handleRemove,
        setOkLoading: modalorCtx.setOkLoading,
        isOkLoading: modalorCtx.isOkLoading,
        isOkDisabled: modalorCtx.isOkDisabled,
        setOkDisabled: modalorCtx.setOkDisabled,
        props: {
          ...modalProps,
          renderChildren,
        },
      }))
    }

    return {
      show: (
        props: ModalContentProps = {} as ModalContentProps,
        /** show modal 时传入的 modal props */
        modalProps: Partial<ModalProps> = {} as Partial<ModalProps>,
      ) => {
        return new Promise<[false, null] | [true, ResolveValues]>((resolve) => {
          actions.create((id) => {
            return createElement(Component, {
              key: id,
              id,
              modalContentProps: props,
              modalProps,
              onClose: () => {
                actions.remove(id)
              },
              onCancel: () => {
                resolve([false, null])
              },
              onOk: (values: ResolveValues) => {
                resolve([true, values])
              },
            })
          })
        })
      },
    }
  }
}
