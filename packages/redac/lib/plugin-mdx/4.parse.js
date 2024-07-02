import each from 'each'
import { merge } from 'mixme'
import { remark } from 'remark'
import mdx from 'remark-mdx'
import frontmatter from 'remark-frontmatter'
import extractFrontmatter from 'remark-extract-frontmatter'
import yaml from 'yaml'
import tableOfContent from 'remark-table-of-content'
import titleToFrontmatter from 'remark-title-to-frontmatter'
import { visit } from 'unist-util-visit'
import path from 'node:path'

const imageSrc = ({ document, config }) => {
  return async (ast) => {
    if (!config.image_src) {
      return
    }
    const nodes = []
    visit(ast, 'image', async function (node) {
      if (typeof config.image_src === 'function') {
        nodes.push(node)
      } else if (node.url.startsWith('/')) {
        node.url = path.join('/', document.collection, node.url)
      } else if (node.url.startsWith('.')) {
        node.url = path.resolve(
          path.join(
            '/',
            document.collection,
            path.dirname(document.path_relative)
          ),
          node.url
        )
      }
    })
    await each(nodes, async (node) => {
      node.url = await config.image_src.call(null, {
        config: config,
        document: document,
        node: node,
      })
    })
  }
}

export default async function pluginMdxParse(plugin) {
  const { documents, config } = plugin
  plugin.documents = await each(documents, async (document) => {
    const { value, data, toc } = await remark()
      .use(mdx)
      .use(frontmatter)
      .use(extractFrontmatter, { yaml: yaml.parse, throws: true }) // Create file.data property
      .use(titleToFrontmatter)
      .use(tableOfContent, { depth_min: 2, depth_max: 3 })
      .use(imageSrc, { document: document, config })
      .process(document.value)
    return merge(document, {
      value: value,
      data: data,
      toc: toc,
    })
  })
  return plugin
}
