
export default function pluginMdxOverload (plugin) {
  const {documents} = plugin
  // Index absolute slug found in filenames with metadata slug
  const slugs = {}
  documents.forEach( document => {
    slugs[(document.lang ?? '')+'/'+document.slug.join('/')] = document.data?.slug
  })
  // Reconstruct the slug with metadata slug if present
  plugin.documents = documents.map((document) => {
    const newSlug = []
    for (let i = 0; i < document.slug.length; i++) {
      const overloadedSlug = slugs[(document.lang ?? '')+'/'+document.slug.slice(0, i+1).join('/')]
      if(overloadedSlug){
        newSlug[i] = overloadedSlug
      } else {
        newSlug[i] = document.slug[i]
      }
    }
    document.slug = newSlug
    return document
  })
  return plugin
}
