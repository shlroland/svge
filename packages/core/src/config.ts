import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig'
import type { Options as PrettierOptions } from 'prettier'
import type { OptimizeOptions as SvgoOptions } from 'svgo'
import type { ConfigPlugin } from './plugin'
import type { State } from './state'

export interface Config {
  ref?: boolean
  titleProp?: boolean
  descProp?: boolean
  configFile?: string
  runtimeConfig?: boolean
  plugins?: ConfigPlugin[]
  dimensions?: boolean
  icon?: boolean | string | number
  svgo?: boolean
  svgoConfig?: SvgoOptions
  prettier?: boolean
  prettierConfig?: PrettierOptions
}

export const DEFAULT_CONFIG: Config = {
  ref: false,
  titleProp: false,
  descProp: false,
  runtimeConfig: true,
  dimensions: true,
  svgo: true,
  icon: false,
  prettier: true,
}

const explorer = cosmiconfig('svge')
const explorerSync = cosmiconfigSync('svge')

export const resolveConfig = async (
  searchFrom?: string,
  configFile?: string,
): Promise<Config | null> => {
  if (configFile == null) {
    const result = await explorer.search(searchFrom)
    return result ? result.config : null
  }
  const result = await explorer.load(configFile)
  return result ? result.config : null
}

resolveConfig.sync = (
  searchFrom?: string,
  configFile?: string,
): Config | null => {
  if (configFile == null) {
    const result = explorerSync.search(searchFrom)
    return result ? result.config : null
  }
  const result = explorerSync.load(configFile)
  return result ? result.config : null
}

export const loadConfig = async (
  { configFile, ...baseConfig }: Config,
  state: Pick<State, 'filePath'> = {},
): Promise<Config> => {
  const rcConfig =
    state.filePath && baseConfig.runtimeConfig !== false
      ? await resolveConfig(state.filePath, configFile)
      : {}
  return { ...DEFAULT_CONFIG, ...rcConfig, ...baseConfig }
}

loadConfig.sync = (
  { configFile, ...baseConfig }: Config,
  state: Pick<State, 'filePath'> = {},
): Config => {
  const rcConfig =
    state.filePath && baseConfig.runtimeConfig !== false
      ? resolveConfig.sync(state.filePath, configFile)
      : {}
  return { ...DEFAULT_CONFIG, ...rcConfig, ...baseConfig }
}
