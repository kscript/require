; (() => {
  const requires = {
    state: 0,
    queue: [],
    promises: {}
  }
  const loadScript = (url, callback) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.async = true
    script.onload = script.onreadystatechange = () => {
      if (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onload = script.onreadystatechange = null
        if (callback && typeof callback === 'function') {
          callback()
        }
      }
    }
    script.onerror = (error) => {
      console.error(error)
      if (callback && typeof callback === 'function') {
        callback(error)
      }
    }
    document.head.appendChild(script)
    return script
  }
  const exchange = (source, target, name, value) => {
    const old = source[name]
    target[name] = source[name]
    source[name] = value || old
  }
  const executor = ({ url, resolve, reject } = {}) => {
    if (!url || requires.state !== 0) return
    requires.state = 1
    exchange(window, requires, 'module', {})
    exchange(window, requires, 'exports', {})
    loadScript(url, (err) => {
      requires.state = 0
      if (err) {
        reject(err)
      } else {
        const moduleExports = window.module.exports || window.exports
        exchange(requires, window, 'module', {})
        exchange(requires, window, 'exports', {})
        resolve(moduleExports)
        requires.state = 0
        executor(requires.queue.shift())
      }
    })
  }
  const require = (url) => {
    const current = requires.promises[url] = {}
    return current.promise = new Promise((resolve, reject) => {
      Object.assign(current, { url, resolve, reject })
      if (requires.state === 1) {
        requires.queue.push(current)
      } else if (requires.state === 0) {
        executor(current)
      }
    })
  }
  window.module = {
    exports: window.exports = {}
  }
  window.require = require
})()
