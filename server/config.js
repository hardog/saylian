const secure = require('./.secure');

const CONF = {
    port: '5757',
    rootPathname: '',

    miniIndentity: {
      main: {
        id: 'wxd87fd87a037b1a10',
        secret: secure.miniProgramSecret
      }
    },

    // 登录加密密钥 
    loginSecret: secure.loginSecret,

    // bucket
    SecretId: 'AKIDPtPuPGk630zzzzQjWcjpuy1DSwRrqdv0',
    SecretKey: secure.bucketKey,

    // 翻译API配置
    translateAppKey: '1dd5cef381a2dfda',
    translateAppSecret: secure.translateSecret,
    // 阿里云
    ocrAppCode: secure.ocrAppCode,
    // 讯飞
    xfAppId: '5b1c7ec0',
    xfVoiceScoreSecret: secure.xfVoiceScoreSecret,

    urls: {
      openid: 'https://api.weixin.qq.com/sns/jscode2session',
      translate: 'https://openapi.youdao.com/api',
      ocr: 'https://tysbgpu.market.alicloudapi.com/api/predict/ocr_general',
      voicescore: 'http://api.xfyun.cn/v1/service/v1/ise'
    },

    unless: [
      '/weapp/login',
      '/weapp/db/create',
      '/weapp/contents/list',
      '/weapp/contents/listByType',
      '/weapp/tool/translate',
      '/weapp/contents/meta'
    ],

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: secure.dbSecret,
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
      region: 'ap-shanghai',
        // Bucket 名称
      fileBucket: secure.fileBucket,
        // 文件夹
      uploadFolder: 'uva'
    }
}

module.exports = CONF
