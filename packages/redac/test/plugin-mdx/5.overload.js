import { beforeEach, afterEach, describe, it } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import { normalize, load, enrich, parse, overload } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx.overload', async () => {

  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-overload-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('slug from metadata', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md', '---\nslug: my-article-1\n---'],
      ['./blog/path-2/article_2.md', '---\nslug: my-article-2\n---'],
      ['./blog/path-3/index.md', '---\nslug: my-path-3\n---'],
      ['./blog/path-3/article_3.md', '---\nslug: my-article-3\n---'],
    ])
      .then(() =>
        normalize({
          config: { target: `${tmpdir}/blog` },
        })
      )
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then((plugin) => parse(plugin))
      .then((plugin) => overload(plugin))
      .then(
        ({ documents }) =>
          documents.should.match([
            { slug: ['my-article-1'] },
            { slug: ['path-2', 'my-article-2'] },
            { slug: ['my-path-3', 'my-article-3'] },
            { slug: ['my-path-3'] },
          ])
      )
  })

  it('slug with lang', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.en.md', '---\nslug: my-article-1\n---'],
      ['./blog/article_1.fr.md', '---\nslug: mon-article-1\n---'],
      ['./blog/path-2/index.en.md', '---\nslug: my-path-3\n---'],
      ['./blog/path-2/index.fr.md', '---\nslug: mon-chemin-3\n---'],
      ['./blog/path-2/article_2.en.md', '---\nslug: my-article-3\n---'],
      ['./blog/path-2/article_2.fr.md', '---\nslug: mon-article-3\n---'],
    ])
      .then(() =>
        normalize({
          config: { target: `${tmpdir}/blog` },
        })
      )
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then((plugin) => parse(plugin))
      .then((plugin) => overload(plugin))
      .then(
        ({ documents }) =>
          documents.should.match([
            { lang: 'en', slug: ['my-article-1'] },
            { lang: 'fr', slug: ['mon-article-1'] },
            { lang: 'en', slug: ['my-path-3', 'my-article-3'] },
            { lang: 'fr', slug: ['mon-chemin-3', 'mon-article-3'] },
            { lang: 'en', slug: ['my-path-3'] },
            { lang: 'fr', slug: ['mon-chemin-3'] },
          ])
      )
  })
  
})
