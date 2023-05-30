import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../../lib/utils/mklayout.js'
import redac from '../../lib/index.js'

describe('mdx', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('config is invalid', async () => {
    (() => 
      redac.mdx(false)
    ).should.throw([
      'REDAC_MDX_INVALID_ARGUMENTS:',
      'plugin config must be an object or a string,',
      'got false.',
    ].join(' '))
  })
  it('config is a string', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.md'],
    ])
    redac.mdx.should.be.a.Function()
    const engine = redac.mdx(tmpdir)
    Object.keys(engine).should.eql(['db', 'from'])
  })
  it('config is an object', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.md'],
    ])
    redac.mdx.should.be.a.Function()
    const engine = redac.mdx({
      cwd: tmpdir
    })
    Object.keys(engine).should.eql(['db', 'from'])
  })
})
