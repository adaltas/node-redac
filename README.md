
# Redac

Redac is a content authoring library to source content into your website. The library handles Markdown, MDX, Yaml files by default.

## Installation

Redac is only available as an ESM package for now. Please drop a feature request if you desire a CommonJS version.

Install the dependency into your package using your favorite package manager.

```
npm install redac
```

## Usage

Import the `redac` package, source some data and start querying your dataset:

```js
// Import hte redac package
import redac from 'redac'
// Start sourcing data
const engine = redac
  // Source Markdown documents
  .mdx('./articles')
  // Source Yaml documents
  .yaml('./tags')
// Start querying
const articles = engine
  .from('articles')
  .filter( document => document.lang === 'fr')
  .list()
```
