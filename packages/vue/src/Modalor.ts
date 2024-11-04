import { defineComponent, Fragment, h } from 'vue'
import { useModalorChildren } from './state'

export const Modalor = defineComponent({
  name: 'Modalor',
  setup() {
    const { children } = useModalorChildren()

    return () => {
      return h(Fragment, {}, children.value.map(child => child.render()))
    }
  },
})
