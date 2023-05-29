
# Plugin MDX

The MDX search for MDX files inside a root directory. By default, only the files
matching the `.md` and `.mdx` extensions are converted to documents.

## Configuration

The plugin accept one or multiple configurations.

A configuration is an object with the following properties:

- `cwd`: path to the directory containing the collections.
- `pattern`: matching pattern used to extract documents from collections.

A string is converted to an object whose value is `cwd`.
