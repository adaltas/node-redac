import fs from 'node:fs/promises'
import os from 'node:os'
import { stringify } from 'yaml'
import { normalize, load } from 'redac/plugins/yaml'
import mklayout from '../../lib/utils/mklayout.js'

describe('yaml.load', async () => {

  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-yaml-load-${count++}`
    try{ await fs.rm(tmpdir, { recursive: true }) } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('directory', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          ["./blog/article_1.yml", "Article 1"],
          ["./blog/article_2.yaml", stringify("Article 2")],
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
      .then( ({documents}) =>
        documents.should.eql([
          {
            path_absolute: `${tmpdir}/blog/article_1.yml`,
            path_relative: "article_1.yml",
            data: "Article 1",
          },
          {
            path_absolute: `${tmpdir}/blog/article_2.yaml`,
            path_relative: "article_2.yaml",
            data: "Article 2",
          }
        ])
      )
  )

  it('file', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          ['./blog.yaml', 'Articles']
        ])
      )
      .then(() =>
        normalize({
          config: {
            target: `${tmpdir}/blog.yaml`,
          },
        })
      )
      .then(load)
      .then(({ documents }) =>
        documents.should.eql([
          {
            path_absolute: `${tmpdir}/blog.yaml`,
            path_relative: '',
            data: 'Articles',
          },
        ])
      )
  )
  
})
