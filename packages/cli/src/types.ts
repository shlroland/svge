import type { Config } from '@svge/core'
import type { Command } from 'commander'

export interface IndexTemplate {
  (paths: string[]): string
}

export interface Options extends Config {
  stdin?: boolean
  stdinFilepath?: string
  filenameCase?: FilenameCase
  ignoreExisting?: boolean
  silent?: boolean
  configFile?: string
  outDir?: string
  indexTemplate?: IndexTemplate
}

export type CommandFunc = (
  opts: Options,
  program: Command,
  filenames: string[],
) => Promise<void>

export type FilenameCase = 'kebab' | 'camel' | 'pascal'
