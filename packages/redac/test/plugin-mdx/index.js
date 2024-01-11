import redac from 'redac'

describe('mdx', async () => {

  it('config is invalid', async () => {
    (() => 
      redac.mdx(false)
    ).should.throw([
      'REDAC_MDX_INVALID_ARGUMENTS:',
      'plugin config must be an object or a string,',
      'got false.',
    ].join(' '))
  })

  it('config is a string', async () => {
    const engine = redac.mdx('/path/to/collection')
    Object.keys(engine).should.eql(['plugins', 'db', 'from'])
  })

  it('config is an object', async () => {
    const engine = redac.mdx({
      target: '/path/to/collection'
    })
    Object.keys(engine).should.eql(['plugins', 'db', 'from'])
  })

})
