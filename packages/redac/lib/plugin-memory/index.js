
export default ({config}) => {
  if (!Array.isArray(config.documents)) {
    throw Error(`REDAC_MEMORY_INVALID_DOCUMENTS_ARGUMENTS: config must contain an array of documents, got ${JSON.stringify(config.documents)}.`)
  }
  return {
    source: async () => {
      return config.documents
    }
  }
}
