const Config = require('../config');
const Utils = require('../utils');
// dict.js 点词翻译&收藏行为
module.exports = Behavior({
  properties: {
  },
  data: {
    cache: {},
    contentid: 0,
    collectingWords: []
  },
  attached: function () { },
  methods: {
    collectInTime(word, cb) {
      wx.showToast({ title: `已收录[${word}]`, duration: 300, icon: 'none' });
      const collectingWords = this.data.collectingWords;
      collectingWords.push(word);
      this.setData({ collectingWords });

      this.data.timeHandle && clearTimeout(this.data.timeHandle);
      this.setData({
        timeHandle: setTimeout(() => {
          cb && cb(this.data.collectingWords.join(' '));
          this.setData({
            collectingWords: [],
            timeHandle: null
          });
        }, 1200)
      });
    },
    queryWord(word, contentid) {
      word = word.replace(/[,|\.|?]/g, '');
      if (!contentid){
        return wx.showToast({title: '缺少关联文章', icon: 'none'});
      }

      this.setData({ contentid });
      this.collectInTime(word, (words) => {
        this.translate(words, true);
      });
    },
    translate(words, needConfirm){
      wx.showLoading({ title: '正在查词...' });
      
      let promises = Promise.resolve(this.data.cache[words]);
      
      if(!this.data.cache[words]){
        promises = new Promise((resolve) => {
          Utils.request(Config.service.translate, {
            word: words
          }, resolve);
        });
      }

      promises.then((data) => {
        wx.hideLoading();

        const cache = this.data.cache;
        cache[words] = data;
        this.setData({ cache });

        let phonetic = (data.basic || {})['us-phonetic'];
        let explains = (data.basic || {}).explains || [];

        if (explains.length <= 0) {
          explains.push(data.translation || []);
        }

        if (phonetic) {
          explains = [`美音: [${phonetic}]`].concat(explains);
        }

        
        if (explains.length > 0) {
          const modalConfig = {
            title: `[${words}]`,
            content: explains.join('\n'),
            cancelText: '关闭'
          };

          if (needConfirm){
            modalConfig.confirmText = '收藏';
            modalConfig.success = (res) => {
              if (res.confirm) {
                this.collectword(words);
              }
            };
          }else{
            modalConfig.showCancel = false;
          }
          wx.showModal(modalConfig);
        } else {
          wx.showToast({ title: '没有该翻译文本', icon: 'none' });
        }
      });
    },
    collectword(words) {
      wx.showToast({ title: `正在收藏...`, icon: 'none' });

      Utils.request(Config.service.collect, {
        word: words,
        contentid: this.data.contentid
      }, (data) => {
        wx.showToast({ title: '已收藏, 记得复习哦～', icon: 'none' });
      }, 'POST');
    }
  }
})