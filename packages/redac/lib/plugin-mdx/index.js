import step_1_normalize from './1.normalize.js'
import step_2_load from './2.load.js'
import step_3_enrich from './3.enrich.js'
import step_4_parse from './4.parse.js'
import step_5_overload from './5.overload.js'

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
        `REDAC_MDX_INVALID_ARGUMENTS: plugin config must be an object or a string, got ${JSON.stringify(
          config
        )}.`
      )
    }
  })
}

export default (config) => {
  const configs = [...getConfigs(config)]
  return {
    module: 'redac/plugins/mdx',
    hooks: {
      'engine:init': ({ engine }) => {
        engine.mdx = (config) => {
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
              .then(step_4_parse)
              .then(step_5_overload)
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
  step_4_parse as parse,
  step_5_overload as overload,
}
