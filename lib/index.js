import collection from './engine/collection.js'
import enrich from './engine/enrich.js'
import parse from './engine/parse.js'
import sort from './engine/sort.js'
import source from './engine/source.js'

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
