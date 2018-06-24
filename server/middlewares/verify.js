const Utils = require('../tools/utils');
const Conf = require('../config');

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
  const header = ctx.header || {};
  const token = header.sltoken
  const openid = header.slopenid
  const uid = header.sluid;

  if (token !== Utils.md5(openid + uid + Conf.loginSecret)
    && Conf.unless.indexOf(ctx.path) === -1
    && !/^\/static/.test(ctx.path)){
   ctx.body = {
     status: 'fail',
     errMsg: 'token verify fail'
   }
  }else{
    await next();
  }
}
