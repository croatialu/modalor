import type { JSX, PropsWithChildren } from 'react'
import { createContext, createElement, useCallback, useContext, useState } from 'react'

interface ModalrGlobalContext {
  create: (render: (id: string) => JSX.Element) => string
  remove: (id: string) => void
}

interface ModalorChild {
  id: string
  render: () => JSX.Element
}

const Context = createContext<ModalrGlobalContext>({
  create: () => '',
  remove: () => { },
})

let modalorChildId = 0

export const useModalorGlobal = () => useContext(Context)

export function ModalorProvider({ children }: PropsWithChildren) {
  const [modalorChildren, setModalorChildren] = useState<ModalorChild[]>([])

  const create = useCallback((render: (id: string) => JSX.Element) => {
    const id = `MODALOR_CHILD_${modalorChildId++}`
    setModalorChildren([...modalorChildren, { id, render: () => render(id) }])
    return id
  }, [modalorChildren])

  const remove = useCallback((id: string) => {
    setModalorChildren(modalorChildren.filter(child => child.id !== id))
  }, [modalorChildren])

  return createElement(Context.Provider, { value: { create, remove } }, [
    children,
    ...modalorChildren.map(child => child.render()),
  ])
}
