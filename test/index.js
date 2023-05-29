import {describe, it} from 'node:test'
import 'should'
import engine from '../lib/index.js'

describe('engine', async () => {
  it('expose db and from', async () => {
    const eng = await engine()
    Object.keys(eng).should.eql(['db', 'from'])
  })

})
