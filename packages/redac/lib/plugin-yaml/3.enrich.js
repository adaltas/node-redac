import fs from 'node:fs/promises'
import { parse } from 'yaml'
import path from 'path'
import { glob } from 'glob'
import each from 'each'

export default function pluginYamlEnrich(plugin) {
  const { config, documents } = plugin
  plugin.documents = documents.map((document) => {
    // If target is a file, extract collection and lang from target name
    if (!config.is_directory) {
      const elements = path.basename(config.target).split('.')
      const [collection, lang] = elements
      return {
        ...document,
        collection: collection,
        lang: lang,
        sort: '',
        slug: [],
      }
    }
    document.collection = config.collection
    // Convert string path to slug elements
    const slug = document.path_relative.split(path.sep)
    let lastSlugElements = slug[slug.length - 1].split('.')
    let lang = undefined
    // Remove extension
    lastSlugElements.pop()
    let isIndex = false
    if (lastSlugElements.length < 3 && lastSlugElements[0] === 'index') {
      // Filename is `index.<ext>` or `index.<lang>.<ext>`
      isIndex = true
      // Language in `index.{lang}.ext`
      if (lastSlugElements.length === 2) {
        lang = lastSlugElements[1]
      }
      // Remove index to get the final slug
      slug.pop()
      // Treat root dir
      if (slug.length === 0) {
        return {
          ...document,
          lang: lang,
          sort: '',
          slug: slug,
        }
      }
      // Recompute filename
      lastSlugElements = slug[slug.length - 1].split('.')
    }
    // Extract sorting key
    const sort = lastSlugElements.join('.')
    if (/^\d+$/.test(lastSlugElements[0])) {
      lastSlugElements.shift()
    }
    // Language in `{name}.{lang}.ext`
    if (!isIndex && lastSlugElements.length > 1) {
      lang = lastSlugElements.pop()
    }
    slug[slug.length - 1] = lastSlugElements.join('.')
    // Normalize parent slug
    slug.slice(0, slug.length - 1).map((element, i) => {
      const elements = element.split('.')
      if (/^\d+$/.test(elements[0])) {
        elements.shift()
        slug[i] = elements.join('.')
      }
    })
    return {
      ...document,
      lang: lang,
      sort: sort,
      slug: slug,
    }
  })
  return plugin
}
