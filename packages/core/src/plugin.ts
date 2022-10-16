import type { Config } from './config'
import type { State } from './state'

export interface Plugin {
  (code: string, config: Config, state: State): string
}

export type ConfigPlugin = string | Plugin

const DEFAULT_PLUGINS: Plugin[] = []

export const getPlugins = (config: Config): ConfigPlugin[] => {
  if (config.plugins) {
    return config.plugins
  }

  return DEFAULT_PLUGINS
}

export const resolvePlugin = (plugin: ConfigPlugin): Plugin => {
  if (typeof plugin === 'function') {
    return plugin
  }

  if (typeof plugin === 'string') {
    return loadPlugin(plugin)
  }

  throw new Error(`Invalid plugin "${plugin}"`)
}

const pluginCache: Record<string, Plugin> = {}

const resolveModule = (m: any) => (m ? m.default || m : null)

export function loadPlugin(moduleName: string): Plugin {
  if (pluginCache[moduleName]) {
    return pluginCache[moduleName]
  }

  try {
    const plugin = resolveModule(require(moduleName))
    if (!plugin) {
      throw new Error(`Invalid plugin "${moduleName}"`)
    }
    pluginCache[moduleName] = plugin
    return pluginCache[moduleName]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(
      `Module "${moduleName}" missing. Maybe \`npm install ${moduleName}\` could help!`,
    )
  }
}
