const Conf = require('../config');
const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
// 创建实例
const cos = new COS({
  SecretId: Conf.SecretId,
  SecretKey: Conf.SecretKey,
});

function dealVideos(lists){
  const len = lists.length;
  const tmp = [];
  for(let i = len - 1; i >= 0; i--){
    const raw = lists[i];
    const Key = raw.Key || '';
    const lastDotIndex = Key.lastIndexOf('.');
    
    tmp.push({
      key: Key,
      title: Key.substring(0, lastDotIndex)
    });
  }

  return tmp;
}
/**
 * 响应 GET 请求
 */
async function list(ctx, next) {
  const params = {
    Bucket: 'uva-1256719691',    /* 必须 */
    Region: 'ap-shanghai',    /* 必须 */
    Prefix: '',    /* 非必须 */
    Delimiter: '', /* 非必须 */
    Marker: '0',    /* 非必须 */
    MaxKeys: '20',    /* 非必须 */
    EncodingType: 'url'
  };

  const ret = await new Promise((resolve) => {
    cos.getBucket(params, (err, data) => {
      resolve({err, data});
    });
  });

  if(ret.err){
    ctx.body = [];
  }else{
    ctx.body = dealVideos((ret.data || []).Contents);
  }
}

async function upload(ctx, next){
  const fields = ctx.request.body.fields;
  const files = ctx.request.body.files;
  const file = files.video; 
  var params = {
    Bucket: 'uva-1256719691',                        /* 必须 */
    Region: 'ap-shanghai',                        /* 必须 */
    Key: fields.title || file.name,              /* 必须 */
    ContentLength: file.size,                    /* 必须 */

    // CacheControl: 'STRING_VALUE',                    /* 非必须 */
    // ContentDisposition: 'STRING_VALUE',            /* 非必须 */
    // ContentEncoding: 'STRING_VALUE',                /* 非必须 */
    // ContentType: 'STRING_VALUE',                    /* 非必须 */
    // Expect: 'STRING_VALUE',                        /* 非必须 */
    // Expires: 'STRING_VALUE',                        /* 非必须 */
    // ContentSha1: 'STRING_VALUE',                    /* 非必须 */
    // ACL: 'STRING_VALUE',                            /* 非必须 */
    // GrantRead: 'STRING_VALUE',                        /* 非必须 */
    // GrantWrite: 'STRING_VALUE',                    /* 非必须 */
    // GrantFullControl: 'STRING_VALUE',                /* 非必须 */
    // 'x-cos-meta-*': 'STRING_VALUE',                /* 非必须 */
    Body: fs.createReadStream(file.path)
  };
  const ret = new Promise((resolve) => {
    cos.putObject(params, (err, data) => {
      resolve({ err, data });
    });
  });

  ctx.body = ret;
};

module.exports = {
  list,
  upload
};
