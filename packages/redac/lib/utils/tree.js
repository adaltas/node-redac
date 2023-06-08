import { mutate } from 'mixme'

const getIndexInTree = (tree, el) => {
  for(let i = 0; i < tree.length; i++){
    const doc = tree[i]
    if(doc.slug[doc.slug.length-1] === el) return i
  }
}

/**
 * Organize document as a tree using slug and slug_relative attribute and
 * placing child documents inside a children attribute.
 */
export default function tree (documents) {
  let tree = [];
  let root = undefined
  documents
  // Find comment root
  .map((document) => {
    if(root === undefined){
      // root = document.slug
      root = document.slug.slice(0, document.slug.length-1)
    }
    for(const i in root){
      if(root[i] !== document.slug[i]){
        root = root.slice(0, i)
      }
    }
    return document
  })
  // Strip slug from root
  .map((document) => {
    return {...document, slug_relative: document.slug.slice(root.length, document.slug.length)}
  })
  // Build the tree
  .map((document) => {
    let ltree = tree
    for(let i=0; i<document.slug_relative.length; i++){
      let treeIndex = getIndexInTree(ltree, document.slug_relative[i])
      // Document not yet inside the tree
      if (treeIndex === undefined){
        treeIndex = ltree.length
        ltree.push({
          children: [],
          slug: [...root, ...document.slug_relative.slice(0, i + 1)],
          slug_relative: document.slug_relative.slice(0, i + 1)
        })
      }
      // Document
      if(i == document.slug_relative.length - 1){
        mutate(ltree[treeIndex], document)
      } else { // Parent
        ltree = ltree[treeIndex].children
      }
    }
  })
  return tree
}
