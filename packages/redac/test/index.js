import engine from 'redac'

describe('engine', async () => {

  it('expose db and from', async () => {
    const eng = await engine()
    Object.keys(eng).should.eql(['plugins', 'db', 'from'])
  })

  it('config.plugins.plugin is a function', async () =>
    engine([
      {
        plugin: (config) => ({
          hooks: {
            'engine:source': ({ documents }) =>
              documents.push(...config.documents),
          },
        }),
        config: {
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
        },
      },
    ])
      .from('blog')
      .list()
      .map(({ lang }) => lang)
      .should.be.resolvedWith(['en', 'fr']))

  it('config.plugins.plugin is an object', async () =>
    engine([
      {
        plugin: {
          hooks: {
            'engine:source': ({ documents }) =>
              documents.push(
                ...[
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
                ]
              ),
          },
        },
      },
    ])
      .from('blog')
      .list()
      .map(({ lang }) => lang)
      .should.be.resolvedWith(['en', 'fr']))
  
})
