import { beforeEach, afterEach, describe, it } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import { normalize, load, enrich } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'
import sort from '../../lib/utils/sort.js'

describe('mdx.enrich.uber', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-enrich-uber-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('extract sort', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/01.path/01.b_dir/article_2/index.fr.mdx'],
      ['./blog/01.path/01.b_dir/01.article_3/index.fr.mdx'],
      ['./pages/01.path/02.a_dir/page_5.fr.mdx'],
      ['./pages/01.path/02.a_dir/04.page_4.fr.mdx'],
    ])
      .then(() =>
        normalize({
          config: { target: tmpdir, uber: true },
        })
      )
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then(({ documents }) =>
        sort(documents)
          .map((document) => ({
            collection: document.collection,
            slug: document.slug,
            sort: document.sort,
          }))
          .should.eql([
            { collection: 'blog', slug: ['article_1'], sort: 'article_1' },
            { collection: 'blog', slug: ['path', 'b_dir', 'article_3'], sort: '01.article_3' },
            { collection: 'blog', slug: ['path', 'b_dir', 'article_2'], sort: 'article_2' },
            { collection: 'pages', slug: ['path', 'a_dir', 'page_4'], sort: '04.page_4.fr' },
            { collection: 'pages', slug: ['path', 'a_dir', 'page_5'], sort: 'page_5.fr' },
          ])
      )
  })
})
