import type { Ref, ShallowRef } from 'vue'
import { computed, inject, provide, ref, shallowRef } from 'vue'

interface ModalorCtx {
  onOk: (fn: () => void) => void
  onCancel: (fn: () => void) => void
  resolve: (values: any) => void
  isOkLoading: Ref<boolean>
}

export function useModalor() {
  return injectModalor()
}

const EMPTY_SYMBOL = Symbol('empty')

export function provideModalor() {
  const okQueue: (() => (void | Promise<void>))[] = []
  const cancelQueue: (() => (void | Promise<void>))[] = []
  const isOkLoading = ref(false)

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
  } satisfies ModalorCtx

  provide('MODALOR', ctx)

  return {
    ...ctx,
    emit,
    isResolved,
  }
}

function injectModalor(): ModalorCtx {
  const isOkLoading = ref(false)
  const defaultValue = {
    onOk: () => { },
    onCancel: () => { },
    resolve: () => {
      isOkLoading.value = false
    },
    isOkLoading,
  } as ModalorCtx

  return inject<ModalorCtx>('MODALOR', defaultValue)!
}
