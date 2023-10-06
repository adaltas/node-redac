import fs from 'node:fs/promises'
import { parse } from 'yaml'
import path from 'path'
import { glob } from 'glob'
import each from 'each'

export default async function pluginYamlLoad(plugin) {
  const {
    config: { target, pattern, is_directory },
  } = plugin
  let documents = is_directory ? await glob(pattern, { cwd: target }) : [target]
  documents = await each(documents, async (file) => {
    const content = await fs.readFile(path.resolve(target, file))
    const data = parse(content.toString())
    return {
      data: data,
      path_absolute: path.resolve(target, file),
      path_relative: path.isAbsolute(file) ? path.relative(target, file) : file,
    }
  })
  plugin.documents = documents.sort((a, b) =>
    a.path_absolute > b.path_absolute ? 1 : -1
  )
  return plugin
}
