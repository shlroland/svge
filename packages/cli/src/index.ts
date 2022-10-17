/* eslint-disable no-console */
import { program } from 'commander'
import { glob } from 'glob'
import * as fs from 'fs-extra'
import * as R from 'ramda'
import { loadConfig } from '@svge/core'
import { version } from '../package.json'
import { fileCommand } from './fileCommand'
import type { Options } from './types'

program
  .version(version)
  .usage('[options] <file|directory>')
  .option('--config-file <file>', 'specify the path of the svgr config')
  .option('-d, --out-dir <dirname>', 'output files into a directory')

program.on('--help', () => {
  console.log(`
    Examples:
      svgr --replace-attr-values "#fff=currentColor" icon.svg
  `)
})

program.parse(process.argv)

async function run() {
  const errors: string[] = []
  const filenames = program.args.reduce((globbed, input) => {
    let files = glob.sync(input)
    if (!files.length) files = [input]
    return [...globbed, ...files]
  }, [] as string[])

  await Promise.all(
    filenames.map(async (filename) => {
      try {
        await fs.stat(filename)
      } catch (error) {
        errors.push(`${filename} does not exist`)
      }
    }),
  )

  if (errors.length) {
    console.error(errors.join('. '))
    process.exit(2)
  }

  const programOpts = R.reject(R.isNil)(program.opts<Options>())
  const opts: Options = await loadConfig(programOpts, {
    filePath: process.cwd(),
  })
  const command = fileCommand

  await command(opts, program, filenames)
}

run().catch((error) => {
  setTimeout(() => {
    throw error
  })
})
