import fs from 'node:fs/promises'
import os from 'node:os'
import { normalize, load, enrich } from 'redac/plugins/yaml'
import mklayout from '../../lib/utils/mklayout.js'

describe('yaml.enrich', async () => {

  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-yaml-enrich-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('lang in directory', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          ['./blog/article.en.yml', 'Article EN'],
          ['./blog/article.fr.yaml', 'Article FR'],
        ])
      )
      .then(() =>
        normalize({
          config: {
            target: `${tmpdir}/blog`,
          },
        })
      )
      .then(load)
      .then(enrich)
      .then(({ documents }) =>
        documents.should.eql([
          {
            data: 'Article EN',
            path_absolute: `${tmpdir}/blog/article.en.yml`,
            path_relative: 'article.en.yml',
            collection: 'blog',
            lang: 'en',
            sort: 'article.en',
            slug: ['article'],
          },
          {
            data: 'Article FR',
            path_absolute: `${tmpdir}/blog/article.fr.yaml`,
            path_relative: 'article.fr.yaml',
            collection: 'blog',
            lang: 'fr',
            sort: 'article.fr',
            slug: ['article'],
          },
        ])
      )
  )

  it('lang in file', async () =>
    Promise.resolve()
      .then(() => mklayout(tmpdir, [['./blog.fr.yml', 'Articles FR']]))
      .then(() =>
        normalize({
          config: {
            target: `${tmpdir}/blog.fr.yml`,
          },
        })
      )
      .then(load)
      .then(enrich)
      .then(({ documents }) =>
        documents.should.eql([
          {
            data: 'Articles FR',
            path_absolute: `${tmpdir}/blog.fr.yml`,
            path_relative: '',
            collection: 'blog',
            lang: 'fr',
            sort: '',
            slug: [],
          },
        ])
      ))
  
})
