const Config = require('./config');
const App = getApp();

// 通用请求工具
const request = (api, data, cb, method) => {
  const reqData = Object.assign({
    uid: (App.user || {}).uid,
    openid: (App.user || {}).openid
  }, data);
  wx.request({
    url: api,
    header: {
      sltoken: (App.user || {}).token,
      sluid: (App.user || {}).uid,
      slopenid: (App.user || {}).openid
    },
    data: reqData,
    method: method || 'GET',
    success: (res) => {
      if (res.statusCode === 200
        && res.data.status === 'success') {
        cb && cb((res.data || {}).data);
      } else {
        wx.showToast({ title: `出错咯(${(res.data || {}).errMsg || ''})`, icon: 'none' });
      }
    },
    fail: (err) => {
      wx.showToast({ title: `请求错误(${JSON.stringify(err)})`, icon: 'none' });
    }
  });
};


module.exports = { request }
