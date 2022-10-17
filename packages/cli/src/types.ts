import type { Config } from '@svge/core'
import type { Command } from 'commander'

export interface Options extends Config {
  stdin?: boolean
  stdinFilepath?: string
}

export type CommandFunc = (
  opts: Options,
  program: Command,
  filenames: string[],
) => Promise<void>
