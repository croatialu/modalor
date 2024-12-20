import type { PropType } from 'vue'
import type { JSX } from 'vue/jsx-runtime'
import { defineComponent, h, ref, watch } from 'vue'
import { useModalorChildren } from './state'
import { provideModalor } from './useModalor'

interface ModalOptions<T extends AnyObject> {
  open: boolean
  isOkLoading: boolean
  isOkDisabled: boolean
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
    const { create, remove } = useModalorChildren()

    const Component = defineComponent({
      props: {
        modalContentProps: {
          type: Object as PropType<ModalContentProps>,
          required: true,
        },
        modalProps: {
          type: Object as PropType<Partial<ModalProps>>,
          required: true,
        },
      },
      name: 'ModalorChild',
      emits: {
        ok: (_values: ResolveValues) => true,
        cancel: () => true,
        close: () => true,
      },
      setup(props, { emit }) {
        const open = ref(true)
        const { emit: emitModalor, isResolved, isOkLoading, resolvedValues, isOkDisabled } = provideModalor()

        const handleClose = () => {
          open.value = false
        }

        const handleOk = async () => {
          try {
            await emitModalor('ok')
          }
          catch (error) {
            console.error(error)
          }
        }

        const handleCancel = () => {
          handleClose()
          emit('cancel')
        }

        const handleRemove = () => {
          emit('close')
        }

        watch(open, (value) => {
          if (value) {
            return
          }

          setTimeout(() => {
            handleRemove()
          }, options.removeDelay ?? 300)
        }, {
          once: true,
        })

        watch(isResolved, (value) => {
          if (value) {
            emit('ok', resolvedValues.value)
            handleClose()
          }
        })

        const renderChildren = () => {
          return renderModalContent(props.modalContentProps as ModalContentProps)
        }

        return () => {
          const propsWhenShow = props.modalProps as Partial<ModalProps>

          const tmpPropsWhenCreating = (typeof propsWhenCreating === 'function'
            ? propsWhenCreating(props.modalContentProps as ModalContentProps)
            : propsWhenCreating) as unknown as ModalProps

          const modalProps = options.transformers?.modalProps?.(tmpPropsWhenCreating, propsWhenShow) ?? {
            ...tmpPropsWhenCreating,
            ...propsWhenShow,
          }

          return renderModalWrapper({
            open: open.value,
            onOk: handleOk,
            onCancel: handleCancel,
            onRemove: handleRemove,
            isOkLoading: isOkLoading.value,
            isOkDisabled: isOkDisabled.value,
            props: {
              ...modalProps,
              renderChildren,
            },
          })
        }
      },
    })

    return {
      show: (
        props: ModalContentProps = {} as ModalContentProps,
        /** show modal 时传入的 modal props */
        modalProps: Partial<ModalProps> = {} as Partial<ModalProps>,
      ) => {
        return new Promise<[false, null] | [true, ResolveValues]>((resolve) => {
          create((id) => {
            return h(Component, {
              key: id,
              modalContentProps: props as any,
              modalProps: modalProps as any,
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
