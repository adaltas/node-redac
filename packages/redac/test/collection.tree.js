import { describe, it } from 'node:test'
import 'should'
import engine from 'redac'

describe("engine.collection.tree", async () => {
  it("from root with holes", async () => {
    (
      await engine
        .memory({
          documents: [
            {
              collection: "pages",
              slug: ["root"],
            },
            {
              collection: "pages",
              slug: ["root", "parent_1", "child_1"],
            },
            {
              collection: "pages",
              slug: ["root", "parent_1", "child_2"],
            },
            {
              collection: "pages",
              slug: ["root", "parent_2", "child_1"],
            },
          ],
        })
        .from("pages")
        .map((document) => ({
          slug: document.slug,
        }))
        .tree()
    ).should.eql([
      {
        slug: ["root"],
        slug_relative: ["root"],
        children: [
          {
            slug: ["root", "parent_1"],
            slug_relative: ["root", "parent_1"],
            children: [
              {
                slug: ["root", "parent_1", "child_1"],
                slug_relative: ["root", "parent_1", "child_1"],
                children: [],
              },
              {
                slug: ["root", "parent_1", "child_2"],
                slug_relative: ["root", "parent_1", "child_2"],
                children: [],
              },
            ],
          },
          {
            slug: ["root", "parent_2"],
            slug_relative: ["root", "parent_2"],
            children: [
              {
                slug: ["root", "parent_2", "child_1"],
                slug_relative: ["root", "parent_2", "child_1"],
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("of multiple directories", async () => {
    const documents = await engine
      .memory({
        documents: [
          {
            collection: "pages",
            slug: ["some", "root", "parent_1"],
          },
          {
            collection: "pages",
            slug: ["some", "root", "parent_1", "child_1"],
          },
          {
            collection: "pages",
            slug: ["some", "root", "parent_1", "child_2"],
          },
          {
            collection: "pages",
            slug: ["some", "root", "parent_2"],
          },
          {
            collection: "pages",
            slug: ["some", "root", "parent_3"],
          },
          {
            collection: "pages",
            slug: ["some", "root", "parent_3", "child_1"],
          },
        ],
      })
      .from("pages")
      .filter(
        (document) =>
          document.slug[2] === "parent_1" || document.slug[2] === "parent_3"
      )
      .map((document) => ({
        slug: document.slug,
      }))
      .tree();
    documents.should.eql([
      {
        slug: ["some", "root", "parent_1"],
        slug_relative: ["parent_1"],
        children: [
          {
            slug: ["some", "root", "parent_1", "child_1"],
            slug_relative: ["parent_1", "child_1"],
            children: [],
          },
          {
            slug: ["some", "root", "parent_1", "child_2"],
            slug_relative: ["parent_1", "child_2"],
            children: [],
          },
        ],
      },
      {
        slug: ["some", "root", "parent_3"],
        slug_relative: ["parent_3"],
        children: [
          {
            slug: ["some", "root", "parent_3", "child_1"],
            slug_relative: ["parent_3", "child_1"],
            children: [],
          },
        ],
      },
    ]);
  });

  it("combined with get", async () => {
    const document = await engine
      .memory({
        documents: [
          {
            collection: "pages",
            slug: ["parent_1"],
          },
          {
            collection: "pages",
            slug: ["parent_1", "child_1"],
          },
          {
            collection: "pages",
            slug: ["parent_1", "child_2"],
          },
        ],
      })
      .from("pages")
      .map((document) => ({
        slug: document.slug,
      }))
      .tree()
      .get();
    document.should.eql({
      slug: ["parent_1"],
      slug_relative: ["parent_1"],
      children: [
        {
          slug: ["parent_1", "child_1"],
          slug_relative: ["parent_1", "child_1"],
          children: [],
        },
        {
          slug: ["parent_1", "child_2"],
          slug_relative: ["parent_1", "child_2"],
          children: [],
        },
      ],
    });
  });
});
