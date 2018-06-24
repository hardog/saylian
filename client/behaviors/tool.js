const Config = require('../config');
const Utils = require('../utils');
// 工具函数
module.exports = Behavior({
  properties: {
  },
  data: {
    urlMap: {
      dailyLike: Config.service.updateDailyLike,
      followLike: Config.service.updateFollowLike,
      contentLike: Config.service.meta,
      content: Config.service.meta,
      videoLike: Config.service.updateVideoMeta,
      video: Config.service.updateVideoMeta
    }
  },
  attached: function () { },
  methods: {
    tick(id, keyOrUrl, type) {
      Utils.request(this.data.urlMap[keyOrUrl] || keyOrUrl, { id, type }, 
      (data) => {}, 'POST');
    }
  }
})