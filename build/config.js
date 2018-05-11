import path from 'path'
import replace from 'rollup-plugin-replace'
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript';

const version = process.env.VERSION || require('../package.json').version

const resolve = p => {
  return path.resolve(__dirname, '../', p)
}

const banner =
  '/*!\n' +
  ' * Fluide v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' nerdslabs\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const builds = {
  'web-cjs': {
    input: resolve('js/fluide.ts'),
    format: 'cjs',
    output: {
      sourcemap: true,
      file: resolve('dist/fluide.common.js'),
      format: 'cjs',
      banner: banner
    },
  },
  'web-cjs-min': {
    input: resolve('js/fluide.ts'),
    format: 'cjs',
    output: {
      sourcemap: true,
      file: resolve('dist/fluide.common.min.js'),
      format: 'cjs',
      banner: banner
    },
  },
  'web-esm': {
    input: resolve('js/fluide.ts'),
    format: 'es',
    output: {
      sourcemap: true,
      file: resolve('dist/fluide.esm.js'),
      format: 'es',
      banner: banner
    },
  },
  'web-esm-min': {
    input: resolve('js/fluide.ts'),
    format: 'es',
    output: {
      sourcemap: true,
      file: resolve('dist/fluide.esm.min.js'),
      format: 'es',
      banner: banner
    },
  },
  'web': {
    input: resolve('js/fluide.ts'),
    format: 'umd',
    output: {
      sourcemap: true,
      file: resolve('dist/fluide.js'),
      format: 'umd',
      banner: banner
    },
  },
  'web-min': {
    input: resolve('js/fluide.ts'),
    format: 'umd',
    output: {
      sourcemap: true,
      file: resolve('dist/fluide.min.js'),
      format: 'umd',
      banner: banner
    },
  },
}

function genConfig(opts, environment) {
  const env = typeof environment !== 'undefined' ? environment : 'development'

  const config = {
    input: opts.input,
    external: opts.external,
    format: opts.format,
    output: opts.output,
    name: opts.name || 'Fluide',
    plugins: [
      replace({
        __VERSION__: version
      }),
      typescript({
        typescript: require('typescript')
      }),
      sourcemaps()
      // alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || [])
  }

  if (env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }))

    if(env === 'development') {
      config['watch'] = {
        chokidar: true,
        include: ['js/**']
      }
    }
  }

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(builds[process.env.TARGET])
} else {
  exports.getBuild = name => genConfig(builds[name])
  exports.getAllBuilds = (environment) => Object.keys(builds).map(name => genConfig(builds[name], environment))
}