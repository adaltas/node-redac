import { beforeEach, afterEach, describe, it } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import { normalize, load } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx.load', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-load-${count++}`
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
          config: { target: tmpdir },
        })
      )
      .then((plugin) => load(plugin))
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
        config: { target: tmpdir },
      })
    )
    .then((plugin) => load(plugin))
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
        config: { target: tmpdir },
      })
    )
    .then((plugin) => load(plugin))
    .then(({ documents }) =>
      documents.should.match([
        { path_relative: 'blog/article_1.md' },
        { path_relative: 'blog/article_2.mdx' },
      ])
    )
  })
})
