const Conf = require('../config');
const fs = require('fs');
const Db = require('../tools/db');
// 获取实例
const cos = require('../tools/cos');

// 获取内容列表
async function follows(ctx, next) {
  const query = ctx.query;
  const page = query.page || 1;
  const size = query.size || 10;
  const startIndex = (page - 1) * size;
  const dailyid = query.dailyid;
  const header = ctx.header || {};
  const uid = header.sluid;

  if (!dailyid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数dailyid'
    };
    return;
  }

  const ret = await Db('dailyfollow')
  .leftJoin('cSessionInfo', 'dailyfollow.userid', 'cSessionInfo.uuid')
  .select('dailyfollow.id', 'user_info', 'path', 'like')
  .where('dailyid', dailyid)
  .limit(size)
  .offset(startIndex)
  .orderBy('like', 'desc');

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 获取徘行
async function query(ctx, next) {
  const dailyid = ctx.query.dailyid;
  const userid = (ctx.header || {}).sluid;

  const ret = await Db('daily').select(
    'id', 'sentence', 'translate', 'path', 'poster', 'meta'
  ).limit(1).orderBy('created_at', 'desc');

  let retFollow = [];
  if(dailyid && userid){
    retFollow = await Db('dailyfollow')
    .count('* as count')
    .where({
      userid, dailyid
    });
  }

  ctx.body = {
    status: 'success',
    data: { ret, retFollow }
  };
}

// 获取单个daily内容
async function queryById(ctx, next) {
  const id = ctx.query.id;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数id'
    };
    return;
  }
  const ret = await Db('daily').select(
    'id', 'sentence', 'translate', 'path', 'poster', 'meta'
  ).where('id', id);

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 更新daily meta信息
async function updateMeta(ctx, next) {
  const meta = ctx.request.body.meta;
  const id = ctx.request.body.id;

  if (!meta || !id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数(meta or id)'
    };
    return;
  }

  const ret = await Db('daily')
    .where('id', id)
    .update({ meta });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 更新dailyfollow like信息
async function updateFollowLike(ctx, next) {
  const id = ctx.request.body.id;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数(id)'
    };
    return;
  }

  const retQuery = await Db('dailyfollow')
    .select('id', 'like')
    .where('id', id);

  const follow = retQuery[0] || {};
  follow.like += 1;

  const ret = await Db('dailyfollow')
    .where('id', id)
    .update({ like: follow.like });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 更新dailyfollow like信息
async function updateDailyLike(ctx, next) {
  const id = ctx.request.body.id;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数(id)'
    };
    return;
  }

  const retQuery = await Db('daily')
    .select('id', 'meta')
    .where('id', id);

  const daily = retQuery[0] || {};
  const meta = JSON.parse(daily.meta || '{}');
  meta.like = (meta.like || 0) + 1;


  const ret = await Db('daily')
    .where('id', id)
    .update({ meta: JSON.stringify(meta) });

  ctx.body = {
    status: 'success',
    data: ret
  };
}


// 新增daily follow
async function addFollow(ctx, next) {
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;
  const file = files.follow;

  const dailyid = fields.dailyid;
  const userid = (ctx.header || {}).sluid;
  const path = `audios/audio-${Date.now()}.mp3`;

  if (!dailyid || !userid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数(dailyid or userid)'
    };
    return;
  }

  const params = {
    Bucket: Conf.cos.fileBucket,
    Region: Conf.cos.region,
    Key: path,
    ContentLength: file.size,
    Body: fs.createReadStream(file.path)
  };

  const ret = new Promise((resolve) => {
    cos.putObject(params, (err, data) => {
      resolve({ err, data });
    });
  });

  const retQuery = await Db('dailyfollow')
    .select('id')
    .where({
      userid, dailyid
    });

  let retUpdate;
  if (retQuery.length >= 1){
    retUpdate = await Db('dailyfollow')
      .where('id', retQuery[0].id)
      .update({ path });
  }else{
    retUpdate = await Db('dailyfollow')
      .insert({
        userid,
        dailyid,
        path,
        like: 0
      });
  }

  ctx.body = {
    status: 'success',
    data: { ret, retUpdate, path }
  };
}



module.exports = {
  follows,
  query,
  queryById,
  updateMeta,
  updateFollowLike,
  updateDailyLike,
  addFollow
};
