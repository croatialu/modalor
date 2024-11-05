import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

interface ModalorCtx {
  onOk: (fn: () => void) => void
  onCancel: (fn: () => void) => void
  resolve: (values: any) => void
  isOkLoading: boolean
}

export function useModalor() {
  return injectModalor()
}

const EMPTY_SYMBOL = Symbol('empty')

export const ModalorContext = createContext<ModalorCtx>({
  onOk: () => { },
  onCancel: () => { },
  resolve: () => { },
  isOkLoading: false,
})

ModalorContext.displayName = 'ModalorContext'

export function useProvideModalor() {
  const okQueue = useRef([] as (() => (void | Promise<void>))[])
  const cancelQueue = useRef([] as (() => (void | Promise<void>))[])
  const [isOkLoading, setOkLoadingStatus] = useState(false)

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
    setOkLoadingStatus,
    emit,
    isResolved,
    resolvedValues,
  }
}

function injectModalor(): ModalorCtx {
  try {
    return useContext(ModalorContext)
  }
  catch {
    return useProvideModalor()
  }
}
