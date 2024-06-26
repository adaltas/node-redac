import fs from 'node:fs/promises'
import os from 'node:os'
import { normalize, load, enrich } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

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

  it('extract collections', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          ['./blog/article_1.md'],
          ['./blog/article_2.md'],
          // Leave this in case config.target accept array
          // ['./pages/page_1.mdx'],
        ])
      )
      .then(() =>
        normalize({
          config: { target: `${tmpdir}/blog` },
          // config: { target: [`${tmpdir}/blog`, `${tmpdir}/pages`] },
        })
      )
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then(({ documents }) =>
        documents.should.match([
          { collection: 'blog', slug: ['article_1'] },
          { collection: 'blog', slug: ['article_2'] },
          // { collection: 'pages', slug: ['page_1'] },
        ])
      ))
  
})
