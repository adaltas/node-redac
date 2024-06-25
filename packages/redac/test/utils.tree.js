import tree from '../lib/utils/tree.js'

describe('utils.tree', async () => {

  it('preserve properties', async () => {
    const pages = [
      { slug: ['a'], title: 'a' },
      { slug: ['b'], title: 'b' },
      { slug: ['b', 'c'], title: 'c' },
    ]
    tree(pages).should.match([
      { title: 'a', slug: ['a'], children: [] },
      {
        title: 'b',
        slug: ['b'],
        children: [
          {
            title: 'c',
            slug: ['b', 'c'],
            children: [],
          },
        ],
      },
    ])
  })

  it('with multiple parent directories', async () => {
    const pages = [
      { slug: ['a'] },
      { slug: ['b'] },
      { slug: ['b', 'a'] },
      { slug: ['b', 'b'] },
      { slug: ['a', 'a'] },
      { slug: ['a', 'b'] },
    ]
    tree(pages).should.match([
      {
        slug: ['a'],
        children: [
          {
            slug: ['a', 'a'],
            children: [],
          },
          {
            slug: ['a', 'b'],
            children: [],
          },
        ],
      },
      {
        slug: ['b'],
        children: [
          {
            slug: ['b', 'a'],
            children: [],
          },
          {
            slug: ['b', 'b'],
            children: [],
          },
        ],
      },
    ])
  })

  it('treat number as index', async () => {
    const pages = [
      { slug: [1], title: 'a' },
      { slug: [2], title: 'b' },
      { slug: [2, 3], title: 'c' },
    ]
    tree(pages).should.match([
      { title: 'a', slug: [1], children: [] },
      {
        title: 'b',
        slug: [2],
        children: [
          {
            title: 'c',
            slug: [2, 3],
            children: [],
          },
        ],
      },
    ])
  })
  
})
