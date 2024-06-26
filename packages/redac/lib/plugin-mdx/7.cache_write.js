import fs from 'node:fs/promises'
import path from 'node:path'

export const serialize = (documents) =>
  'export default ' +
  JSON.stringify({
    mtime: Date.now(),
    documents: documents.map((document) => ({
      ...document,
      value: document.value.toString('utf-8'),
      cache: true,
    })),
  })

export default async function pluginMdxCacheWrite(plugin) {
  if (!plugin.config.cache.enabled) {
    return plugin
  }
  const module = path.resolve(process.cwd(), plugin.config.cache.module)
  await fs.mkdir(path.dirname(module), { recursive: true })
  await fs.writeFile(module, serialize(plugin.documents))
  return plugin
}
