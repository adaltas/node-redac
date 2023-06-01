import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../../lib/utils/mklayout.js'
import {normalize, source} from '../../lib/plugin-mdx/index.js'

describe('mdx.source', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-source-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('config is an object', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.md']
    ])
      .then(() =>
        normalize({
          config: { cwd: tmpdir },
        })
      )
      .then((plugin) => source(plugin))
      .then(({ documents }) =>
        documents.should.match([
          { path_relative: 'blog/article_1.md' },
          { path_relative: 'blog/article_2.md' },
        ])
      )
  })
  it('config is a string', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.md'],
    ])
    .then(() =>
      normalize({
        config: { cwd: tmpdir },
      })
    )
    .then((plugin) => source(plugin))
    .then(({ documents }) =>
      documents.should.match([
        { path_relative: 'blog/article_1.md' },
        { path_relative: 'blog/article_2.md' },
      ])
    )
  })
  it('filter .md and .mdx extension', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.mdx'],
      ['./blog/article_3.ko'],
      ['./blog/article_4.mdoups'],
    ])
    .then(() =>
      normalize({
        config: { cwd: tmpdir },
      })
    )
    .then((plugin) => source(plugin))
    .then(({ documents }) =>
      documents.should.match([
        { path_relative: 'blog/article_1.md' },
        { path_relative: 'blog/article_2.mdx' },
      ])
    )
  })
})
