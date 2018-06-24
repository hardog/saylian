
const Conf = require('../config');
const COS = require('cos-nodejs-sdk-v5');


// 创建实例
const cos = new COS({
  SecretId: Conf.SecretId,
  SecretKey: Conf.SecretKey,
});

module.exports = cos;