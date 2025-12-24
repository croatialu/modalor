import type { App, Plugin } from 'vue'
import { createVNode, defineComponent, h, render, Teleport } from 'vue'
import { Modalor as ModalorComponent } from './Modalor'

const TeleportModalor = defineComponent({
  name: 'TeleportModalor',
  setup() {
    return () => h(Teleport, { to: 'body' }, [h(ModalorComponent)])
  },
})

export const modalorPlugin: Plugin = {
  install(app: App) {
    app.component('Modalor', ModalorComponent)
    const originalMount = app.mount
    app.mount = function (...args) {
      const vm = originalMount.apply(this, args)
      if (!app.config.globalProperties.$modalorMounted) {
        app.config.globalProperties.$modalorMounted = true

        const modalorHost = document.createElement('div')
        modalorHost.id = '__modalor-host__'
        modalorHost.style.display = 'contents' // 不影响布局
        document.body.appendChild(modalorHost)

        setTimeout(() => {
          const vnode = createVNode(TeleportModalor)
          vnode.appContext = app._context
          render(vnode, modalorHost)
        }, 0)
      }

      return vm
    }
  },
}
