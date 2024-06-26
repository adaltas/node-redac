import fs from 'node:fs/promises'
import os from 'node:os'
import each from 'each'
import { normalize, cache_read, load } from 'redac/plugins/mdx'
import { serialize } from '../../lib/plugin-mdx/7.cache_write.js'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx.load.cache', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-load-${count++}`
    await fs.rm(tmpdir, { recursive: true }).catch(() => {})
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('cache is not set', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          ['./cache/blog.mjs', serialize([])],
          ['./blog/article_1.md', '1'],
          ['./blog/article_2.md', '2'],
        ])
      )
      .then(() =>
        normalize({
          config: { target: tmpdir },
        })
      )
      .then((plugin) => load(plugin))
      .then(({ documents }) =>
        documents.should.match([
          { path_relative: 'blog/article_1.md', cache: false },
          { path_relative: 'blog/article_2.md', cache: false },
        ])
      ))

  it('load changed files or files not in cache', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          ['./blog/document_in_cache_1.md', '1'],
          ['./blog/document_in_cache_with_old_mtime.md', '2'],
          ['./blog/document_not_in_cache.md', '3'],
          ['./blog/document_in_cache_2.md', '4'],
        ])
      )
      .then(async (documents) => {
        fs.writeFile(
          `${tmpdir}/cache.mjs`,
          serialize([
            {
              ...documents[0],
              stat: {
                mtime: (
                  await fs.stat(documents[0].path_absolute)
                ).mtime.getTime(),
              },
              value: '',
            },
            {
              ...documents[1],
              stat: {
                mtime:
                  (await fs.stat(documents[1].path_absolute)).mtime.getTime() -
                  10,
              },
              value: '',
            },
            {
              ...documents[3],
              stat: {
                mtime: (
                  await fs.stat(documents[3].path_absolute)
                ).mtime.getTime(),
              },
              value: '',
            },
          ])
          // serialize(
          //   await each(documents, async (document) => ({
          //     ...document,
          //     stat: {
          //       mtime: (await fs.stat(document.path_absolute)).mtime.getTime(),
          //     },
          //     value: '',
          //   }))
          // )
        )
      })
      .then(() =>
        normalize({
          config: { target: tmpdir, cache: `${tmpdir}/cache.mjs` },
        })
      )
      .then((plugin) => cache_read(plugin))
      .then((plugin) => load(plugin))
      .then(({ documents }) =>
        documents.should.match([
          { path_relative: './blog/document_in_cache_1.md', cache: true },
          { path_relative: './blog/document_in_cache_2.md', cache: true },
          {
            path_relative: 'blog/document_in_cache_with_old_mtime.md',
            cache: false,
          },
          { path_relative: 'blog/document_not_in_cache.md', cache: false },
        ])
      ))
})
