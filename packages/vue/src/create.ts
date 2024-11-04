import type { JSX } from 'vue/jsx-runtime'
import { defineComponent, h, ref, watch } from 'vue'
import { useModalorChildren } from './state'
import { provideModalor } from './useModalor'

interface ModalOptions<T extends AnyObject> {
  open: boolean
  isOkLoading: boolean
  onOk: () => void
  onCancel: () => void
  onRemove: () => void
  props: T & {
    children: JSX.Element
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
   * 移除组件的延迟时间
   * @default 1000
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
      emits: {
        resolve: (_values: ResolveValues) => true,
        destroy: () => true,
      },
      setup(_, { attrs, emit }) {
        const open = ref(true)
        const { emit: emitModalor, isResolved, resolve, isOkLoading } = provideModalor()

        const handleCancel = () => {
          open.value = false
          resolve(null)
        }

        const handleRemove = () => {
          emit('destroy')
        }

        watch(open, (value) => {
          if (value) {
            return
          }

          setTimeout(() => {
            handleRemove()
          }, options.removeDelay ?? 1000)
        }, {
          once: true,
        })

        const handleOk = async () => {
          try {
            await emitModalor('ok')
          }
          catch (error) {
            console.error(error)
          }
        }

        watch(isResolved, (value) => {
          if (value) {
            handleCancel()
          }
        })

        return () => {
          const { modalProps: _modalProps, ...otherProps } = attrs
          const propsWhenShow = _modalProps as Partial<ModalProps>

          const tmpPropsWhenCreating = (typeof propsWhenCreating === 'function'
            ? propsWhenCreating(otherProps as ModalContentProps)
            : propsWhenCreating) as unknown as ModalProps

          const modalProps = options.transformers?.modalProps?.(tmpPropsWhenCreating, propsWhenShow) ?? {
            ...tmpPropsWhenCreating,
            ...propsWhenShow,
          }

          const children = renderModalContent(otherProps as ModalContentProps)

          return renderModalWrapper({
            open: open.value,
            onOk: handleOk,
            onCancel: handleCancel,
            onRemove: handleRemove,
            isOkLoading: isOkLoading.value,
            props: {
              ...modalProps,
              children,
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
              ...props,
              key: id,
              id,
              modalProps,
              onDestroy: () => {
                resolve([false, null])
                remove(id)
              },
              onResolve: (values: ResolveValues) => {
                resolve([true, values])
                remove(id)
              },
            })
          })
        })
      },
    }
  }
}

// const createModalor = create<{ title: string, description: string }>(({ open, onCancel, props }) => {
//   return (
//     <dialog
//       open={open}
//       title={props.title}
//       onClose={onCancel}
//     >
//       {
//         props.description && <p>{props.description}</p>
//       }

//       {
//         props.children
//       }
//     </dialog>
//   )
// }, {
//   transformers: {
//     modalProps: (propsWhenCreating, propsWhenShow) => ({
//       ...propsWhenCreating,
//       ...propsWhenShow,
//     }),
//   },
// })

// interface UserProfileReturnType {
//   name: string
// }

// const UserProfile = defineComponent({
//   props: {
//     name: String,
//   },
//   setup(props) {

//     const { onOk, resolve } = useModalor()

//     const newName = ref(props.name)

//     onOk(() => {
//       resolve({
//         name: newName.value,
//       })
//     })

//     return () => <div>
//       <h1>User Profile</h1>
//       <input v-model={newName.value} />
//     </div>
//   }
// })

// const helloModalor = createModalor<{ name: string }, UserProfileReturnType>(({ name }) => (
//   <UserProfile name={name} />
// ), {
//   title: '123',
//   description: ''
// })

// const [isOk, result] = await helloModalor.show({
//   name: 'World',
// }, { title: '123' })

// if (isOk) {
//   console.log(result)
// }
