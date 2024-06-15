
# Redac

Redac is a content authoring library to source content into your website. The library handles Markdown, MDX, Yaml files by default.

## Installation

Redac is only available as an ESM package for now. Please drop a feature request if you desire a CommonJS version.

Install the dependency into your package using your favorite package manager.

```
npm install redac
```

## Documentation

- [Dataset model](./content/docs/1.model.md)
- [Engine initialisation](./content/docs/2.initialisation.md)
- [Querying the dataset](./content/docs/3.query.md)
- [Plugin "mdx"](./content/docs/plugins/mdx.md)
- [Plugin "yaml"](./content/docs/plugins/yaml.md)

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
