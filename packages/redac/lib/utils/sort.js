
/**
 * Sort documents based on slug, lang and sort attributes.
 */

export default function pluginMdxSort (documents) {
  return documents
    .sort( (a, b) => a.slug.length - b.slug.length )
    .sort( (a, b) => {
      // Sort by collection
      if (a.collection !== b.collection) return a.collection < b.collection ? -1 : 0
      // Sort by lang
      if (a.lang !== b.lang) return a.lang < b.lang ? -1 : 0
      // Keep original order of a and b
      if (a.slug.length !== b.slug.length) return 0
      // Compare 2 identical parent slugs with the sort attribute
      const min = Math.min(a.slug.length, b.slug.length)
      if(min === 0){
        return -1
      }
      const slugA = [...a.slug.slice(0, a.slug.length-1), a.sort ?? a.slug[a.slug.length-1]]
      const slugB = [...b.slug.slice(0, b.slug.length-1), b.sort ?? b.slug[b.slug.length-1]]
      for (let i = 0; i < min; i++) {
        // Last element, use the sort key
        const itemA = slugA[i]
        const itemB = slugB[i]
        // Keep going if parent is shared
        if(itemA === itemB){
          continue
        }
        // Diverging parent
        return itemA > itemB ? 1 : - 1
      }
    })
}
