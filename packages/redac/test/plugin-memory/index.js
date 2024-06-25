import redac from 'redac'
import redacMemory from 'redac/plugins/memory'

describe('memory', async () => {
  it('config is invalid', async () => {
    ;(() => redac(redacMemory).memory(false)).should.throw(
      [
        'REDAC_MEMORY_INVALID_ARGUMENTS:',
        'plugin config must be an object,',
        'got false.',
      ].join(' ')
    )
  })

  it('config.documents is invalid', async () => {
    ;(() =>
      redac(redacMemory).memory({
        documents: false,
      })).should.throw(
      [
        'REDAC_MEMORY_INVALID_DOCUMENTS_ARGUMENTS:',
        'config must contain an array of documents,',
        'got false.',
      ].join(' ')
    )
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
          slug: [1],
        },
      ]))

  it('config.collection defined the default document collection', async () =>
    redac(redacMemory)
      .memory({
        collection: 'collection_1',
        documents: [
          {
            key: 'value 1',
          },
          {
            collection: 'collection_1',
            key: 'value 2',
          },
          {
            collection: 'collection_2',
            key: 'value 3',
          },
        ],
      })
      .from('collection_1')
      .list()
      .should.be.resolvedWith([
        {
          collection: 'collection_1',
          key: 'value 1',
          slug: [1],
        },
        {
          collection: 'collection_1',
          key: 'value 2',
          slug: [2],
        },
      ]))
})
