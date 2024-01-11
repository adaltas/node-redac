import each from 'each'
import { plugandplay } from 'plug-and-play'
import collection from './collection.js'
import sort from './utils/sort.js'

export default function engine(plugins = []) {
  // Configuration normalization
  if (!Array.isArray(plugins)) plugins = [plugins]
  plugins = plugins.map( (plugin) => {
    if (typeof plugin === 'function' ) {
      return plugin()
    } else if (plugin !== null && typeof plugin === 'object') {
      if(typeof plugin.plugin === 'function'){
        return plugin.plugin.call(null, plugin.config)
      } else if (plugin.plugin !== null && typeof plugin.plugin === 'object') {
        return plugin.plugin
      } else {
        `REDAC_INVALID_ARGUMENTS: plugin config must be an object or a function, got ${JSON.stringify(
          plugin
        )}.`
      }
    } else {
      throw Error(
        `REDAC_INVALID_ARGUMENTS: plugin config must be an object, an array or a string, got ${JSON.stringify(
          plugin
        )}.`
      )
    }
  })
  // Load the engine
  const engine = {
    plugins: plugandplay({
      plugins: plugins
    }),
    db: async () => {
      const documents = []
      await engine.plugins.call({
        // Identify this hook with a name
        name: 'engine:source',
        // Expose arguments to plugins authors
        args: { documents },
        // Default implementation
        handler: ({ documents }) => {
          // Use the source hook to discover and return documents
        }
      });
      const collections = {}
      // Group by collection
      documents.forEach((document) => {
        if (!collections[document.collection]) {
          collections[document.collection] = []
        }
        collections[document.collection].push(document)
      })
      // Sort collections
      for (const name in collections) {
        collections[name] = sort(collections[name])
      }
      return collections
    },
    from: (name) => collection(engine, name),
  }
  engine.plugins.call({
    // Identify this hook with a name
    name: 'engine:init',
    // Expose arguments to plugins authors
    args: { engine },
    // Default implementation
    handler: ({engine}) => {
      // Use the init hook to register properties to engine
    }
  });
  return engine
}
