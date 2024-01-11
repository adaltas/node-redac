import redac from 'redac'
import redacMemory from 'redac/plugins/memory'

describe('memory', async () => {
  
  it('config is invalid', async () => {
    (() =>
      redac(redacMemory).memory(false)
    ).should.throw([
      'REDAC_MEMORY_INVALID_ARGUMENTS:',
      'plugin config must be an object,',
      'got false.',
    ].join(' '))
  })

  it('config.documents is invalid', async () => {
    (() =>
      redac(redacMemory).memory({
        documents: false
      })
    ).should.throw([
      'REDAC_MEMORY_INVALID_DOCUMENTS_ARGUMENTS:',
      'config must contain an array of documents,',
      'got false.',
    ].join(' '))
  })

  it('config.documents is an array of documents', async () =>
    redac(redacMemory)
      .memory({
        documents: [
          {
            collection: 'memory',
            key: 'value',
          },
        ],
      })
      .from('memory')
      .list()
      .should.be.resolvedWith([
        {
          collection: 'memory',
          key: 'value',
        },
      ]))

})
