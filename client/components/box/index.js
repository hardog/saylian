const App = getApp();
const Dict = require('../../behaviors/dict');
const Tool = require('../../behaviors/tool');
const Config = require('../../config');
const Utils = require('../../utils');

Component({
  behaviors: [Dict, Tool],
  properties: {
    source: {
      type: Array,
      value: []
    },
    words: {
      type: Array,
      value: []
    },
    contentid: {
      type: Number,
      value: 0,
      observer: function (nv) {
        if (!nv) { return; }
        this.hasTask(nv);
      }
    }
  },
  data: {
    started: false,
    finished: false
  },
  ready(){
  },
  methods: {
    goTranslate(evt){
      const word = evt.currentTarget.dataset.v;
      if (!word) { return; }
      this.queryWord(word, this.data.contentid);
    },
    getTranslate(){
      Utils.request(Config.service.sceneTranslate, {
        contentid: this.data.contentid
      }, (data) => {
        const content = data[0] || {};
        const translations = (content.translation || '').split('|');

        const source = [];
        const len = this.data.source.length;

        for (let i = 0; i < len; i++) {
          source[i] = Object.assign({
            translate: translations[i]
          }, this.data.source[i]);
        }

        this.setData({ source });
      });
    },

    hasTask() {
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

    startLearn() {
      Utils.request(Config.service.startTask, {
        contentid: this.data.contentid
      },
        (data) => {
          const contentid = (data || {}).contentid;
          if (contentid) {
            wx.showModal({
              content: '不要贪心，还有未完成的任务哦，前往首页继续学习？',
              cancelText: '先看看',
              confirmText: '去学习',
              success: (res) => {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/home/index'
                  });
                }
              }
            })
          } else {
            this.tick(this.data.contentid, 'content', 'study');
            this.setData({ started: true });
          }
        }, 'POST');
    },
    endLearn() {
      if (this.data.finished) { return; }
      wx.navigateTo({
        url: '../../pages/scheck/index?id=' + this.data.contentid
      });
    }
  }
})