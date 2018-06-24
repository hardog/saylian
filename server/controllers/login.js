const Config = require('../config');
const Db = require('../tools/db');
const Utils = require('../tools/utils');
const axios = require('axios');

// 登录授权接口
module.exports = async (ctx, next) => {
  const query = ctx.query;
  const userInfoRaw = query.userInfo;
  const miniType = query.minitype || 'main';

  const ret = await axios.get(Config.urls.openid, {
    params: {
      appid: Config.miniIndentity[miniType].id,
      secret: Config.miniIndentity[miniType].secret,
      js_code: query.code,
      grant_type: 'authorization_code'
    }
  });

  const openid = (ret.data || {}).openid;
  if (!openid){
    ctx.body = {
      status: 'fail',
      errMsg: `check code failed(${JSON.stringify(ret.data)})`
    };
    return;
  }


  const retQuery = await Db('cSessionInfo').where({
    open_id: openid
  }).select('uuid', 'open_id');
  
  let uid;
  const user = (retQuery[0] || {});
  if (retQuery.length >= 1){
    uid = user.uuid;
  }else{
    const retDb = await Db('cSessionInfo').insert({
      open_id: openid,
      session_key: (ret.data || {}).session_key,
      user_info: userInfoRaw
    });
    uid = retDb[0];
  }

  ctx.body = {
    status: 'success',
    data: {
      status: (uid ? 'success' : 'fail'),
      mgr: (openid === 'oDJou5VPlFUkNsW9tX1VGhQgVbZs'),
      openid: openid,
      uid: uid,
      token: Utils.md5(openid + uid + Config.loginSecret)
    }
  };
}
