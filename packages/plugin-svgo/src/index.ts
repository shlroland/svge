import { optimize } from 'svgo'
import type { Plugin } from '@svge/core'
import { getSvgoConfig } from './config'

export const svgoPlugin: Plugin = (code, config, state) => {
  if (!config.svgo) return code
  const svgoConfig = getSvgoConfig(config, state)
  const result = optimize(code, { ...svgoConfig, path: state.filePath })

  if (result.modernError) {
    throw result.modernError
  }

  return result.data
}
