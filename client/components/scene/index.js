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
    }
  },
  data: {
    isLogin: false
  },
  ready(){
    this.setData({
      isLogin: !!(App.user || {}).token
    });
  },
  methods: {
    goLearn(){
      this.tick(this.data.source.id, 'content', 'watch');
      wx.navigateTo({
        url: '../../pages/scene/index?id=' + this.data.source.id
      });
    }
  }
})