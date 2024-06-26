import chokidar from 'chokidar'
import engine from './index.js'

export default (plugins) => {
  return async (nextConfig) => {
    await engine(plugins).db()
    let timeout
    const reload = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => engine(plugins).db(), 100)
    }
    chokidar
      .watch(
        plugins.map((plugin) => plugin.config.target),
        {
          ignoreInitial: true,
          // interval: 100,
        }
      )
      .on('all', (event, path) => reload())
    return nextConfig
  }
}
