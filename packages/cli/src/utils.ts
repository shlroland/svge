import type { Config, State } from '@svge/core'
import { transform } from '@svge/core'
import * as fs from 'fs-extra'
import chalk from 'chalk'

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
