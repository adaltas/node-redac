import engine from 'redac'
import redacMemory from 'redac/plugins/memory'

describe('engine.collection.map', async () => {

  it('tranform document with one property', async () =>
    engine(redacMemory)
        .memory({
          documents: [
            {
              collection: 'blog',
              slug: ['article_1'],
            },
            {
              collection: 'blog',
              slug: ['article_2'],
            },
            {
              collection: 'pages',
              slug: ['page_1'],
            },
          ],
        })
        .from('blog')
        .match({
          slug: ['article_2'],
        })
        .map((document) => ({
          slug: document.slug,
        }))
        .get()
    .should.be.resolvedWith({
      slug: ['article_2'],
    })
  )
  
})
