import type { Plugin } from '@svge/core'
import * as deepmerge from 'deepmerge'
import { format, resolveConfig } from 'prettier'

export const prettierPlugin: Plugin = (code, config, state) => {
  if (!config.prettier) return code
  const filePath = state.filePath || process.cwd()

  const prettierRcConfig = config.runtimeConfig
    ? resolveConfig.sync(filePath, { editorconfig: true })
    : {}

  return format(
    code,
    deepmerge.all([
      { parser: 'babel' },
      prettierRcConfig || {},
      config.prettierConfig || {},
    ]),
  )
}
