import type { Ref, ShallowRef } from 'vue'
import { computed, inject, provide, ref, shallowRef } from 'vue'

interface ModalorCtx<T = any> {
  onOk: (fn: () => void) => void
  onCancel: (fn: () => void) => void
  resolve: (values: T) => void
  isOkLoading: Ref<boolean>
  isOkDisabled: Ref<boolean>
}

export function useModalor<T = any>() {
  return injectModalor<T>()
}

const EMPTY_SYMBOL = Symbol('empty')

export function provideModalor() {
  const okQueue: (() => (void | Promise<void>))[] = []
  const cancelQueue: (() => (void | Promise<void>))[] = []
  const isOkLoading = ref(false)
  const isOkDisabled = ref(false)

  const onOk = (fn: () => (void | Promise<void>)) => {
    okQueue.push(fn)
  }

  const onCancel = (fn: () => (void | Promise<void>)) => {
    cancelQueue.push(fn)
  }

  const resolvedValues: ShallowRef<any> = shallowRef(EMPTY_SYMBOL)

  const isResolved = computed(() => resolvedValues.value !== EMPTY_SYMBOL)

  const resolve = (values: any) => {
    if (isResolved.value)
      return
    resolvedValues.value = JSON.parse(JSON.stringify(values))
    isOkLoading.value = false
  }

  const emit = async (event: 'ok' | 'cancel') => {
    if (event === 'ok')
      await Promise.all(okQueue.map(fn => fn()))
    else
      await Promise.all(cancelQueue.map(fn => fn()))
  }

  const ctx = {
    onOk,
    onCancel,
    resolve,
    isOkLoading,
    isOkDisabled,
  } satisfies ModalorCtx

  provide('MODALOR', ctx)

  return {
    ...ctx,
    emit,
    isResolved,
    resolvedValues,
  }
}

function injectModalor<T = any>(): ModalorCtx<T> {
  const isOkLoading = ref(false)
  const isOkDisabled = ref(false)
  const defaultValue = {
    onOk: () => { },
    onCancel: () => { },
    resolve: () => {
      isOkLoading.value = false
    },
    isOkLoading,
    isOkDisabled,
  } as ModalorCtx

  return inject<ModalorCtx>('MODALOR', defaultValue)!
}
