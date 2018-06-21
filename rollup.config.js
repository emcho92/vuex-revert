import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/vuex-revert.js',
    format: 'cjs'
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['uuid']
};
