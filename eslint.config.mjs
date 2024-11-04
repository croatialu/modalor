import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
}, {
  files: ['packages/vue/src/**/*.tsx'],
  vue: true,
})
