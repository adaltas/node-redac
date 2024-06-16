import { slug } from 'github-slugger'
import deburr from 'lodash.deburr'

const mkname = (raw) => {
  return deburr(slug(raw))
}
export { mkname }
