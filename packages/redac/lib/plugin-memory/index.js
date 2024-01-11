
const getConfigs = (config) => {
  if(config == null) return []
  if(!Array.isArray(config)) config = [config]
  return config.map( config => {
    if(config === null || typeof config !== 'object'){
      throw Error(
        `REDAC_MEMORY_INVALID_ARGUMENTS: plugin config must be an object, got ${JSON.stringify(
          config
        )}.`
      )
    }
    if (!Array.isArray(config.documents)) {
      throw Error(
        `REDAC_MEMORY_INVALID_DOCUMENTS_ARGUMENTS: config must contain an array of documents, got ${JSON.stringify(
          config.documents
        )}.`
      )
    }
    return config
  })
}

export default (config) => {
  const configs = [...getConfigs(config)]
  return {
    module: 'redac/plugins/mdx',
    hooks: {
      'engine:init': ({ engine }) => {
        engine.memory = (config) => {
          // Additionnal documents source
          configs.push(...getConfigs(config))
          return engine
        }
      },
      'engine:source': async ({documents}) => {
        configs.forEach( config => {
          documents.push(...config.documents)
        })
      }
    }
  }
}
