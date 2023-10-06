import { beforeEach, afterEach, describe, it } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import dedent from 'dedent'
import mklayout from '../../lib/utils/mklayout.js'
import {normalize, load, enrich, parse, overload} from '../../lib/plugin-mdx/index.js'

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
})
