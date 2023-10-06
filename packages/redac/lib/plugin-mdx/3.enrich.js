import path from 'path'

export default function pluginMdxEnrich(plugin) {
  const { config, documents } = plugin
  plugin.documents = documents.map((document) => {
    // Convert string path to slug elements
    if (config.uber) {
      const [collection, ...slug] = document.path_relative.split(path.sep)
      document.slug = slug
      document.collection = collection
    } else {
      document.slug = document.path_relative.split(path.sep)
      document.collection = config.collection
    }
    let lastSlugElements = document.slug[document.slug.length - 1].split('.')
    let lang = undefined
    // Remove extension
    lastSlugElements.pop()
    let isIndex = false
    // dirname versus filename
    if (lastSlugElements.length < 3 && lastSlugElements[0] === 'index') {
      isIndex = true
      // Language in `index.{lang}.ext`
      if (lastSlugElements.length === 2) {
        lang = lastSlugElements[1]
      }
      document.slug.pop()
      // Treat root dir
      if (document.slug.length === 0) {
        return {
          ...document,
          lang: lang,
          // sort [collection]
          sort: '',
          // slug: slug,
        }
      }
      lastSlugElements = document.slug[document.slug.length - 1].split('.')
    }
    // Extract sorting key
    // const sort = [collection, ...slug.slice(0, slug.length - 1), lastSlugElements.join('.')]
    const sort = lastSlugElements.join('.')
    if (/^\d+$/.test(lastSlugElements[0])) {
      lastSlugElements.shift()
    }
    // Language in `{name}.{lang}.ext`
    if (!isIndex && lastSlugElements.length > 1) {
      lang = lastSlugElements.pop()
    }
    document.slug[document.slug.length - 1] = lastSlugElements.join('.')
    // Normalize parent slug
    document.slug.slice(0, document.slug.length - 1).map((element, i) => {
      const elements = element.split('.')
      if (/^\d+$/.test(elements[0])) {
        elements.shift()
        document.slug[i] = elements.join('.')
      }
    })
    return {
      ...document,
      lang: lang,
      sort: sort,
      // slug: slug,
    }
  })
  return plugin
}
