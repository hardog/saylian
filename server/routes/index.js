/**
 * ajax 服务路由集合
 */
const koaBody = require('koa-body')({ 
  multipart: true,
  formLimit: '150kb',
  textLimit: '150kb',
  formidable: {
    maxFieldsSize: '10mb', // 最大10mb
    maxFileSize: '20mb'
  }
})
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers');

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', controllers.user)

// 首页内容
router.get('/contents/queryById', controllers.contents.queryById);
router.get('/contents/list', controllers.contents.list);
router.get('/contents/listByType', controllers.contents.listByType); 
router.get('/contents/listByGroupid', controllers.contents.listByGroupid); 
router.get('/contents/words', controllers.contents.words);
router.get('/contents/collects', controllers.contents.collects);
router.post('/contents/meta', controllers.contents.meta);
router.post('/contents/updateVideoMeta', controllers.contents.updateVideoMeta);

// task
router.get('/task/hasTask', controllers.task.hasTask);
router.post('/task/startTask', controllers.task.startTask);
router.post('/task/endTask', controllers.task.endTask);
router.post('/task/updateTaskTime', controllers.task.updateTaskTime);

// daily
router.get('/daily/follows', controllers.day.follows);
router.get('/daily/query', controllers.day.query);
router.get('/daily/queryById', controllers.day.queryById);
router.get('/daily/updateMeta', controllers.day.updateMeta);
router.post('/daily/addFollow', koaBody, controllers.day.addFollow);
router.post('/daily/updateFollowLike', controllers.day.updateFollowLike);
router.post('/daily/updateDailyLike', controllers.day.updateDailyLike);

// 首页内容上传管理类型
router.post('/admin/audio', koaBody, controllers.admin.audio);
router.post('/admin/singleaudio', koaBody, controllers.admin.saudio);
router.post('/admin/poster', koaBody, controllers.admin.poster);
router.post('/admin/daily', controllers.admin.daily);
router.post('/admin/article', controllers.admin.article);
router.post('/admin/video', controllers.admin.video);
router.post('/admin/words', controllers.admin.words);

router.post('/tool/ocr', koaBody, controllers.tool.ocr);
router.get('/tool/translate', controllers.tool.translate);
router.get('/db/create', controllers.db.create);

router.post('/assist/feedback', controllers.assist.feedback);
router.post('/assist/collect', controllers.assist.collect);
router.post('/assist/comment', controllers.assist.comment);
router.get('/assist/comments', controllers.assist.comments);
router.get('/assist/films', controllers.assist.films);
router.get('/assist/filmscode', controllers.assist.filmsone);
router.post('/assist/voicescore', koaBody, controllers.assist.voicescore);

// 说练日更接口
router.get('/rg/list', controllers.article.list);
router.get('/rg/detail', controllers.article.detail);
router.post('/rg/collect', controllers.article.collect);
router.post('/rg/comment', controllers.article.comment);
router.get('/rg/comments', controllers.article.comments);


module.exports = router
