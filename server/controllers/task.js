const Conf = require('../config');
const Db = require('../tools/db');

// 查询是否有任务
async function hasTask(ctx, next) {
  const id = ctx.query.contentid;
  const header = ctx.header || {};
  const uid = header.sluid;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数id'
    };
    return;
  }
  const ret = await Db('task').select('*')
    .where({
    contentid: id,
    userid: uid
  });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 更新任务时间
async function updateTaskTime(ctx, next) {
  const time = ctx.request.body.time;
  const id = ctx.request.body.contentid;
  const header = ctx.header || {};
  const uid = header.sluid;

  if (!time || !id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数(time or id)'
    };
    return;
  }

  const ret = await Db('task')
    .where({
      contentid: id,
      userid: uid,
      isfinish: false
    })
    .update({ time });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 开始学习任务
async function startTask(ctx, next) {
  const id = ctx.request.body.contentid;
  const header = ctx.header || {};
  const uid = header.sluid;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数(id)'
    };
    return;
  }

  const retQuery = await Db('task')
  .select('id', 'contentid')
  .where({
    userid: uid,
    isfinish: false
  }); 

  if (retQuery.length > 0){
    ctx.body = {
      status: 'success',
      data: retQuery[0]
    };
    return;
  }

  const ret = await Db('task').insert({
    contentid: id,
    userid: uid,
    time: 0,
    isfinish: false
  }); 

  ctx.body = {
    status: 'success',
    data: ret
  };
}

// 结束任务
async function endTask(ctx, next) {
  const id = ctx.request.body.contentid;
  const header = ctx.header || {};
  const uid = header.sluid;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数(id)'
    };
    return;
  }

  const ret = await Db('task')
    .where({
      contentid: id,
      userid: uid
    })
    .update({ isfinish: true });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

module.exports = {
  hasTask,
  startTask,
  endTask,
  updateTaskTime
};
