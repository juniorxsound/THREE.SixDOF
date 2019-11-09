import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'
import glslify from 'rollup-plugin-glslify'

const extensions = ['.js', '.ts']

const commonPlugins = () => [
  resolve({ extensions }),
  eslint({
    include: 'src/*'
  }),
  babel({ extensions, include: ['src/**/*'] }),
  glslify({
    basedir: 'src/shaders',
    exclude: 'node_modules/**'
  })
]

const makeOutput = (name, format) => ({
  file: name,
  format: format,
  name: 'SixDOF',
  exports: 'named',
  sourcemap: true,
  globals: { three: 'THREE' }
})

const config = [
  {
    input: 'src/index.ts',
    output: [
      makeOutput(`dist/three-6dof.js`, 'umd'),
      makeOutput(`dist/three-6dof.amd.js`, 'amd'),
      makeOutput(`dist/three-6dof.esm.js`, 'esm')
    ],
    external: ['three'],
    plugins: commonPlugins()
  },
  {
    input: 'src/index.ts',
    output: [
      makeOutput(`dist/three-6dof.min.js`, 'umd'),
      makeOutput(`dist/three-6dof.amd.min.js`, 'amd'),
      makeOutput(`dist/three-6dof.esm.min.js`, 'esm')
    ],
    external: ['three'],
    plugins: [
      ...commonPlugins(),
      terser()
    ]
  }
]

module.exports = config