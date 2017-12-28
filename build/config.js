import path from 'path'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

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
    input: resolve('src/js/main.js'),
    format: 'cjs',
    output: {
      file: resolve('dist/fluide.common.js'),
      format: 'cjs'
    },
    banner
  },
  'web-cjs-min': {
    input: resolve('src/js/main.js'),
    format: 'cjs',
    output: {
      file: resolve('dist/fluide.common.min.js'),
      format: 'cjs'
    },
    banner
  },
  'web-esm': {
    input: resolve('src/js/main.js'),
    format: 'es',
    output: {
      file: resolve('dist/fluide.esm.js'),
      format: 'es'
    },
    banner
  },
  'web-esm-min': {
    input: resolve('src/js/main.js'),
    format: 'es',
    output: {
      file: resolve('dist/fluide.esm.min.js'),
      format: 'es'
    },
    banner
  },
  'web': {
    input: resolve('src/js/main.js'),
    format: 'umd',
    output: {
      file: resolve('dist/fluide.js'),
      format: 'umd'
    },
    banner
  },
  'web-min': {
    input: resolve('src/js/main.js'),
    format: 'umd',
    output: {
      file: resolve('dist/fluide.min.js'),
      format: 'umd'
    },
    banner
  },
}

function genConfig(opts, environment) {
  const env = typeof environment !== 'undefined' ? environment : 'development'

  const config = {
    input: opts.input,
    external: opts.external,
    format: opts.format,
    output: opts.output,
    banner: opts.banner,
    name: opts.name || 'fluide',
    plugins: [
      replace({
        __VERSION__: version
      }),
      babel(),
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
        include: ['src/js/**', 'src/scss/**']
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