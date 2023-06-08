import {describe, it} from 'node:test'
import 'should'
import engine from '../lib/index.js'

describe('engine.collection.map', async () => {
  it('tranform document with one property', async () => {
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
        .map((document) => ({
          slug: document.slug,
        }))
        .get()
    ).should.eql({
      slug: ['article_2'],
    })
  })
})
