import collection from './collection.js'
import source from './db/1.source.js'
import enrich from './db/2.enrich.js'
import sort from './db/3.sort.js'
import parse from './db/4.parse.js'

export { enrich, parse, sort, source }

const init = (stores) => {
  return new Promise(async (resolve, reject) => {
    try {
      let documents = await source(stores)
      documents = enrich(documents)
      documents = sort(documents)
      documents = await parse(documents)
      resolve(documents)
    } catch (error) {
      reject(error)
    }
  })
}

export default function Engine(stores) {
  const engine = {
    db: init(stores),
    from: (name) => collection(engine, name),
  }
  return engine
}
