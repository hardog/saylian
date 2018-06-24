const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const verify = require('./middlewares/verify')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const config = require('./config')

app.use(serve(__dirname + '/static'))
// 使用响应处理中间件
app.use(response)
// 解析请求体
app.use(bodyParser())

// token验证
app.use(verify)

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
