
# Plugin MDX

The plugin search for MDX files inside a root directory. By default, only the files
matching the `.md` and `.mdx` extensions are converted to documents.

## Configuration

The plugin accept one or multiple configurations.

A configuration is an object with the following attributes:

- `collection`: default collection name of the document, incompatible with the
  `uber` attribute.
- `target`: path to the directory containing the collection.
- `pattern`: matching pattern used to extract documents from collections.
- `uber`: treat the child directories of the `target` atttribute as collections.

A string is converted to an object whose value is `target`.

## Collection

Unless defined, the collection is named after the target directory.

When target is a directory, a collection named after the directory is created. For example:

```js
redac.yaml('path/to/my_collection')
```

It creates a new `my_collection` collection with as many documents as the files matching the `pattern` attribute.

## Option `uber`

With the `uber` attribute, each child directory is interpreted as a collection. In such case, the document's collection is named after the child directory.

Considering the following layout:

```text
+ store
  + articles
    - article 1
    - article 2
  + pages
    - page 1
```

The `./store` target create 2 collections, `articles` and `pages`.

## Option `image_src`

By default, the `node.url` attribute in markdown, corresponding to the image `src` attributes, are left untouched. When `image_src` is `true`, all `src` attribute are replaced with the absolute path starting with the collection. When `image_src` is a function, the function receives the `config`, `document` and `node` arguments and it shall return the new `node.url`.

## Overloading with frontmatter

The document slug can be overloaded from the `slug` property in the frontmatter. This is usefull for internationalization where the slug of a translated page may not share the name as the one of the default language. In such case, the page of the default language get its slug from its filename and the translated pages get their slug from the `slug` frontmatter property.
