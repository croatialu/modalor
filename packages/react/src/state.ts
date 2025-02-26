import { createContext, useCallback, useEffect, useState } from 'react'

interface ModalorGlobalActions {
  create: (render: (id: string) => JSX.Element) => string
  remove: (id: string) => void
}

export const ModalorContext = createContext<ModalorGlobalActions>({
  create: () => '',
  remove: () => { },
})

interface ModalorChild {
  id: string
  render: () => JSX.Element
}

let modalorChildId = 0

const actions: ModalorGlobalActions = {
  create: () => '',
  remove: () => { },
}

export function setupActions(newActions: ModalorGlobalActions) {
  Object.assign(actions, newActions)
}

export const useModalorGlobalActions = () => actions

export function useModalorChildren() {
  const [modalorChildren, setModalorChildren] = useState<ModalorChild[]>([])

  const create = useCallback((render: (id: string) => JSX.Element) => {
    const id = `MODALOR_CHILD_${modalorChildId++}`
    setModalorChildren(prev => [...prev, { id, render: () => render(id) }])
    return id
  }, [])

  const remove = useCallback((id: string) => {
    setModalorChildren(prev => prev.filter(child => child.id !== id))
  }, [])

  useEffect(() => {
    setupActions({ create, remove })
  }, [create, remove])

  return {
    children: modalorChildren,
    create,
    remove,
  }
}
