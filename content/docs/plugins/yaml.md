
# Plugin YAML

The plugin search for YAML files inside a target directory. By default, only the files
matching the `.yml` and `.yaml` extensions are converted to documents.

## Configuration

The plugin accept one or multiple configurations.

A configuration is an object with the following attributes:

- `collection`: default collection name of the document.
- `target`: path to the directory containing the collections.
- `pattern`: matching pattern used to extract documents from collections.

A string is converted to an object whose value is `target`.

## Collection

Unless defined, the collection is named after the target file or directory.

When target is a file, a collection named after the file is created. For example:

```js
redac.yaml('path/to/my_collection.yaml')
```

It creates a new `my_collection` collection with a single document whose slug is `[]`.

When target is a directory, a collection named after the directory is created. For example:

```js
redac.yaml('path/to/my_collection')
```

It creates a new `my_collection` collection with as many documents as the files matching the `pattern` attribute.
