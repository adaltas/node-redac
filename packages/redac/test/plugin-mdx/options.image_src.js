import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import dedent from 'dedent'
import { normalize, load, enrich, parse } from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx.options.image_src', async () => {
  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-options-image_src-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('default behavior dont alter image src', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          [
            './blog/article_1.md',
            dedent`
            ![Alt text](./relative/path/image.png)
            ![Alt text](/absolute/path/image.png)
            ![Alt text](https://domain.com/path/image.png)
          `,
          ],
        ])
      )
      .then(() => normalize({ config: { target: tmpdir } }))
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then((plugin) => parse(plugin))
      .then(({ documents }) =>
        documents[0].content_md.trim().should.eql(dedent`
          ![Alt text](./relative/path/image.png)
          ![Alt text](/absolute/path/image.png)
          ![Alt text](https://domain.com/path/image.png)
        `)
      ))

  it('value `true` creates absolute path from collection', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          [
            './parent/child/page_1.md',
            dedent`
            ![Alt text](./relative/path/image.png)
            ![Alt text](/absolute/path/image.png)
            ![Alt text](https://domain.com/path/image.png)
          `,
          ],
        ])
      )
      .then(() =>
        normalize({ config: { target: tmpdir, image_src: true } })
      )
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then((plugin) => parse(plugin))
      .then(({ documents }) =>
        documents[0].content_md.trim().should.eql(dedent`
          ![Alt text](/redac-test-mdx-options-image_src-1/parent/child/relative/path/image.png)
          ![Alt text](/redac-test-mdx-options-image_src-1/absolute/path/image.png)
          ![Alt text](https://domain.com/path/image.png)
        `)
      ))

  it('value function run asynchrnously', async () =>
    Promise.resolve()
      .then(() =>
        mklayout(tmpdir, [
          [
            './parent/child/page_1.md',
            dedent`
            ![Alt text](./relative/path/image.png)
            ![Alt text](/absolute/path/image.png)
            ![Alt text](https://domain.com/path/image.png)
          `,
          ],
        ])
      )
      .then(() =>
        normalize({
          config: {
            target: tmpdir,
            image_src: ({ node, document }) => {
              return new Promise( (resolve) => {
                if (node.url.startsWith('.')) {
                  node.url = 'https://public.local' + path.resolve(
                    path.join(
                      '/',
                      path.dirname(document.path_relative)
                    ),
                    node.url
                  )
                } else if (node.url.startsWith('/')) {
                  node.url = 'https://public.local' + node.url
                }
                resolve(node.url)
              })
            },
          },
        })
      )
      .then((plugin) => load(plugin))
      .then((plugin) => enrich(plugin))
      .then((plugin) => parse(plugin))
      .then(({ documents }) =>
        documents[0].content_md.trim().should.eql(dedent`
          ![Alt text](https://public.local/parent/child/relative/path/image.png)
          ![Alt text](https://public.local/absolute/path/image.png)
          ![Alt text](https://domain.com/path/image.png)
        `)
      ))
})
