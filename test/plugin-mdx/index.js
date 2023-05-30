import {describe, it} from 'node:test'
import 'should'
import redac from '../../lib/index.js'

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
    Object.keys(engine).should.eql(['db', 'from'])
  })
  it('config is an object', async () => {
    const engine = redac.mdx({
      cwd: '/path/to/collection'
    })
    Object.keys(engine).should.eql(['db', 'from'])
  })
})
