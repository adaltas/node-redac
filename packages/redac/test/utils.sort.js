import { describe, it } from 'node:test'
import 'should'
import sort from '../lib/utils/sort.js'

describe("mdx.sort", async () => {
  it("without sort", async () => {
    sort([
      {
        lang: 'fr',
        slug: [ 'path', 'b_dir', 'article_3' ]
      },
      {
        lang: 'fr',
        slug: [ 'path', 'a_dir', 'article_5' ]
      },
      {
        lang: 'fr',
        slug: [ 'path', 'a_dir', 'article_4' ]
      },
      {
        lang: 'fr',
        slug: [ 'path', "a_dir" ]
      },
      {
        lang: 'fr',
        slug: []
      },
      {
        lang: 'fr',
        slug: [ 'path', 'a_dir', 'article_2' ]
      }
    ])
      .map((document) => ({
        slug: document.slug,
      }))
      .should.eql([
        { slug: [] },
        { slug: ["path", "a_dir"] },
        { slug: ["path", "a_dir", "article_2"] },
        { slug: ["path", "a_dir", "article_4"] },
        { slug: ["path", "a_dir", "article_5"] },
        { slug: ["path", "b_dir", "article_3"] },
      ]);
  });
  it("with sort in shared parent", async () => {
    sort([
      {
        lang: "fr",
        sort: "01.article_3",
        slug: ["path", "b_dir", "article_3"],
      },
      {
        lang: "fr",
        sort: "article_2",
        slug: ["path", "b_dir", "article_2"],
      },
      {
        lang: "fr",
        sort: "02.article_5.fr",
        slug: ["path", "a_dir", "article_5"],
      },
      {
        lang: "fr",
        sort: "article_4.fr",
        slug: ["path", "a_dir", "article_4"],
      },
    ])
      .map((document) => ({
        slug: document.slug,
        lang: document.lang,
      }))
      .should.eql([
        { lang: "fr", slug: ["path", "a_dir", "article_5"]},
        { lang: "fr", slug: ["path", "a_dir", "article_4"]},
        { lang: "fr", slug: ["path", "b_dir", "article_3"]},
        { lang: "fr", slug: ["path", "b_dir", "article_2"]},
      ]);
  });
  it("with lang", async () => {
    sort([
      {
        lang: "fr",
        sort: "article_2",
        slug: ["article_2"],
      },
      {
        lang: "en",
        sort: "article_2",
        slug: ["article_2"],
      },
      {
        lang: "en",
        sort: "article_1",
        slug: ["article_1"],
      },
      {
        lang: "fr",
        sort: "article_1",
        slug: ["article_1"],
      },
    ])
      .map((document) => ({
        slug: document.slug,
        lang: document.lang,
      }))
      .should.eql([
        { lang: "en", slug: ["article_1"]},
        { lang: "en", slug: ["article_2"]},
        { lang: "fr", slug: ["article_1"]},
        { lang: "fr", slug: ["article_2"]},
      ]);
  });
});
