import fs from 'node:fs/promises'
import os from 'node:os'
import dedent from 'dedent'
import { normalize, cache_read } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx.cache_read', async function () {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-cache_read-${count++}`
    await fs.rm(tmpdir, { recursive: true }).catch(() => {})
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('cache file does not exist', async function () {
    return Promise.resolve()
      .then(() => mklayout(tmpdir, [['./blog/article_1.md']]))
      .then(() =>
        normalize({
          config: { target: `${tmpdir}/blog`, cache: `${tmpdir}/cache` },
        })
      )
      .then((plugin) => cache_read(plugin))
      .then(({ cache }) => cache.should.eql({ documents: [] }))
  })

  it('cache file exists and has no document', async function () {
    return Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          ['./cache.mjs', 'export default {documents: []}'],
          ['./blog/article_1.md'],
        ])
      )
      .then(() =>
        normalize({
          config: { target: `${tmpdir}/blog`, cache: `${tmpdir}/cache.mjs` },
        })
      )
      .then((plugin) => cache_read(plugin))
      .then(({ cache }) => cache.should.eql({ documents: [] }))
  })

  it('cache file is corrupted', async function () {
    return Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [['./cache.mjs', 'ohno!'], ['./blog/article_1.md']])
      )
      .then(() =>
        normalize({
          config: { target: `${tmpdir}/blog`, cache: `${tmpdir}/cache.mjs` },
        })
      )
      .then((plugin) => cache_read(plugin))
      .then(({ cache }) => cache.should.eql({ documents: [] }))
  })
})
