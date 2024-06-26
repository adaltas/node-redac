import fs from 'node:fs/promises'
import { glob } from 'glob'
import each from 'each'

export default async function pluginMdxLoad(plugin) {
  const {
    config: { target, pattern },
  } = plugin
  // Discover all documents
  let documents = await glob(pattern, {
    cwd: target,
    nodir: true,
    stat: true,
    withFileTypes: true,
  }).then((documents) =>
    // Path normalization and modified time
    documents.map((document) => ({
      path_absolute: document.fullpath(),
      path_relative: document.relative(),
      stat: {
        mtime: document.mtime,
      },
    }))
  )
  // Create a map containing new document keys
  const documents_in_cache = new Map()
  plugin.cache?.documents.map((document) =>
    documents_in_cache.set(
      `${document.path_absolute}|${document.stat.mtime}`,
      document
    )
  )
  // Read document from cache or file system
  documents = await each(documents, async (document) => {
    // Check if document is stored in cache
    const docFromCache = documents_in_cache.get(
      `${document.path_absolute}|${document.stat.mtime.getTime()}`
    )
    if (docFromCache) {
      return docFromCache
    }
    // Otherwise read the document
    return {
      ...document,
      cache: false,
      value: await fs.readFile(document.path_absolute),
    }
  })
  // Sort document by paths
  plugin.documents = documents.sort((a, b) =>
    a.path_absolute > b.path_absolute ? 1 : -1
  )
  return plugin
}
