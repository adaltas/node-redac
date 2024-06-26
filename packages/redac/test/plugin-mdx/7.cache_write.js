import fs from 'node:fs/promises'
import os from 'node:os'
import { normalize, cache_read, load, enrich, parse, overload, cache_write } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx.cache_write', async () => {

  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-overload-${count++}`
    await fs.rm(tmpdir, { recursive: true }).catch(() => {})
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('serialize documents', async () => {
    await mklayout(tmpdir, [
      ['./blog/article_1.md', '---\nslug: my-article-1\n---'],
      ['./blog/path-2/article_2.md', '---\nslug: my-article-2\n---'],
      ['./blog/path-3/index.md', '---\nslug: my-path-3\n---'],
      ['./blog/path-3/article_3.md', '---\nslug: my-article-3\n---'],
    ])
      .then(() =>
        normalize({
          config: { target: `${tmpdir}/blog`, cache: `${tmpdir}/cache` },
        })
      )
      .then(cache_read)
      .then(load)
      .then(enrich)
      .then(parse)
      .then(overload)
      .then(cache_write)
      .then(async (plugin) =>
        fs.readFile(plugin.config.cache.module, 'utf8')
          .then((data) => JSON.parse(data.replace('export default ', '')))
          .should.finally.match({
            documents: (it) => it.should.be.an.Array()
          })
      )
  })
  
})
