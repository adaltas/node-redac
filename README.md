
# Redac

Redac is a content authoring library to source content into your website. The library handles Markdown, MDX, Yaml files by default.

## Installation

Redac is only available as an ESM package for now. Please drop a feature request if you desire a CommonJS version.

Install the dependency into your package using your favorite package manager.

```
npm install redac
```

## Documentation

- [Dataset model](./docs/1.model.md)
- [Engine initialisation](./docs/2.initialisation.md)
- [Querying the dataset](./docs/3.query.md)
- [Plugin "mdx"](./docs/plugins/mdx.md)
- [Plugin "yaml"](./docs/plugins/yaml.md)

## Usage

Import the `redac` package, source some data and start querying your dataset.

Short form:

```js
// Import the redac package
import redac from 'redac'
// Initializethe engine
const articles = await redac
  // Source Markdown documents
  .mdx('./articles')
  // Start querying
  .from('articles')
  .filter( document => document.lang === 'fr')
  .list()
```

Long form:

```js
// Import the redac package
import redac from 'redac'
// Initialize the engine
const engine = redac([
  // Source Markdown documents
  {
    module: 'redac/plugins/mdx',
    config: './articles',
  },
  // Source Yaml documents
  {
    module: 'redac/plugins/yaml',
    config: './tags',
  },
])
// Start querying
const articles = await engine
  .from('articles')
  .filter((document) => document.lang === 'fr')
  .list()
```

[Next.js](https://nextjs.org/) integration with [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote).

```jsx
import 'server-only'
import redac from 'redac'
import mdx from 'redac/plugins/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import components from '@/mdx/components/index.js'
import rehype from '/src/mdx/rehype.js'
import remark from '/src/mdx/remark.js'
import recma from '/src/mdx/recma.js'

export default async function Page({ params }) {
  const page = await redac([
    {
      module: mdx,
      config: './docs',
    },
  ])
    .from('pages')
    .map(page => ({
      ...page,
      lang: page.lang || 'en'
    }))
    .filter(
      (page) =>
        page.lang === params.lang &&
        JSON.stringify(page.slug) === JSON.stringify(params.slug)
    )
    .get()
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{page.data.title}</h1>
      <MDXRemote
        source={page.content_md}
        components={components}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: remark,
            rehypePlugins: rehype,
            recmaPlugins: recma,
            format: 'mdx',
          }
        }}
      />
    </div>
  )
}
```
