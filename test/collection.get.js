import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../lib/utils/mklayout.js'
import engine from '../lib/index.js'

describe('engine.collection.get', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/tdp-test-collection-get-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('return undefined if not found', async () => {
    await mklayout(tmpdir, [])
    should(
      await engine(tmpdir)
        .from('blog')
        .match(['invalid'])
        .get()
    ).be.undefined()
  })
  it('return document if single match', async () => {
    await mklayout(tmpdir, [
      ['./blog/article.md'],
    ])
    ;(
      await engine(tmpdir)
        .from('blog')
        .get()
    )
    .should.match({
      slug: ['article'],
    })
  })
  it('error if more than one document', async () => {
    await mklayout(tmpdir, [
      ['./blog/article.en.md'],
      ['./blog/article.fr.md'],
    ])
    await engine(tmpdir)
      .from('blog')
      .get()
    .should.be.rejectedWith('Invalid Query: found more than one element matching the filter.')
  })
})
