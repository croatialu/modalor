import type { ReactNode } from 'react'
import { createElement, Fragment } from 'react'
import { useModalorChildren } from './state'

export function ModalorProvider({ children }: { children: ReactNode | undefined }): ReactNode {
  const { children: modalorChildren } = useModalorChildren()

  return createElement(Fragment, null, [
    children,
    ...modalorChildren.map(child => child.render()),
  ])
}
