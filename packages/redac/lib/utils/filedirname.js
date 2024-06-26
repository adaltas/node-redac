import path from 'node:path'
import { fileURLToPath } from 'url'

const dirname = (imp) => {
  return path.dirname(fileURLToPath(imp.meta.url))
}

const filename = (imp) => {
  throw Error('Not yet implemented')
}

export { dirname, filename }
