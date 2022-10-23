import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import type { CommandFunc, FilenameCase } from './types'
import { convertFile, politeWrite, transformFilename } from './utils'

const exists = async (filepath: string) => {
  try {
    await fs.access(filepath)
    return true
  } catch (error) {
    return false
  }
}

const rename = (relative: string, filenameCase: FilenameCase) => {
  const relativePath = path.parse(relative)
  relativePath.ext = `.vue`
  relativePath.base = ''
  relativePath.name = transformFilename(relativePath.name, filenameCase)
  return path.format(relativePath)
}

export const dirCommand: CommandFunc = async (options, _, filenames) => {
  const { filenameCase = 'pascal', ignoreExisting, silent, outDir } = options

  const handle = async (filename: string, root: string) => {
    const stats = await fs.stat(filename)

    const write = async (src: string, dest: string) => {
      if (!isCompilable(src)) {
        return { transformed: false, dest: null }
      }

      dest = rename(dest, filenameCase)
      const code = await convertFile(src, options)
      const cwdRelative = path.relative(process.cwd(), dest)
      const logOutput = `${src} -> ${cwdRelative}\n`

      if (ignoreExisting && (await exists(dest))) {
        politeWrite(chalk.grey(logOutput), silent)
        return { transformed: false, dest }
      }

      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.writeFile(dest, code)
      politeWrite(chalk.white(logOutput), silent)
      return { transformed: true, dest }
    }

    if (stats.isDirectory()) {
      return { transformed: false, dest: null }
    }

    const dest = path.resolve(outDir as string, path.relative(root, filename))
    return write(filename, dest).catch((err) => {
      console.error('Failed to handle file: ', filename)
      throw err
    })
  }

  await Promise.all(
    filenames.map(async (file) => {
      const stats = await fs.stat(file)
      const root = stats.isDirectory() ? file : path.dirname(file)
      await handle(file, root)
    }),
  )
}

export function isCompilable(filename: string): boolean {
  const ext = path.extname(filename)
  return ext === '.svg' || ext === '.SVG'
}
