import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../lib/utils/mklayout.js'
import engine from '../lib/index.js'

describe('engine.collection.map', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/tdp-test-collection-map-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('tranform document with one property', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.md'],
      ['./pages/page_1.mdx'],
    ])
    ;(
      await engine.mdx(tmpdir)
        .from('blog')
        .match({
          slug: ['article_2'],
        })
        .map((document) => ({
          slug: document.slug,
        }))
        .get()
    ).should.eql({
      slug: ['article_2'],
    })
  })
})
