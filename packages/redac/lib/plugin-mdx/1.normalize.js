import fs from 'node:fs/promises'
import path from 'path'

export default async function pluginMdxNormalize(plugin) {
  let { config } = plugin
  // Convert string to target
  if (typeof plugin.config === 'string') {
    plugin.config = config = { target: plugin.config }
  }
  // Default values
  config.pattern = config.pattern ?? '**/*.md?(x)'
  config.target = config.target ?? process.cwd()
  config.uber = config.uber ?? false
  // Discover the file type, only directories search for yaml files
  const stat = await fs.lstat(config.target)
  if (stat.isDirectory()) {
    config.collection = config.collection ?? path.basename(config.target)
  } else {
    throw Error(
      'REDAC_MDX_INVALID_TARGET_ARGUMENTS: target must be a directory.'
    )
  }
  return plugin
}
