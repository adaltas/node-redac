import step_1_normalize from './1.normalize.js'
import step_2_load from './2.load.js'
import step_3_enrich from './3.enrich.js'
const getConfigs = (config) => {
  if(config == null) return []
  if(!Array.isArray(config)) config = [config]
  return config.map( config => {
    if (typeof config === 'string') {
      return {
        target: config,
      }
    } else if (config === null || typeof config !== 'object') {
      throw Error(
        `REDAC_YAML_INVALID_ARGUMENTS: plugin config must be an object or a string, got ${JSON.stringify(
          config
        )}.`
      )
    }
  })
}

export default (config) => {
  const configs = [...getConfigs(config)]
  return {
    module: 'redac/plugins/memory',
    hooks: {
      'engine:init': ({ engine }) => {
        engine.yaml = (config) => {
          // Additionnal documents source
          configs.push(...getConfigs(config))
          return engine
        }
      },
      'engine:source': async ({documents}) => {
        configs.forEach( config => {
          docs = async () =>
            step_1_normalize({ config })
              .then(step_2_load)
              .then(step_3_enrich)
              .then(({ documents }) => documents)
          documents.push(...docs)
        })
      }
    }
  }
}

export {
  step_1_normalize as normalize,
  step_2_load as load,
  step_3_enrich as enrich,
}
