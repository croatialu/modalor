import type { JSX } from 'vue/jsx-runtime'
import { shallowRef } from 'vue'

interface ModalorChild {
  id: string
  render: () => JSX.Element
}

const modalorChildren = shallowRef<ModalorChild[]>([])
let modalorChildId = 0
export function useModalorChildren() {
  const remove = (id: string) => {
    modalorChildren.value = modalorChildren.value.filter(child => child.id !== id)
  }

  const create = (render: (id: string) => JSX.Element, id?: string) => {
    const realId = id ?? `MODALOR_CHILD_${modalorChildId++}`

    modalorChildren.value = [...modalorChildren.value, { id: realId, render: () => render(realId) }]

    return id
  }

  return {
    children: modalorChildren,
    create,
    remove,
  }
}
