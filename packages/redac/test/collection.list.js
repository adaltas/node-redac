import engine from 'redac'
import redacMemory from 'redac/plugins/memory'

describe('engine.collection.list', async () => {

  it('list all documents, no filter', async () =>
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
      .list()
      .should.be.resolvedWith([
        {
          collection: 'blog',
          slug: ['article_1'],
        },
        {
          collection: 'blog',
          slug: ['article_2'],
        },
      ]))

  it('with `.filter`', async () =>
    engine(redacMemory)
      .memory({
        documents: [
          {
            slug: ['article_1'],
            collection: 'blog',
            lang: 'fr',
          },
          {
            slug: ['article_1'],
            collection: 'blog',
            lang: 'en',
          },
          {
            slug: ['article_1'],
            collection: 'blog',
            lang: 'de',
          },
          {
            slug: ['article_2'],
            collection: 'blog',
            lang: 'fr',
          },
          {
            slug: ['article_2'],
            collection: 'blog',
            lang: 'en',
          },
        ],
      })
      .from('blog')
      .filter((document) => ['fr', 'de'].includes(document.lang))
      .list()
      .should.be.resolvedWith([
        { collection: 'blog', lang: 'de', slug: ['article_1'] },
        { collection: 'blog', lang: 'fr', slug: ['article_1'] },
        { collection: 'blog', lang: 'fr', slug: ['article_2'] },
      ]))
  
})
