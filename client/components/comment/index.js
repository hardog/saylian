const App = getApp();
const Tool = require('../../behaviors/tool');
const Config = require('../../config');
const Utils = require('../../utils');

Component({
  behaviors: [Tool],
  properties: {
    contentid: {
      type: Number,
      value: 0
    }
  },
  data: {
    content: ''
  },
  ready(){
  },
  methods: {
    confirm(evt){
      this.setData({
        content: (evt.detail || {}).value
      });
    },
    submit(){
      if (!this.data.contentid) { return; }
      if (!this.data.content) {
        return wx.showToast({ title: '还没有填写内容哦', icon: 'none' });
      }

      Utils.request(Config.service.comment, {
        avator: (App.user || {}).avatarUrl,
        contentid: this.data.contentid,
        content: this.data.content
      }, (data) => {
        this.tick(this.data.contentid, 'content', 'comment');
        this.triggerEvent('commentOk', {
          content: this.data.content,
          avator: App.user.avatarUrl
        });
        this.setData({ content: '' });
        wx.showToast({ title: '评论成功(审核成功后显示)', icon: 'none' });
      }, 'POST');
    }
  }
})