const App = getApp();
const Tool = require('../../behaviors/tool');
const Config = require('../../config');

Component({
  behaviors: [Tool],
  externalClasses: ['out-cls'],
  properties: {
    source: {
      type: Object,
      value: {},
      observer: function(nv){
        if(!nv){return;}
        this.setData({
          intro: (nv.content || '').replace(/\|/g, '')
        });
      }
    }
  },
  data: {
    intro: '',
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
        url: '../../pages/learn/index?id=' + this.data.source.id
      });
    }
  }
})