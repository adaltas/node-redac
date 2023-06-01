import { beforeEach, afterEach, describe, it } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../../lib/utils/mklayout.js'
import normalize from '../../lib/plugin-mdx/1.normalize.js'
import source from '../../lib/plugin-mdx/1.source.js'
import enrich from '../../lib/plugin-mdx/2.enrich.js'
import sort from '../../lib/utils/sort.js'

describe('mdx.enrich.slug', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-enrich-slug-${count++}`
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
      ['./blog/01.path/02.a_dir/article_4.fr.mdx'],
      ['./blog/01.path/02.a_dir/02.article_5.fr.mdx'],
    ])
      .then(() =>
        normalize({
          config: { cwd: tmpdir },
        })
      )
      .then((plugin) => source(plugin))
      .then((plugin) => enrich(plugin))
      .then(({ documents }) =>
        sort(documents)
          .map((document) => ({
            slug: document.slug,
            sort: document.sort,
          }))
          .should.eql([
            { slug: ['article_1'], sort: 'article_1' },
            { slug: ['path', 'a_dir', 'article_5'], sort: '02.article_5.fr' },
            { slug: ['path', 'a_dir', 'article_4'], sort: 'article_4.fr' },
            { slug: ['path', 'b_dir', 'article_3'], sort: '01.article_3' },
            { slug: ['path', 'b_dir', 'article_2'], sort: 'article_2' },
          ])
      )
  })
  it('extract slug', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/path/to/article_2/index.fr.mdx'],
      ['./blog/path/to/01.article_3/index.fr.mdx'],
      ['./blog/path/to/article_4.fr.mdx'],
      ['./blog/path/to/02.article_5.fr.mdx'],
    ])
      .then(() =>
        normalize({
          config: { cwd: tmpdir },
        })
      )
      .then((plugin) => source(plugin))
      .then((plugin) => enrich(plugin))
      .then(({ documents }) =>
        documents.should.match([
          { slug: ['article_1'] },
          { slug: ['path', 'to', 'article_3'] },
          { slug: ['path', 'to', 'article_5'] },
          { slug: ['path', 'to', 'article_2'] },
          { slug: ['path', 'to', 'article_4'] },
        ])
      )
  })
  it('with root file', async () => {
    await mklayout(tmpdir, [
      ['./blog/index.md'],
      ['./pages/index.fr.mdx'],
      ['./pages/index.en.mdx'],
    ])
      .then(() =>
        normalize({
          config: { cwd: tmpdir },
        })
      )
      .then((plugin) => source(plugin))
      .then((plugin) => enrich(plugin))
      .then(({ documents }) =>
        documents
          .map((document) => ({
            collection: document.collection,
            lang: document.lang,
            slug: document.slug,
          }))
          .sort((a, b) =>
            `${a.collection}|${a.lang}` > `${b.collection}|${b.lang}` ? 1 : -1
          )
          .should.match([
            { collection: 'blog', lang: 'en', slug: [] },
            { collection: 'pages', lang: 'en', slug: [] },
            { collection: 'pages', lang: 'fr', slug: [] },
          ])
      )
  })
})
