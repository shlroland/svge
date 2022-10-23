import { cosmiconfigSync } from 'cosmiconfig'
import type { Config, State } from '@svge/core'
import type { OptimizeOptions as SvgoOptions } from 'svgo'

const explorer = cosmiconfigSync('svgo', {
  searchPlaces: [
    'package.json',
    '.svgorc',
    '.svgorc.js',
    '.svgorc.json',
    '.svgorc.yaml',
    '.svgorc.yml',
    'svgo.config.js',
    '.svgo.yml',
  ],
  transform: (result) => result && result.config,
  cache: true,
})

const getSvgoConfigFromSvgrConfig = (config: Config): SvgoOptions => {
  const params = { overrides: {} as any }
  if (config.icon || config.dimensions === false) {
    params.overrides.removeViewBox = false
  }

  return {
    plugins: [
      {
        name: 'preset-default',
        params,
      },
      'prefixIds',
    ],
  }
}

export const getSvgoConfig = (config: Config, state: State): SvgoOptions => {
  const cwd = state.filePath || process.cwd()
  if (config.svgoConfig) return config.svgoConfig
  if (config.runtimeConfig) {
    const userConfig = explorer.search(cwd)
    if (userConfig) return userConfig.config
  }
  return getSvgoConfigFromSvgrConfig(config)
}
