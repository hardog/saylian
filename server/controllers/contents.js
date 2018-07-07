const Conf = require('../config');
const Db = require('../tools/db');
const moment = require('moment');
const _ = require('lodash');

// feature list
// 获取单个contents
async function queryById(ctx, next) {
  const query = ctx.query;
  const id = query.id;
  const header = ctx.header || {};
  const uid = header.sluid;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询id'
    };
    return;
  }


  const retQuery = await Db('contents')
    .select('*')
    .where('id', id);

  const retWords = await Db('words')
  .select('word')
  .where({'contentid': id, userid: uid});

  ctx.body = {
    status: 'success',
    data: {
      retQuery, retWords
    }
  };
}

// 获取内容列表
async function list(ctx, next) {
  const query = ctx.query;
  const header = ctx.header || {};
  const uid = header.sluid;

  const ret = await Db('task')
  .leftJoin('contents', 'task.contentid', 'contents.id')
  .select('title', 'type', 'content', 'path', 'time', 'meta', 'contentid', 'poster')
  .where({
    userid: uid,
    isfinish: false
  })
  .orderBy('contentid', 'desc');

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 按照类型获取内容列表
async function listByType(ctx, next) {
  const query = ctx.query;
  const page = query.page || 1;
  const size = query.size || 10;
  const startIndex = (page - 1) * size;
  const ctype = query.type;

  let ret = [];
  if (ctype == 3){
    ret = await Db.select('id', 'title', 'poster', 'learn')
      .from('group')
      .limit(size)
      .offset(startIndex)
      .orderBy('id', 'desc');
  }else if(ctype == 4){
    ret = await Db.select(
      'id', 'title', 'path', 'poster', 'meta', 'created_at'
    ).from('videos')
      .where({
        groupid: 0
      })
      .limit(size)
      .offset(startIndex)
      .orderBy('id', 'desc');
  }else{
    ret = await Db.select(
      'id', 'title', 'poster', 'content', 'path', 'meta', 'type', 'created_at'
    ).from('contents')
      .where({
        type: ctype,
        groupid: 0
      })
      .limit(size)
      .offset(startIndex)
      .orderBy('id', 'desc');
  }
  
  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 按照groupid 取数据
async function listByGroupid(ctx, next) {
  const query = ctx.query;
  const page = query.page || 1;
  const size = query.size || 10;
  const learn = query.learn || 0;
  const groupid = query.groupid;
  const startIndex = (page - 1) * size;

  let ret = [];
  if (learn != 0) {
    ret = await Db.select(
      'id', 'title', 'poster', 'content', 'path', 'meta', 'type', 'created_at'
    ).from('contents')
      .where('groupid', groupid)
      .limit(size)
      .offset(startIndex)
      .orderBy('id', 'desc');
  } else {
    ret = await Db.select(
      'id', 'title', 'path', 'poster', 'meta', 'created_at'
    ).from('videos')
      .where('groupid', groupid)
      .limit(size)
      .offset(startIndex)
      .orderBy('id', 'desc');
  }

  ctx.body = {
    status: 'success',
    data: ret
  };
}


// 获取未完成任务文章收藏的单词
async function words(ctx, next) {
  const header = ctx.header || {};
  const uid = header.sluid;

  const retTask = await Db('task')
  .select('contentid')
  .where({
    userid: uid,
    isfinish: false
  });

  const retWords = await Db('words')
  .select('word')
  .where({userid: uid })
  .whereIn('contentid', _.map(retTask, 'contentid'));

  ctx.body = {
    status: 'success',
    data: retWords
  };
}

// 更新video like 
async function updateVideoMeta(ctx, next) {
  const body = ctx.request.body;
  const id = body.id
  const ctype = body.type;

  if (!id || !ctype) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少参数(id & ctype)'
    };
    return;
  }

  const retQuery = await Db('videos')
    .select('id', 'meta')
    .where('id', id);

  const content = retQuery[0] || {};
  const meta = JSON.parse(content.meta || '{}');
  meta[ctype] = (meta[ctype] || 0) + 1;

  const ret = await Db('videos')
    .where('id', id)
    .update({ meta: JSON.stringify(meta) });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 获取收藏的单词历史，按天
async function collects(ctx, next) {
  const query = ctx.query;
  const uid = query.uid
  const page = query.page || 1;
  const size = query.size || 10;
  const startIndex = (page - 1) * size;
  
  const ret = await Db('words')
    .select('word', 'created_at', 'contentid')
    .where('userid', uid)
    .limit(size)
    .offset(startIndex)
    .orderBy('created_at', 'desc');

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 更新元信息
async function meta(ctx, next) {
  const body = ctx.request.body;
  const id = body.id
  const ctype = body.type;

  if (!id || !ctype) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少参数(id & ctype)'
    };
    return;
  }

  const retQuery = await Db('contents')
    .select('id', 'meta')
    .where('id', id);

  const content = retQuery[0] || {};
  const meta = JSON.parse(content.meta || '{}');
  meta[ctype] = (meta[ctype] || 0) + 1;

  const ret = await Db('contents')
    .where('id', id)
    .update({ meta: JSON.stringify(meta) });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

module.exports = {
  list,
  collects,
  words,
  meta,
  listByType,
  listByGroupid,
  updateVideoMeta,
  queryById
};
