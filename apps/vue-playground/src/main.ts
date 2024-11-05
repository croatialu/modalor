import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import 'vuetify/styles'

import './style.css'

const vuetify = createVuetify()

createApp(App).use(vuetify).mount('#app')
