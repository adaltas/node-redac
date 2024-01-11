import engine from 'redac'

describe('engine.collection.list', async () => {

  it("list all documents, no filter", async () => {
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
        .list()
    ).should.match([
      {
        collection: "blog",
        slug: ["article_1"],
      },
      {
        collection: "blog",
        slug: ["article_2"],
      },
    ]);
  });

  it("with `.filter`", async () => {
    (
      await engine
        .memory({
          documents: [
            {
              slug: ["article_1"],
              collection: "blog",
              lang: "fr",
            },
            {
              slug: ["article_1"],
              collection: "blog",
              lang: "en",
            },
            {
              slug: ["article_1"],
              collection: "blog",
              lang: "de",
            },
            {
              slug: ["article_2"],
              collection: "blog",
              lang: "fr",
            },
            {
              slug: ["article_2"],
              collection: "blog",
              lang: "en",
            },
          ],
        })
        .from("blog")
        .filter((document) => ["fr", "de"].includes(document.lang))
        .list()
    ).should.match([
      {
        lang: "de",
        slug: ["article_1"],
      },
      {
        lang: "fr",
        slug: ["article_1"],
      },
      {
        lang: "fr",
        slug: ["article_2"],
      },
    ]);
  });
  
})
