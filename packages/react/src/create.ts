import type { JSX } from 'react'
import { createElement, useEffect, useState } from 'react'
import { useModalorGlobal } from './Modalor'
import { useProvideModalor } from './useModalor'

interface ModalOptions<T extends AnyObject> {
  open: boolean
  isOkLoading: boolean
  setOkLoadingStatus: (value: boolean) => void
  isOkDisabled: boolean
  setOkDisabledStatus: (value: boolean) => void
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
    const { create, remove } = useModalorGlobal()

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
      [x: string]: any
    }) => {
      const modalorCtx = useProvideModalor()
      const { modalProps: _modalProps, ...otherProps } = props
      const propsWhenShow = _modalProps as Partial<ModalProps>
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
        const { modalProps, ...otherProps } = props
        return renderModalContent(otherProps as ModalContentProps)
      }

      const tmpPropsWhenCreating = (typeof propsWhenCreating === 'function'
        ? propsWhenCreating(otherProps as ModalContentProps)
        : propsWhenCreating) as unknown as ModalProps

      const modalProps = options.transformers?.modalProps?.(tmpPropsWhenCreating, propsWhenShow) ?? {
        ...tmpPropsWhenCreating,
        ...propsWhenShow,
      }

      return renderModalWrapper({
        open,
        onOk: handleOk,
        onCancel: handleCancel,
        onRemove: handleRemove,
        setOkLoadingStatus: modalorCtx.setOkLoadingStatus,
        isOkLoading: modalorCtx.isOkLoading,
        isOkDisabled: modalorCtx.isOkDisabled,
        setOkDisabledStatus: modalorCtx.setOkDisabledStatus,
        props: {
          ...modalProps,
          renderChildren,
        },
      })
    }

    return {
      show: (
        props: ModalContentProps = {} as ModalContentProps,
        /** show modal 时传入的 modal props */
        modalProps: Partial<ModalProps> = {} as Partial<ModalProps>,
      ) => {
        return new Promise<[false, null] | [true, ResolveValues]>((resolve) => {
          create((id) => {
            return createElement(Component, {
              ...props,
              key: id,
              id,
              modalProps,
              onClose: () => {
                remove(id)
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
