import { beforeEach, afterEach, describe, it } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import dedent from 'dedent'
import { normalize, load, enrich, parse } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx.parse', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-parse-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })
  it('extract title from content', async () => {
    await mklayout(tmpdir, [
      [
        './blog/article_1.md',
        dedent`
          # Heading 1
          Some content
          ## Heading 2
        `,
      ],
    ])
      .then(() => normalize({ config: { target: tmpdir } }))
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then((plugin) => parse(plugin))
      .then(({ documents }) =>
        documents.should.match([
          {
            content_md: 'Some content\n\n## Heading 2\n',
            data: {
              title: 'Heading 1',
            },
          },
        ])
      )
  })
  it('extract toc', async () => {
    await mklayout(tmpdir, [
      [
        './blog/article_1.md',
        dedent`
          # Heading 1
          Some content
          ## Heading 2
        `,
      ],
    ])
      .then(() => normalize({ config: { target: tmpdir } }))
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then((plugin) => parse(plugin))
      .then(({ documents }) =>
        documents.should.match([
          {
            toc: [
              {
                title: 'Heading 2',
                depth: 2,
                anchor: 'heading-2',
              },
            ],
          },
        ])
      )
  })
})
