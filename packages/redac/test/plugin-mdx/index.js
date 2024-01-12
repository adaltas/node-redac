import fs from 'node:fs/promises'
import os from 'node:os'
import redac from 'redac'
import redacMdx from 'redac/plugins/mdx'
import mklayout from '../../lib/utils/mklayout.js'

describe('mdx', async () => {

  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-mdx-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  describe('register in constructor', () => {
  
    it('config is a string', async () => {
      const engine = await redac([{
        plugin: redacMdx,
        config: '/path/to/collection'
      }])
      Object.keys(engine).should.eql(['plugins', 'db', 'from', 'mdx'])
    })

  })

  describe('register with function .mdx', () => {

    it('config is invalid', async () => {
      (() => 
        redac([redacMdx]).mdx(false)
      ).should.throw([
        'REDAC_MDX_INVALID_ARGUMENTS:',
        'plugin config must be an object or a string,',
        'got false.',
      ].join(' '))
    })
  
    it('config is a string', async () => {
      const engine = await redac([redacMdx]).mdx('/path/to/collection')
      Object.keys(engine).should.eql(['plugins', 'db', 'from', 'mdx'])
    })
  
    it('config is an object', async () => {
      const engine = await redac([redacMdx]).mdx({
        target: '/path/to/collection'
      })
      Object.keys(engine).should.eql(['plugins', 'db', 'from', 'mdx'])
    })
  
    it('load documents', async () =>
      Promise.resolve()
        .then(() => mklayout(tmpdir, [['./blog/article_1.md', 'Some content']]))
        .then(async () =>
          redac([redacMdx])
            .mdx({target: tmpdir, uber: true})
            .from('blog')
            .list()
            .should.be.finally.match([{
              collection: 'blog',
              slug: [ 'article_1' ]
            }])
        ))

  })

})
