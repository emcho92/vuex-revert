import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

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
    }),
    uglify()
  ],
  external: ['uuid']
};
