import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

interface ModalorCtx<T> {
  onOk: (fn: () => void) => void
  onCancel: (fn: () => void) => void
  resolve: (values: T) => void
  isOkLoading: boolean
  isOkDisabled: boolean
  setOkLoading: (value: boolean) => void
  setOkDisabled: (value: boolean) => void
}

export function useModalor<T>() {
  return injectModalor<T>()
}

const EMPTY_SYMBOL = Symbol('empty')

export const ModalorContext = createContext<ModalorCtx<any>>({
  onOk: () => { },
  onCancel: () => { },
  resolve: () => { },
  isOkLoading: false,
  setOkLoading: (_value: boolean) => { },
  isOkDisabled: false,
  setOkDisabled: (_value: boolean) => { },
})

ModalorContext.displayName = 'ModalorContext'

export function useProvideModalor() {
  const okQueue = useRef([] as (() => (void | Promise<void>))[])
  const cancelQueue = useRef([] as (() => (void | Promise<void>))[])
  const [isOkLoading, setOkLoading] = useState(false)
  const [isOkDisabled, setOkDisabled] = useState(false)
  const [resolvedValues, setResolvedValues] = useState(EMPTY_SYMBOL)

  const isResolved = useMemo(() => resolvedValues !== EMPTY_SYMBOL, [resolvedValues])

  const resolve = useCallback((values: any) => {
    if (isResolved)
      return
    setResolvedValues(values)
  }, [isResolved])

  const onOk = useCallback((fn: () => (void | Promise<void>)) => {
    okQueue.current.push(fn)
  }, [])

  const onCancel = useCallback((fn: () => (void | Promise<void>)) => {
    cancelQueue.current.push(fn)
  }, [])

  const emit = useCallback(async (event: 'ok' | 'cancel') => {
    if (event === 'ok')
      await Promise.all(okQueue.current.map(fn => fn()))
    else
      await Promise.all(cancelQueue.current.map(fn => fn()))
  }, [])

  return {
    onOk,
    onCancel,
    resolve,
    isOkLoading,
    setOkLoading,
    isOkDisabled,
    setOkDisabled,
    emit,
    isResolved,
    resolvedValues,
  }
}

function injectModalor<T>(): ModalorCtx<T> {
  try {
    return useContext(ModalorContext)
  }
  catch {
    return useProvideModalor()
  }
}
