

import sort from '../plugin-mdx/3.sort.js'

export default ({config}) => {
  if (!Array.isArray(config.documents)) {
    throw Error(`REDAC_MEMORY_INVALID_DOCUMENTS_ARGUMENTS: config must contain an array of documents, got ${JSON.stringify(config.documents)}.`)
  }
  return {
    source: async () => {
      return sort({documents: config.documents})
    }
  }
}
