import step_1_normalize from './1.normalize.js'
import step_2_load from './2.load.js'
import step_3_enrich from './3.enrich.js'

export default ({ config }) => {
  return {
    source: async () =>
      step_1_normalize({ config })
        .then(step_2_load)
        .then(step_3_enrich)
        .then(({ documents }) => documents),
  }
}

export {
  step_1_normalize as normalize,
  step_2_load as load,
  step_3_enrich as enrich,
}
