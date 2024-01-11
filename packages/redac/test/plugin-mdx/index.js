import redac from 'redac'
import redacMdx from 'redac/plugins/mdx'

describe('mdx', async () => {

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

  })

})
