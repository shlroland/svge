import { parse as parsePath } from 'node:path'
// @ts-expect-error ignore export =
import camelCase from 'camelcase'

export interface State {
  filePath?: string
  componentName: string
}

const VALID_CHAR_REGEX = /[^a-zA-Z0-9 _-]/g

const getComponentName = (filePath?: string): string => {
  if (!filePath) return 'SvgComponent'
  const pascalCaseFileName = camelCase(
    parsePath(filePath).name.replace(VALID_CHAR_REGEX, ''),
    {
      pascalCase: true,
    },
  )
  return `Svg${pascalCaseFileName}`
}

export const expandState = (state: Partial<State>): State => {
  return {
    componentName: state.componentName || getComponentName(state.filePath),
    ...state,
  }
}
