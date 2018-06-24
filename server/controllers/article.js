const Conf = require('../config');
const Db = require('../tools/db');

async function list(ctx, next) {
  const query = ctx.query;
  const page = query.page || 1;
  const size = query.size || 10;
  const startIndex = (page - 1) * size;
  const aid = query.audioid;

  if (!aid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数'
    };
    return;
  }

  const ret = await Db.select(
    'content', 'avator'
  ).from('comments')
    .where({
      'audioid': aid,
      'checked': true
    })
    .limit(size)
    .offset(startIndex)
    .orderBy('id', 'desc');

  ctx.body = {
    status: 'success',
    data: ret
  };
}

async function detail(ctx, next) {
  const query = ctx.query;
  const id = query.id;

  if (!id) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const ret = await Db.select(
    'content', 'avator'
  ).from('rgArticles')
  .where({
    'id': id
  });

  ctx.body = {
    status: 'success',
    data: ret
  };
}

async function comment(ctx, next) {
  const body = ctx.request.body;
  const content = body.content
  const uid = body.uid;
  const aid = body.audioid;
  const avator = body.avator;

  if (!content || !uid || !aid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retDb = await Db('comments').insert({
    content: content,
    audioid: aid,
    userid: uid,
    avator: avator
  });

  ctx.body = {
    status: 'success',
    data: retDb
  };
}

async function comments(ctx, next) {
  const query = ctx.query;
  const page = query.page || 1;
  const size = query.size || 10;
  const startIndex = (page - 1) * size;
  const aid = query.audioid;

  if (!aid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询参数'
    };
    return;
  }

  const ret = await Db.select(
    'content', 'avator'
  ).from('comments')
    .where({
      'audioid': aid,
      'checked': true
    })
    .limit(size)
    .offset(startIndex)
    .orderBy('id', 'desc');

  ctx.body = {
    status: 'success',
    data: ret
  };
}

async function collect(ctx, next) {
  const body = ctx.request.body;
  const word = body.word
  const uid = body.uid;

  if (!word || !uid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retQ = await Db.select('id')
    .from('collects')
    .where({
      'userid': uid,
      'word': word
    });

  let errMsg = 'ok';
  if (retQ.length <= 0) {
    const retDb = await Db('collects').insert({
      word: word,
      userid: uid
    });

  } else {
    errMsg = 'collected';
  }
  ctx.body = {
    status: 'success',
    errMsg: errMsg
  };
}

module.exports = {
  list,
  detail,
  comment,
  comments,
  collect
};
