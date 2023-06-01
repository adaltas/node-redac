
import { merge } from "mixme"
import step_1_normalize from './1.normalize.js'
import step_2_load from './2.load.js'
import step_3_enrich from './3.enrich.js'

export default ({config}) => {
  return {
    source: async () => {
      const plugin = await step_1_normalize({config})
      plugin = await step_2_load(plugin)
      plugin = await step_3_enrich(plugin)
      return plugin.documents
    }
  }
}
