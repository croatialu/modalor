import { ModalorPlugin } from '@modalor/vue'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import 'vuetify/styles'

import './style.css'

const vuetify = createVuetify()
const app = createApp(App)

app.use(vuetify).use(ModalorPlugin).mount('#app')
