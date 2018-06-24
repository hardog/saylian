
const Conf = require('../config');
const Db = require('../tools/db');
const fs = require('fs');
// 获取实例
const cos = require('../tools/cos');

// 音频上传
async function audio(ctx, next) {
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;
  const file = files.sl;
  const path = `audios/audio-${Date.now()}.mp3`;

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

  const retDb = await Db('contents').insert({
    dura: Math.floor(fields.dura / 1000),
    size: fields.size,
    content: fields.sltext,
    type: fields.type,
    path: path
  });

  ctx.body = { ret, retDb };
}

// 单个音频上传
async function saudio(ctx, next) {
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;
  const file = files.sl;
  const path = `audios/audio-${Date.now()}.mp3`;

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

  ctx.body = { 
    data: path  
  };
}

// daily 每日一句 + 翻译上传
async function daily(ctx, next) {
  const body = ctx.request.body;
  const zh = body.zh;
  const en = body.en;

  if(!zh || !en){
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retDb = await Db('contents').insert({
    type: 2,
    content: zh,
    translate: en
  });

  ctx.body = {
    status: 'success',
    errMsg: '提交成功'
  };
}

// 精选短文
async function article(ctx, next) {
  const body = ctx.request.body;
  const title = body.title;
  const content = body.origin;
  const intro = body.intro;

  if (!title || !content || !intro) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retDb = await Db('contents').insert({
    type: 3,
    content,
    translate: intro,
    path: title
  });

  ctx.body = {
    status: 'success',
    errMsg: '提交成功'
  };
}

// 精选短片
async function video(ctx, next) {
  const body = ctx.request.body;
  const path = body.path;
  const title = body.title;
  const poster = body.poster;

  if (!title || !path || !poster) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retDb = await Db('contents').insert({
    type: 4,
    content: poster,
    translate: title,
    path: path
  });

  ctx.body = {
    status: 'success',
    errMsg: '提交成功'
  };
}

// 单词补录
async function words(ctx, next) {
  const body = ctx.request.body;
  const words = (body.words || '').split('|');
  const uid = body.uid;


  if (words.length <= 0 || !uid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const len = words.length;
  const insertingWords = [];
  for(let i = 0; i < len; i++){
    insertingWords.push({
      userid: uid,
      word: words[i]
    });
  }

  const retDb = await Db('collects').insert(insertingWords);

  ctx.body = {
    status: 'success',
    errMsg: '提交成功'
  };
}


// 图片上传
async function poster(ctx, next) {
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;
  const poster = files.poster;
  const name = (poster.name || '');
  const suffix = name.substring(name.lastIndexOf('.'));
  const path = `posters/${Date.now()}${suffix}`;

  const params = {
    Bucket: Conf.cos.fileBucket,
    Region: Conf.cos.region,
    Key: path,
    ContentLength: poster.size,
    Body: fs.createReadStream(poster.path)
  };

  const ret = new Promise((resolve) => {
    cos.putObject(params, (err, data) => {
      resolve({ err, data });
    });
  });

  ctx.body = { 
    status: 'success',
    detal: ret,
    data: path
  };
}

module.exports = {
  audio,
  saudio,
  daily,
  article,
  video,
  words,
  poster
};