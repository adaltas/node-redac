import engine from 'redac'
import redacMemory from 'redac/plugins/memory'

describe('engine.collection.match', async () => {

  it('match a document by slug', async () =>
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
      .match(['article_2'])
      .get()
      .should.be.resolvedWith({
        collection: 'blog',
        slug: ['article_2'],
      }))

  it('match a document by lang', async () =>
    engine(redacMemory)
      .memory({
        documents: [
          {
            collection: 'blog',
            slug: ['article_1'],
            lang: 'en',
          },
          {
            collection: 'blog',
            slug: ['article_1'],
            lang: 'fr',
          },
          {
            collection: 'blog',
            slug: ['article_2'],
            lang: 'en',
          },
          {
            collection: 'blog',
            slug: ['article_2'],
            lang: 'fr',
          },
        ],
      })
      .from('blog')
      .match('fr')
      .list()
      .should.be.resolvedWith([
        {
          collection: 'blog',
          lang: 'fr',
          slug: ['article_1'],
        },
        {
          collection: 'blog',
          lang: 'fr',
          slug: ['article_2'],
        },
      ]))

  it('match a document by object', async () =>
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
      .get()
      .should.be.resolvedWith({
        collection: 'blog',
        slug: ['article_2'],
      }))
  
})
