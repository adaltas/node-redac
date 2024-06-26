import fs from 'node:fs/promises'
import os from 'node:os'
import redac from 'redac'
import redacYaml from 'redac/plugins/yaml'
import mklayout from '../../lib/utils/mklayout.js'

describe('yaml', async () => {

  let tmpdir
  let count = 0
  beforeEach(async () => {
    tmpdir = `${os.tmpdir()}/redac-test-yaml-${count++}`
    try {
      await fs.rm(tmpdir, { recursive: true })
    } catch {}
    await fs.mkdir(`${tmpdir}`)
  })
  afterEach(async () => {
    await fs.rm(tmpdir, { recursive: true })
  })

  it('config is invalid', async () =>
    (() => redac(redacYaml).yaml(false)).should.throw(
      [
        'REDAC_YAML_INVALID_ARGUMENTS:',
        'plugin config must be an object or a string,',
        'got false.',
      ].join(' ')
    )
  )

  it('config is a string', async () =>
    Promise.resolve()
      .then(() => mklayout(tmpdir, [['./collection.yaml']]))
      .then(() => redac(redacYaml).yaml(`${tmpdir}/collection.yaml`))
      .then((engine) =>
        Object.keys(engine).should.eql(['plugins', 'db', 'from', 'yaml'])
      ))

  it('config is an object', async () =>
    Promise.resolve()
      .then(() => mklayout(tmpdir, [['./collection.yaml']]))
      .then(() => redac(redacYaml).yaml({
        target: `${tmpdir}/collection.yaml`
      }))
      .then((engine) =>
        Object.keys(engine).should.eql(['plugins', 'db', 'from', 'yaml'])
      ))
  
  it('load documents', async () =>
    Promise.resolve()
      .then(() => mklayout(tmpdir, [['./tags.yaml', 'Tags']]))
      .then(async () =>
        redac([redacYaml])
          .yaml(`${tmpdir}/tags.yaml`)
          .from('tags')
          .list()
          .should.be.finally.match([{
            collection: 'tags',
            slug: []
          }])
      ))

  // it('lang in file', async () => {
  //   await mklayout(tmpdir, [['./blog.fr.yml', 'Articles FR']])
  //     .then(() =>
  //       normalize({
  //         config: {
  //           target: `${tmpdir}/blog.fr.yml`,
  //         },
  //       })
  //     )
  //     .then(load)
  //     .then(enrich)
  //     .then(({ documents }) =>
  //       documents.should.eql([
  //         {
  //           data: 'Articles FR',
  //           path_absolute: `${tmpdir}/blog.fr.yml`,
  //           path_relative: '',
  //           collection: 'blog',
  //           lang: 'fr',
  //           sort: '',
  //           slug: [],
  //         },
  //       ])
  //     )
  // })
  
})
