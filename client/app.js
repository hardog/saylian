//app.js
// var qcloud = require('./vendor/wafer2-client-sdk/index')
const Config = require('./config')

App({
    onLaunch: function () {
        // qcloud.setLoginUrl(config.service.loginUrl)
      // this.user = wx.getStorageSync(Config.cacheKey);
    },
    user: wx.getStorageSync(Config.cacheKey)
})