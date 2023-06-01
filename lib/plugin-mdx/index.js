
import step_1_normalize from './1.normalize.js'
import step_1_source from './1.source.js'
import step_2_enrich from './2.enrich.js'
import step_4_parse from './4.parse.js'

export default ({config}) => {
  return {
    source: async () => {
      let plugin = await step_1_normalize({config})
      plugin = step_1_source(plugin)
      plugin = step_2_enrich(plugin)
      plugin = await step_4_parse(plugin)
      return plugin.documents
    }
  }
}
