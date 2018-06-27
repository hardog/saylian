const App = getApp();
const Tool = require('../../behaviors/tool');
const Config = require('../../config');

Component({
  behaviors: [Tool],
  externalClasses: ['out-cls'],
  properties: {
    source: {
      type: Object,
      value: {}
    },
    ctype: {
      type: String,
      value: 'contentLike'
    },
    disable: {
      type: Array,
      value: []
    },
    needLearn: {
      type: Boolean,
      value: false
    }
  },
  data: {
    prefix: Config.cosPrefix,
    netNoticed: false,
    isLogin: false,
    height: 1206
  },
  ready(){
    this.setData({
      isLogin: !!(App.user || {}).token
    });

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        });
      }
    })
  },
  methods: {
    goLearn(){
      this.tick(this.data.source.id, 'content', 'watch');
      wx.navigateTo({
        url: '../../pages/learn/index?id=' + this.data.source.id,
      });
    },

    goWatch(evt) {
      this.tick(this.data.source.id, (this.data.ctype == 'contentLike' ? 'content': 'video'), 'watch');
      this.netTypeJudge(() => {
        this.triggerEvent('show', this.data.source.path);
      });
    },

    netTypeJudge(cb) {
      if (this.data.netNoticed) {
        return cb && cb();
      }
      wx.getNetworkType({
        success: (res) => {
          const networkType = res.networkType
          if (networkType !== 'wifi') {
            wx.showModal({
              title: '网络环境',
              content: '当前网络非WIFI环境，视频可能消耗较多流量是否继续?',
              cancelText: '不看了',
              confirmText: '继续观看',
              success: (res) => {
                if (res.confirm) {
                  cb && cb();
                  this.setData({ netNoticed: true });
                }
              }
            });
          } else {
            cb && cb();
          }
        },
        fail: function (res) {
          console.log(res)
        }
      });
    }
  }
})