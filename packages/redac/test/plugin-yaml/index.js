import { beforeEach, afterEach, describe, it } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import 'should'
import mklayout from '../../lib/utils/mklayout.js'
import redac from '../../lib/index.js'

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
  it('config is invalid', async () => {
    ;(() => redac.yaml(false)).should.throw(
      [
        'REDAC_YAML_INVALID_ARGUMENTS:',
        'plugin config must be an object or a string,',
        'got false.',
      ].join(' ')
    )
  })
  it('config is a string', async () => {
    await mklayout(tmpdir, [['./collection.yaml']])
    const engine = await redac.yaml(`${tmpdir}/collection.yaml`)
    Object.keys(engine).should.eql(['db', 'from'])
  })
  it('config is an object', async () => {
    await mklayout(tmpdir, [['./collection.yaml']])
    const engine = redac.yaml({
      target: `${tmpdir}/collection.yaml`,
    })
    Object.keys(engine).should.eql(['db', 'from'])
  })
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
