const axios = require('axios');
const fs = require('fs');
const Utils = require('../tools/utils');
const Conf = require('../config');

async function translate(ctx, next) {
  const query = ctx.query;
  const word = query.word || '';

  if (!word) {
    ctx.body = {
      status: 'fail',
      errMsg: '缺少查询文本'
    };
    return;
  }

  const wordutf8 = Buffer.from(word).toString();
  const salt = Date.now();
  const signstr = (Conf.translateAppKey + wordutf8 + salt + Conf.translateAppSecret);
  const sign = Utils.md5(signstr);

  const ret = await axios.get(Conf.urls.translate, {
    params: {
      q: wordutf8,
      from: 'EN',
      to: 'zh-CHS',
      appKey: Conf.translateAppKey,
      salt: salt,
      sign: sign
    }
  });

  ctx.body = {
    status: 'success',
    data: ret.data
  };
}

async function ocr(ctx, next) {
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;
  const img = files.ocr;

  if (!img || !img.path || !img.name) {
    ctx.body = {
      status: 'fail',
      errMsg: '还未上传图片'
    };
    return;
  }

  const imgstr = fs.readFileSync(img.path);
  const imgstrBase64 = imgstr.toString('base64');

  const ret = await axios({
    method: 'post',
    url: Conf.urls.ocr,
    headers: {
      Authorization: `APPCODE ${Conf.ocrAppCode}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    data: {
      image: imgstrBase64,
      configure: '{"min_size":16,"output_prob":true}'
    }
  });

  ctx.body = {
    status: 'success',
    data: ret.data
  };
}

module.exports = {
  translate,
  ocr
};
