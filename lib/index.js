import each from 'each'
import collection from './collection.js'
import sort from './utils/sort.js'

const source = async (plugins) => {
  const documents = []
  for (const plugin of await plugins){
    if(plugin.source) {
      documents.push(...await plugin.source())
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
  plugins = each(plugins, async ({config, module}) => {
    const plugin = await import(module)
    return plugin.default({config})
  })
  // Load the engine
  const engine = {
    db: () => source(plugins),
    from: (name) => collection(engine, name),
  }
  return engine
}

engine.mdx = (configs) => {
  if (!Array.isArray(configs)) {
    configs = [configs]
  }
  configs = configs.map( config => {
    if (typeof config === 'string') {
      return {
        module: 'redac/plugins/mdx',
        config: {
          cwd: config
        }
      }
    } else if (config !== null && typeof config === 'object') {
      return {
        module: 'redac/plugins/mdx',
        config: config
      }
    } else {
      throw Error(`REDAC_MDX_INVALID_ARGUMENTS: plugin config must be an object or a string, got ${JSON.stringify(config)}.`)
    }
  })
  return engine(configs)
}

engine.memory = (configs) => {
  if (!Array.isArray(configs)) {
    configs = [configs]
  }
  configs = configs.map( config => {
    if (config !== null && typeof config === 'object') {
      return {
        module: 'redac/plugins/memory',
        config: config
      }
    } else {
      throw Error(`REDAC_MEMORY_INVALID_ARGUMENTS: plugin config must be an object, got ${JSON.stringify(config)}.`)
    }
  })
  return engine(configs)
}
