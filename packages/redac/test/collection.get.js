import { describe, it } from 'node:test'
import 'should'
import engine from 'redac'

describe('engine.collection.get', async () => {

  it("return undefined if not found", async () => {
    should(
      await engine
        .memory({
          documents: [],
        })
        .from("blog")
        .match(["invalid"])
        .get()
    ).be.undefined();
  });

  it("return document if single match", async () => {
    (
      await engine
        .memory({
          documents: [
            {
              collection: "blog",
              slug: ["article"],
            },
          ],
        })
        .from("blog")
        .get()
    ).should.match({
      slug: ["article"],
    });
  });

  it('error if more than one document', async () => {
    await engine.memory({
      documents: [{
        collection: 'blog',
        slug: ['article'],
        lang: 'en'
      }, {
        collection: 'blog',
        slug: ['article'],
        lang: 'fr'
      }]
    })
      .from('blog')
      .get()
    .should.be.rejectedWith('Invalid Query: found more than one element matching the filter.')
  })
  
})
