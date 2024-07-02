import fs from 'node:fs/promises'
import path from 'path'
import { glob } from 'glob'
import each from 'each'

export default async function pluginMdxLoad(plugin) {
  const {
    config: { target, pattern },
  } = plugin
  let documents = await glob(pattern, { cwd: target })
  documents = await each(documents, async (file) => ({
    value: await fs.readFile(path.resolve(target, file)),
    path_absolute: path.resolve(target, file),
    path_relative: file,
  }))
  plugin.documents = documents.sort((a, b) =>
    a.path_absolute > b.path_absolute ? 1 : -1
  )
  return plugin
}
