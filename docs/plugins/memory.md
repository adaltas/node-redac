
# Plugin memory

The plugin receives a set of documents. It is quite minimalist, just pass the array of documents to the `documents` property.

## Configuration

The plugin accept one or multiple configurations.

A configuration is an object with the following attributes:

- `collection`: default collection name of the documents.
- `documents`: array of documents.

## Documents

The `slug` property is automatically set with the index integer value unless defined.
