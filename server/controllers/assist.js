const fs = require('fs');
const axios = require('axios');
const Conf = require('../config');
const Db = require('../tools/db');
const Utils = require('../tools/utils');
// 获取实例
const cos = require('../tools/cos');

async function comments(ctx, next) {
  const query = ctx.query;
  const page = query.page || 1;
  const size = query.size || 10;
  const startIndex = (page - 1) * size;
  const id = query.contentid;

  if(!id){
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
      contentid: id,
      checked: true
    })
    .limit(size)
    .offset(startIndex)
    .orderBy('id', 'desc');

  ctx.body = {
    status: 'success',
    data: ret
  };
}

async function comment(ctx, next) {
  const body = ctx.request.body;
  const content = body.content
  const header = ctx.header || {};
  const uid = header.sluid;
  const contentid = body.contentid;
  const avator = body.avator;

  if (!content || !uid || !contentid){
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retDb = await Db('comments').insert({
    content: content,
    contentid: contentid,
    userid: uid,
    avator: avator
  });

  ctx.body =  {
    status: 'success',
    data: retDb 
  };
}

async function collect(ctx, next) {
  const body = ctx.request.body;
  const word = body.word
  const contentid = body.contentid;
  const header = ctx.header || {};
  const uid = header.sluid;

  if (!word || !contentid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retQ = await Db.select('id')
  .from('words')
  .where({
    userid: uid,
    word,
    contentid
  });

  let errMsg = 'ok';
  if (retQ.length <= 0){
    const retDb = await Db('words').insert({
      userid: uid,
      word,
      contentid
    });
    
  }else{
    errMsg = 'collected';
  }
  ctx.body = {
    status: 'success',
    errMsg: errMsg
  };
}

async function feedback(ctx, next) {
  const body = ctx.request.body;
  const content = body.content;
  const fromwhere = body.type;
  const uid = body.uid;

  if (!content || !uid) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少提交参数'
    };
    return;
  }

  const retDb = await Db('feedback').insert({
    content: content,
    userid: uid,
    type: fromwhere || 'main'
  });

  ctx.body = {
    status: 'success', 
    data: retDb 
  };
}

// 语音识别
async function voicescore(ctx, next) {
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;
  const file = files.voice;
  const text = fields.text;
  const path = `audios/audio-${Date.now()}.mp3`;

  const params = {
    Bucket: Conf.cos.fileBucket,
    Region: Conf.cos.region,
    Key: path,
    ContentLength: file.size,
    Body: fs.createReadStream(file.path)
  };



  const curTime = parseInt(Date.now() / 1000, 10);
  const apiKey = Conf.xfVoiceScoreSecret;
  const voiceStr = fs.readFileSync(file.path);
  const base64VoiceStr = Buffer.from(voiceStr).toString('base64');
  const param = Buffer.from(JSON.stringify({
    aue: 'raw',
    'result_level': 'plain',
    language: 'en',
    category: 'read_sentence'
  })).toString('base64');
  const headers = {
    'X-Appid': Conf.xfAppId,
    'X-CurTime': curTime,
    'X-Param': param,
    'X-CheckSum': Utils.md5(`${apiKey}${curTime}${param}`, true),
    'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'
  };

  const ret = await axios({
    method: 'post',
    url: Conf.urls.voicescore,
    headers,
    data: {
      audio: base64VoiceStr,
      text
    }
  });

  // 存储用户语音
  // const ret = new Promise((resolve) => {
  //   cos.putObject(params, (err, data) => {
  //     resolve({ err, data });
  //   });
  // });
  // 存储音频数据
  // const retDb = await Db('contents').insert({
  //   dura: Math.floor(fields.dura / 1000),
  //   size: fields.size,
  //   content: fields.sltext,
  //   type: fields.type,
  //   path: path
  // });

  ctx.body = { 
    status: 'success', 
    errMsg: ''
   };
}


module.exports = {
  comments,
  comment,
  feedback,
  collect,
  voicescore
};
