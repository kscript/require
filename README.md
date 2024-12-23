# @kscript/require
在浏览器中使用 commonjs 模块

## 示例
``` html
  <!-- 引入 require -->
  <script src="https://unpkg.com/@kscript/require"></script>
  <script type="module">
    // 注意: 这里的require方法, 是异步的
    const hello = await require('./hello.js')
    console.log(hello)
  </script>
```
