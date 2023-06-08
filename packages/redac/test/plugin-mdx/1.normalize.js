import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../../lib/utils/mklayout.js'
import { normalize } from '../../lib/plugin-mdx/index.js'

describe('mdx.normalize', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-normalize-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('config is an object', async () => {
    await mklayout(tmpdir, [["./blog/article_1.md"], ["./blog/article_2.md"]])
      .then(() =>
        normalize({
          config: {
            target: `${tmpdir}/blog`,
          },
        })
      )
      .then(({ config }) =>
        config.should.match({
          collection: "blog",
          pattern: "**/*.md?(x)",
          target: `${tmpdir}/blog`,
        })
      )
  })
  it('config is a string', async () => {
    await mklayout(tmpdir, [["./blog/article_1.md"], ["./blog/article_2.md"]])
      .then(() =>
        normalize({
          config: `${tmpdir}/blog`,
        })
      )
      .then(({ config }) =>
        config.should.match({
          collection: "blog",
          pattern: "**/*.md?(x)",
          target: `${tmpdir}/blog`,
        })
      )
  })
  it('config.target is invalid, eg a file', async () => {
    await mklayout(tmpdir, [['./blog.md']])
      .then(() =>
        normalize({
          config: {
            target: `${tmpdir}/blog.md`,
          },
        })
      )
      .should.be.rejectedWith([
        'REDAC_MDX_INVALID_TARGET_ARGUMENTS:',
        'target must be a directory.',
      ].join(' '))
  })
})
