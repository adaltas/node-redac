import fs from "node:fs/promises"
import path from "path"

export default async function pluginYamlNormalize(plugin) {
  let { config } = plugin
  // Convert string to target
  if(typeof plugin.config === "string" ){
    plugin.config = config = { target: plugin.config }
  }
  // Default values
  config.pattern = config.pattern ?? "**/*.y?(a)ml"
  config.target = config.target ?? process.cwd()
  // Discover the file type, only directories search for yaml files
  const stat = await fs.lstat(config.target)
  if (stat.isDirectory()) {
    config.is_directory = true
    config.collection = config.collection ?? path.basename(config.target)
  } else if (stat.isFile()) {
    config.is_directory = false
    if (config.collection == null) {
      const ext = path.extname(config.target)
      if (ext === '.yaml' || ext === '.yml') {
        config.collection = path.basename(config.target).slice(0, -ext.length)
      } else {
        config.collection = path.basename(config.target)
      }
    }
  } else {
    throw Error('REDAC_YAML_INVALID_TARGET_ARGUMENTS: target must be a file or a directory.')
  }
  return plugin
}
