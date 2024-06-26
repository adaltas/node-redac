import fs from 'node:fs/promises'
import path from 'node:path'

export default async function pluginMdxCacheRead(plugin) {
  let { config } = plugin
  if (!config.cache.enabled) {
    return plugin
  }
  const module = config.cache.module.startsWith('.')
    ? path.resolve(process.cwd(), config.cache.module)
    : config.cache.module
  plugin.cache = await import(module)
    .then((mod) => mod.default)
    .catch(async (err) => {
      if (
        err.code !== 'ERR_MODULE_NOT_FOUND' && // CommonJS
        err.code !== 'ERR_INVALID_MODULE_SPECIFIER' // ESM
      ) {
        await fs.unlink(module)
      }
      return { documents: [] }
    })
  return plugin
}
