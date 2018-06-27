const App = getApp();
const Dict = require('../../behaviors/dict');
const Tool = require('../../behaviors/tool');
const Config = require('../../config');
const Utils = require('../../utils');

Component({
  behaviors: [Dict, Tool],
  properties: {
    words: {
      type: Array,
      value: []
    },
    contentid: {
      type: Number,
      value: 0,
      observer: function(nv){
        if(!nv){return;}
        this.hasTask(nv);
      }
    },
    source: {
      type: Array,
      value: [],
      observer: function(nv){
        if (!nv){return;}

        const tmpContents = [];
        const len = nv.length;
        for(let i = 0; i < len; i++){
          tmpContents.push((nv[i] || '').split(' '));
        }
        this.setData({
          contents: tmpContents
        });
      }
    }
  },
  data: {
    started: false,
    finished: false,
    contents: []
  },
  ready(){
  },
  methods: {
    goTranslate(evt){
      const word = evt.currentTarget.dataset.v;
      if (!word) { return; }
      this.queryWord(word, this.data.contentid);
    },
    hasTask(){
      Utils.request(Config.service.hasTask, {
        contentid: this.data.contentid
      },
      (data) => {
        const task = data[0] || {};
        this.setData({ 
          started: !!task.id,
          finished: !!task.isfinish
        });
      });
    },
    startLearn(){
      Utils.request(Config.service.startTask, { 
        contentid: this.data.contentid
      },
      (data) => {
        const contentid = (data || {}).contentid;
        if(contentid){
          wx.showModal({
            content: '不要贪心，还有未完成的任务哦，是否立即去学习？',
            cancelText: '先看看',
            confirmText: '去学习',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../pages/learn/index?id=' + contentid,
                });
              }
            }
          })
        }else{
          this.tick(this.data.contentid, 'content', 'study');
          this.setData({ started: true });
        }
      }, 'POST');
    },
    endLearn() {
      if (this.data.finished) { return; }
      wx.navigateTo({
        url: '../../pages/check/index?id=' + this.data.contentid
      });
    }
  }
})