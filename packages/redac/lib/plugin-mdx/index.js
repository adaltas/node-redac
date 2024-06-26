import each from 'each'
import step_1_normalize from './1.normalize.js'
import step_2_cache_read from './2.cache_read.js'
import step_3_load from './3.load.js'
import step_4_enrich from './4.enrich.js'
import step_5_parse from './5.parse.js'
import step_6_overload from './6.overload.js'
import step_7_cache_write from './7.cache_write.js'

const getConfigs = (config) => {
  if (config == null) return []
  if (!Array.isArray(config)) config = [config]
  return config.map((config) => {
    if (typeof config === 'string') {
      return {
        target: config,
      }
    } else if (config !== null && typeof config === 'object') {
      return config
    } else {
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
      'engine:source': async ({ documents }) =>
        each(configs, true, async (config) => {
          const docs = await Promise.resolve({ config })
            .then(step_1_normalize)
            .then(step_2_cache_read)
            .then(step_3_load)
            .then(step_4_enrich)
            .then(step_5_parse)
            .then(step_6_overload)
            .then(step_7_cache_write)
            .then(({ documents }) => documents)
          documents.push(...docs)
        }),
    },
  }
}

export {
  step_1_normalize as normalize,
  step_2_cache_read as cache_read,
  step_3_load as load,
  step_4_enrich as enrich,
  step_5_parse as parse,
  step_6_overload as overload,
  step_7_cache_write as cache_write,
}
