const App = getApp();
const Config = require('../../config');
const Utils = require('../../utils');

Component({
  properties: {
  },
  data: {
    title: Config.title,
    headurl: Config.headurl
  },
  methods: {
    getUserInfo(evt) {
      const userInfo = (evt.detail || {}).userInfo;

      wx.login({
        success: (res) => {
          if (res.code) {
            //发起网络请求
            this.check(res.code, userInfo);
          } else {
            wx.showToast({ title: '登录失败', icon: 'none' });
          }
        }
      })
    },

    check(code, userInfo) {
      Utils.request(Config.service.loginUrl, {
        userInfo: JSON.stringify(userInfo),
        code: code
      }, (data) => {
        const uInfo = Object.assign({
          openid: data.openid,
          uid: data.uid,
          token: data.token
        }, userInfo);
        
        // 保持全局值
        App.user = uInfo;

        this.triggerEvent("userInfo", uInfo);
        wx.setStorage({ key: Config.cacheKey, data: uInfo });
      });
    },
  }
})