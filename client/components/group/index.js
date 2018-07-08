const App = getApp();
const Config = require('../../config');

Component({
  externalClasses: ['out-cls'],
  properties: {
    source: {
      type: Object,
      value: {}
    }
  },
  data: {
    prefix: Config.cosPrefix
  },
  ready(){
    
  },
  methods: {
    goLists(){
      wx.navigateTo({
        url: '../../pages/group/index?groupid=' + this.data.source.id + '&learn='+this.data.source.learn + '&title=' + this.data.source.title,
      });
    }
  }
})