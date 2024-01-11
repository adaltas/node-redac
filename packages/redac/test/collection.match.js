import engine from 'redac'

describe('engine.collection.match', async () => {

  it('match a document by slug', async () => {
    (
      await engine
        .memory({
          documents: [
            {
              collection: "blog",
              slug: ["article_1"],
            },
            {
              collection: "blog",
              slug: ["article_2"],
            },
            {
              collection: "pages",
              slug: ["page_1"],
            },
          ],
        })
        .from("blog")
        .match(["article_2"])
        .get()
    ).should.match({
      collection: "blog",
      slug: ["article_2"],
    });
  })

  it('match a document by lang', async () => {
    (await engine.memory({
      documents: [{
        collection: "blog",
        slug: ["article_1"],
        lang: 'en'
      }, {
        collection: "blog",
        slug: ["article_1"],
        lang: 'fr'
      }, {
        collection: "blog",
        slug: ["article_2"],
        lang: 'en'
      }, {
        collection: "blog",
        slug: ["article_2"],
        lang: 'fr'
      }]
    }).from('blog').match('fr').list()).should.match([
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
    ])
  })

  it('match a document by object', async () => {
    (
      await engine.memory({
        documents: [{
          collection: "blog",
          slug: ["article_1"],
        }, {
          collection: "blog",
          slug: ["article_2"],
        }, {
          collection: "pages",
          slug: ["page_1"],
        }]
      })
        .from('blog')
        .match({
          slug: ['article_2'],
        })
        .get()
    ).should.match({
      collection: 'blog',
      slug: ['article_2'],
    })
  })
  
})
