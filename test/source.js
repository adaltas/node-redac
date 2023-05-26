import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../lib/utils/mklayout.js'
import {source} from '../lib/index.js'

describe('engine.source', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/tdp-test-source-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('filter .md and .mdx extension', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.mdx'],
      ['./blog/article_3.ko'],
    ])
    await source(tmpdir).should.be.finally.match([
      { path_relative: 'blog/article_1.md' },
      { path_relative: 'blog/article_2.mdx' },
    ])
  })

  it('as a list of string and object', async () => {
    await mklayout(tmpdir, [
      ['./store_1/blog/article_1.md'],
      ['./store_2/blog/article_2.md'],
    ])
    await source([
      `${tmpdir}/store_1`,
      { cwd: `${tmpdir}/store_2` },
    ]).should.be.finally.match([
      { path_relative: 'blog/article_1.md' },
      { path_relative: 'blog/article_2.md' },
    ])
  })

  it('as an object', async () => {
    await mklayout(tmpdir, [
      ['./my_store/blog/article.md'],
    ])
    await source({
      cwd: `${tmpdir}/my_store`,
    }).should.be.finally.match([
      {
        content_raw: (c) => Buffer.isBuffer(c),
        path_absolute: `${tmpdir}/my_store/blog/article.md`,
        path_relative: 'blog/article.md',
        store: 'my_store',
      },
    ])
  })

})
