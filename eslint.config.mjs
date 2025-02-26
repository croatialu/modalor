import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
}, {
  files: ['packages/vue/', 'apps/vue-playground/'],
  vue: true,
}, {
  files: ['packages/react/', 'apps/react-playground/'],
  react: true,
}, {
  ignores: ['apps/react-playground/src/components/ui/**'],
}, {
  rules: {
    'no-console': 'warn',
  },
})
