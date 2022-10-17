import * as fs from 'fs-extra'
import type { CommandFunc } from './types'
import { convert, convertFile, exitError } from './utils'

const readStdin = async () => {
  return new Promise<string>((resolve) => {
    let code = ''
    process.stdin.setEncoding('utf-8')
    process.stdin.on('readable', () => {
      const chunk = process.stdin.read()
      if (chunk !== null) code += chunk
    })
    process.stdin.on('end', () => {
      resolve(code)
    })
  })
}

export const fileCommand: CommandFunc = async (opts, program, filenames) => {
  if (opts.stdin || (filenames.length === 0 && !process.stdin.isTTY)) {
    const input = await readStdin()
    const output = convert(input, opts, { filePath: opts.stdinFilepath })
    process.stdout.write(`${output}\n`)
    return
  }

  if (filenames.length === 0) {
    process.stdout.write(`${program.helpInformation()}\n`)
    return
  }

  if (filenames.length > 1) {
    exitError('Please specify only one filename or use `--out-dir` option.')
  }

  const [filename] = filenames
  const stats = await fs.stat(filename)

  if (stats.isDirectory()) {
    exitError('Directory are not supported without `--out-dir` option instead.')
  }

  const output = await convertFile(filename, opts)
  process.stdout.write(`${output}\n`)
}
