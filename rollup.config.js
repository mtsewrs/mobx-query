import typescript from '@rollup/plugin-typescript'

export default {
  input: './lib/index.ts',
  output: { format: 'cjs', dir: './dist', sourcemap: true },

  external: ['react-dom', 'mobx', 'react'],

  plugins: [
    typescript({
      tsconfig: './mobx.tsconfig.json',
    }),
  ],
}
