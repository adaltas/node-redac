import {describe, it} from 'node:test'
import 'should'
import redac from '../../lib/index.js'

describe('memory', async () => {
  it('config is invalid', async () => {
    (() => 
      redac.memory(false)
    ).should.throw([
      'REDAC_MEMORY_INVALID_ARGUMENTS:',
      'plugin config must be an object,',
      'got false.',
    ].join(' '))
  })
  it('config.documents is invalid', async () => {
    redac.memory({
      documents: false
    }).db.should.be.rejectedWith([
      'REDAC_MEMORY_INVALID_DOCUMENTS_ARGUMENTS:',
      'config must contain an array of documents,',
      'got false.',
    ].join(' '))
  })
})
