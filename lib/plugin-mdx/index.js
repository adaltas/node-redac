
import step_1_normalize from './1.normalize.js'
import step_2_load from './2.load.js'
import step_3_enrich from './3.enrich.js'
import step_4_parse from './4.parse.js'

export default ({config}) => {
  return {
    source: async () =>
      step_1_normalize({config})
      .then(step_2_load)
      .then(step_3_enrich)
      .then(step_4_parse)
      .then(({documents}) => documents)
  }
}

export {
  step_1_normalize as normalize,
  step_2_load as load,
  step_3_enrich as enrich,
  step_4_parse as parse,
}
