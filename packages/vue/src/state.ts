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

  const create = (render: (id: string) => JSX.Element) => {
    const id = `MODALOR_CHILD_${modalorChildId++}`

    // modalorChildren.value.push({ id, render })
    modalorChildren.value = [...modalorChildren.value, { id, render: () => render(id) }]

    return id
  }

  return {
    children: modalorChildren,
    create,
    remove,
  }
}
