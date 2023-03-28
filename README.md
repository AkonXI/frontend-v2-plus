# 明日方舟一图流 网站前端

明日方舟一图流网站：<https://yituliu.site>

欢迎加入开发群（QQ）交流讨论：938710832

---

此项目从前端的 [v2 版本](https://github.com/Arknights-yituliu/frontend-v2) 发展而来，保留大部分原有代码时，升级了工具链。在 v2-plus 中，主要用到了以下的库或工具：

- 工具链：[Vite](https://cn.vitejs.dev/)，开发服务器启动快，修改反馈及时。
- 框架：[Vue 3](https://cn.vuejs.org/)，尽管 Vue 2.7 加入了 Vue 3 的一些新功能，但是仍有[一些限制](https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E6%A3%80%E6%B5%8B%E5%8F%98%E5%8C%96%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)，不如 Vue 3 使用方便。
- 服务端渲染：[vite-plugin-ssr](https://cn.vite-plugin-ssr.com/)，v2 虽然使用了 Nuxt 2，却没有充分利用 SSR 特性，只将页面中的固定部分在服务端渲染，数据仍然在浏览器中渲染。v2-plus 没有使用 Nuxt 3，转向更为轻量的 vite-plugin-ssr，避免了 Nuxt 的包装与抽象，以降低学习成本、更直观地控制打包过程。
- 组件库：[Element Plus](https://element-plus.org/zh-CN/)，v2 使用 element-ui，v2-plus 使用 element-plus，减少对原来代码的修改。
- 图表：[Apache ECharts](https://echarts.apache.org/zh/index.html)，在攒抽、公招统计页面画图。
- Polyfill：[Polyfill.io](https://polyfill.io/v3/)，兼容旧版本的浏览器。

## 运行项目

首先[安装 Node.js](https://nodejs.org/zh-cn/download)，推荐的版本是 18。

```bash
git clone https://github.com/Arknights-yituliu/frontend-v2-plus.git
cd frontend-v2-plus
npm install
```

如果网络环境不佳，可以换用国内的镜像源：

```bash
npm config set registry https://registry.npm.taobao.org
```

### 开发

```bash
npm run dev
```

然后在浏览器中打开 <http://localhost:3000>。

### 部署

#### 直接运行

```bash
npm run prod
```

默认运行在 `3000` 端口上。如果要改变端口，可以添加 `PORT` 环境变量：

```bash
PORT=10000 npm run prod  # 在 10000 端口上运行
```

#### 使用容器运行

直接运行打包好的镜像：

```bash
docker run -d --rm --name v2plus -p 3000:3000  zhaozuohong/yituliu-frontend-v2-plus:latest
```

或者从本地构建镜像：

```bash
docker build . -t v2-plus
docker run -d --rm --name v2plus -p 3000:3000  v2-plus:latest
```

## 什么是 SSR？

### 与 SPA 对比

在单页面应用（SPA）中，js 代码运行在浏览器里。用户打开网页时，在第一轮网络请求中，服务端返回一个带有空 `<div>` 标签的网页，用户看到的屏幕内容是空白的。浏览器解析网页中的链接，发起第二轮网络请求，下载 js。Js 渲染页面，用户才能看到页面内容。此时网页可以交互（可以显示加载动画等），但是不含数据。Js 发起第三轮网络请求，下载数据，随后将数据渲染到网页中，用户才能看到完整的、带有数据的网页。

服务端渲染（SSR）需要在服务端用 Node.js 运行 js 代码。在用户打开网页时，js 在服务端下载数据，生成带有数据的网页并返回。于是用户直接看到带有数据的网页。不过此时网页是不可交互的，要等浏览器解析链接、发起第二轮网络请求以下载 js 后，用户才可以与网页交互。

与 SPA 相比，SSR 减少了整整一轮的网络请求，而且用户能够在第一时间看到带有数据的完整网页，对于体验有明显的提升；搜索引擎爬虫也能直接抓取带有完整数据的网页，对于搜索引擎排名也非常有利。

### 灵活使用 SSR

在使用 SSR 时，需要注意，同样一套代码在服务端与浏览器两处运行，虽然它们都对应同样的网页结构，但起到的作用却并不相同。在服务端，代码负责生成 html；在浏览器中，代码不会操作 dom、再生成一遍相同的网页结构，而是激活（hydrate）在服务端生成的 html，为其添加交互性。

SSR 是非常灵活的。在服务端与客户端各做什么，完全视需求而定。对于有交互需求的一般数据展示网站，可以采用上一节所述的流程，但也完全可以像 SPA 那样，在浏览器中请求数据再渲染。也可以让一部分数据在服务端加载，另一部分在浏览器中请求。

很多前端的库在设计时只考虑了浏览器中的运行环境，有些在服务端运行没有意义（如 cookie 相关的代码），有些会出错（比如 ECharts 或 Element Plus 的一些组件）。我们可以只在浏览器中运行这部分代码，也可以在服务端通过一些手段模拟浏览器的环境，来运行它们。

### SSR 与路由

使用 SSR 时，既可以采用服务端路由，也可以使用客户端路由。服务端路由更简单，在切换页面时，通过链接，直接请求新的 html，不过这也意味着需要离开当前的页面。使用客户端导航时，页面内容的改变通过 js 进行，虽然比服务端导航复杂，但能实现更多功能。

### 推荐阅读

本项目使用了 vite-plugin-ssr，文档详细解释了许多 SSR 相关的概念。以下列出推荐阅读的部分：

- [SPA vs SSR (and more)](https://vite-plugin-ssr.com/SPA-vs-SSR)
- [Client-only Components](https://vite-plugin-ssr.com/client-only-components)
- [Server Routing VS Client Routing](https://vite-plugin-ssr.com/server-routing-vs-client-routing)

## SSR 相关代码说明

### 服务端

SSR 需要在服务端渲染页面。在开发与部署时，调用渲染代码、返回网页均由 [`server/index.js`](./server/index.js) 实现。此文件来源于 vite-plugin-ssr 的脚手架（[文件链接](https://github.com/brillout/vite-plugin-ssr/blob/main/boilerplates/boilerplate-vue/server/index.js)）。

由于我们使用的反代 Nginx 目前不支持 103 状态码，因此关闭了 [Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) 相关的功能。

服务端使用 express 框架。

## 哪些页面用了 SSR？

- 首页（`/`）：打开网页后，屏幕空间几乎全被蓝材料占据。如果只对蓝材料部分采用服务端渲染，就能得到不错的效果。如果所有数据都在服务端渲染，经过 gzip 压缩后的页面大小约为 65 KB，完全可以接受，所以对整个首页都采用 SSR。
- 攒抽（`/gachaCal`）：虽然页面的交互性很强，在下载 js 前无法使用，但使用服务端渲染能更早看到页面，显得加载速度更快。
- 基建排班（`/riicCal`）：在浏览器中渲染。因为这个页面的加载速度实在是太慢了，如果用服务端渲染，页面到达之后有很长时间不能交互，看起来像坏了一样。所以还是在浏览器中渲染，至少页面显示出来的时候就是可交互的。
- 礼包性价比（`/pack`）：在服务端渲染。

## 打包

在 [vite.config.js](./vite.config.js) 中，调用了 [rollup-plugin-external-globals](https://github.com/eight04/rollup-plugin-external-globals)。为生产环境打包时，将 vue 与 element-plus 等库排除在产物以外，在渲染网页时，通过 CDN 引入这些库，以减小产物的体积。[相关代码](./src/renderer/_default.page.server.js)

添加了 [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)。运行 `npm run build` 或 `npm run prod` 时，会在项目的根目录生成 `stats.html`，有助于直观地分析打包产物。
