import { describe, it } from 'node:test'
import 'should'
import engine from 'redac'

describe('engine', async () => {

  it('expose db and from', async () => {
    const eng = await engine()
    Object.keys(eng).should.eql(['plugins', 'db', 'from'])
  })

  it('config.module may be a function', async () => {
    await engine([
      {
        module: ({config}) => ({
          source: () => config.documents,
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
      .should.be.resolvedWith(['en', 'fr'])
  })

  it('config.module may be an object', async () => {
    await engine([
      {
        module: {
          source: () => [
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
      .should.be.resolvedWith(['en', 'fr'])
  })
  
})
