import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../lib/utils/mklayout.js'
import engine from '../lib/index.js'

describe('engine', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/tdp-test-engine-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('expose db and from', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
    ])
    const eng = await engine(tmpdir)
    Object.keys(eng).should.eql(['db', 'from'])
  })

})
