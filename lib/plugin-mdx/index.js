
import step_1_source from './1.source.js'
import step_2_enrich from './2.enrich.js'
import step_3_sort from './3.sort.js'
import step_4_parse from './4.parse.js'

export default ({config}) => {
  return {
    source: async () => {
      let documents = await step_1_source({config})
      documents = step_2_enrich({documents})
      documents = step_3_sort({documents})
      documents = await step_4_parse({documents})
      return documents
    }
  }
}
