import each from 'each'
import { merge } from 'mixme'
import { unified } from 'unified'
import parse from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import extractFrontmatter from 'remark-extract-frontmatter'
import yaml from 'yaml'
import stringify from 'remark-stringify'
import tableOfContent from 'remark-table-of-content'
import titleToFrontmatter from 'remark-title-to-frontmatter'

export default async function pluginMdxParse(plugin) {
  const { documents } = plugin
  plugin.documents = await each(documents, async (document) => {
    const { value, data, toc } = await unified()
      .use(parse)
      .use(stringify)
      .use(frontmatter)
      .use(extractFrontmatter, { yaml: yaml.parse, throws: true }) // Create file.data property
      .use(titleToFrontmatter)
      .use(tableOfContent, { depth_min: 2, depth_max: 3 })
      // .use(removeFrontmatter)
      // .use(imagesPath, options.images_path)
      .process(document.content_raw)
    return merge(document, {
      content_md: value,
      data: data,
      toc: toc,
    })
  })
  return plugin
}
