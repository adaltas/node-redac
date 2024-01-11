import fs from 'node:fs/promises'
import os from 'node:os'
import { normalize } from 'redac/plugins/yaml'
import mklayout from '../../lib/utils/mklayout.js'

describe('yaml.normalize', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-yaml-normalize-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('config is a string to directory', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [['./blog/article_1.yaml'], ['./blog/article_2.yaml']])
      )
      .then(() =>
        normalize({
          config: {
            target: `${tmpdir}/blog`,
          },
        })
      )
      .then(({ config }) =>
        config.should.match({
          collection: 'blog',
          is_directory: true,
          pattern: '**/*.y?(a)ml',
          target: `${tmpdir}/blog`,
        })
      ))

  it('config is a string to file', async () =>
    Promise.resolve()
      .then(() => mklayout(tmpdir, [['./blog.yaml']]))
      .then(() =>
        normalize({
          config: {
            target: `${tmpdir}/blog.yaml`,
          },
        })
      )
      .then(({ config }) =>
        config.should.match({
          collection: 'blog',
          is_directory: false,
          pattern: '**/*.y?(a)ml',
          target: `${tmpdir}/blog.yaml`,
        })
      ))
})
