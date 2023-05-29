
import fs from 'node:fs/promises'
import path from 'path'
import {glob} from 'glob'
import each from 'each'
import {merge} from 'mixme'

export default async function pluginMdxSource ({config}) {
  config = typeof config === 'string'
  ? {cwd: config}
  : config
  const {cwd, pattern} = merge({cwd: process.cwd(), pattern: "**/*.md?(x)"}, config)
  let documents = await glob(pattern, {cwd: cwd})
  documents = await each(documents, async file => ({
    path_absolute: path.resolve(cwd, file),
    content_raw: await fs.readFile(path.resolve(cwd, file)),
    path_relative: file,
  }))
  documents = documents.sort( (a, b) => a.path_absolute > b.path_absolute ? 1 : -1)
  return documents
}
