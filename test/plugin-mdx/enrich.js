import {beforeEach, afterEach, describe, it} from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../../lib/utils/mklayout.js'
import normalize from '../../lib/plugin-mdx/1.normalize.js'
import source from '../../lib/plugin-mdx/1.source.js'
import enrich from '../../lib/plugin-mdx/2.enrich.js'

describe('mdx.enrich', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-enrich-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('extract collections', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md'],
      ['./blog/article_2.md'],
      ['./pages/page_1.mdx'],
    ])
      .then(() =>
        normalize({
          config: { cwd: tmpdir },
        })
      )
      .then((plugin) => source(plugin))
      .then((plugin) => enrich(plugin))
      .then(({ documents }) =>
        documents.should.match([
          { collection: 'blog' },
          { collection: 'blog' },
          { collection: 'pages' },
        ])
      )
  })
})
