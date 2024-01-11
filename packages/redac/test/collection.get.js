import engine from 'redac'
import redacMemory from 'redac/plugins/memory'

describe('engine.collection.get', async () => {

  it('return undefined if not found', async () =>
    should(
      await engine(redacMemory)
        .memory({
          documents: [],
        })
        .from('blog')
        .match(['invalid'])
        .get()
    ).be.undefined())

  it('return document if single match', async () =>
    engine(redacMemory)
      .memory({
        documents: [
          {
            collection: 'blog',
            slug: ['article'],
          },
        ],
      })
      .from('blog')
      .get()
      .should.be.resolvedWith({
        collection: 'blog',
        slug: ['article'],
      }))

  it('error if more than one document', async () =>
    engine(redacMemory)
      .memory({
        documents: [
          {
            collection: 'blog',
            slug: ['article'],
            lang: 'en',
          },
          {
            collection: 'blog',
            slug: ['article'],
            lang: 'fr',
          },
        ],
      })
      .from('blog')
      .get()
      .should.be.rejectedWith(
        'Invalid Query: found more than one element matching the filter.'
      )
  )
  
})
