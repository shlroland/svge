import type { Config, State } from '@svge/core'
import { transform } from '@svge/core'
import fs from 'fs-extra'
import chalk from 'chalk'
import dashify from 'dashify'
import camelcase from 'camelcase'
import type { FilenameCase } from './types'

export const convert = (
  code: string,
  config: Config,
  state: Partial<State>,
): string => {
  return transform.sync(code, config, {
    ...state,
  })
}

export const convertFile = async (
  filePath: string,
  config: Config = {},
): Promise<string> => {
  const code = await fs.readFile(filePath, 'utf-8')
  return convert(code, config, { filePath })
}

export const exitError = (error: string): never => {
  console.error(chalk.red(error))
  process.exit(1)
}

export const transformFilename = (
  filename: string,
  filenameCase: FilenameCase,
) => {
  switch (filenameCase) {
    case 'kebab': {
      return dashify(filename.replace(/_/g, '-'), { condense: true })
    }
    case 'camel': {
      return camelcase(filename)
    }
    case 'pascal':
      return camelcase(filename, { pascalCase: true })
    default:
      throw new Error(`Unknown --filename-case ${filenameCase}`)
  }
}

export const politeWrite = (data: string, silent?: boolean): void => {
  if (!silent) {
    process.stdout.write(data)
  }
}

export const formatExportName = (name: string): string => {
  if (/[-]/g.test(name) && /^\d/.test(name)) {
    return `Svg${camelcase(name, { pascalCase: true })}`
  }

  if (/^\d/.test(name)) {
    return `Svg${name}`
  }

  return camelcase(name, { pascalCase: true })
}
