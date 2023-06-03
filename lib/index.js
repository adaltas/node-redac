import each from 'each'
import collection from './collection.js'
import sort from './utils/sort.js'

const source = async (plugins) => {
  const documents = []
  for (const plugin of await plugins){
    if(plugin.module.source) {
      documents.push(...await plugin.module.source())
    }
  }
  const collections = {}
  // Group by collection
  documents.forEach((document) => {
    if (!collections[document.collection]) {
      collections[document.collection] = []
    }
    collections[document.collection].push(document)
  });
  // Sort collections
  for (const name in collections) {
    collections[name] = sort(collections[name])
  }
  return collections
}

export default function engine(plugins=[]) {
  // Configuration normalization
  if (!Array.isArray(plugins)) plugins = [plugins]
  plugins = plugins.map((plugin) => {
    if (Array.isArray(plugin)) {
      return {
        module: plugin[0],
        config: plugin[1]
      }
    } else if(plugin !== null && typeof plugin === 'object') {
      return plugin
    } else {
      throw Error(`REDAC_INVALID_ARGUMENTS: plugin config must be an object, an array or a string, got ${JSON.stringify(plugin)}.`)
    }
  })
  // Load and initialize the plugin with its configuration
  plugins = each(plugins, async (plugin) => {
    if (typeof plugin.module === 'string') {
      const module = await import(plugin.module)
      plugin.module = module.default(plugin)
    }else if (typeof plugin.module === 'function'){
      plugin.module = plugin.module(plugin)
    }
    return plugin
  })
  // Load the engine
  const engine = {
    db: () => source(plugins),
    from: (name) => collection(engine, name),
  }
  return engine
}

engine.mdx = (config) => {
  if (typeof config === 'string') {
    config = {
      module: 'redac/plugins/mdx',
      config: {
        target: config
      }
    }
  } else if (config !== null && typeof config === 'object') {
    config = {
      module: 'redac/plugins/mdx',
      config: config
    }
  } else {
    throw Error(`REDAC_MDX_INVALID_ARGUMENTS: plugin config must be an object or a string, got ${JSON.stringify(config)}.`)
  }
  return engine(config)
}

engine.memory = (config) => {
  if (Array.isArray(config)) {
    config = {
      module: 'redac/plugins/memory',
      config: {
        documents: config
      }
    }
  } else if (config !== null && typeof config === 'object') {
    config = {
      module: 'redac/plugins/memory',
      config: config
    }
  } else {
    throw Error(`REDAC_MEMORY_INVALID_ARGUMENTS: plugin config must be an object, got ${JSON.stringify(config)}.`)
  }
  return engine(config)
}

engine.yaml = (config) => {
  if (typeof config === 'string') {
    config = {
      module: 'redac/plugins/yaml',
      config: {
        target: config
      }
    }
  } else if (config !== null && typeof config === 'object') {
    config = {
      module: 'redac/plugins/yaml',
      config: {
        target: config.target
      }
    }
  } else {
    throw Error(`REDAC_YAML_INVALID_ARGUMENTS: plugin config must be an object or a string, got ${JSON.stringify(config)}.`)
  }
  return engine(config)
}
