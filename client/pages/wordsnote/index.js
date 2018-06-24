const App = getApp();
const Config = require('../../config');
const Utils = require('../../utils');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cache: {},
    height: 1206,
    words1: [],
    words2: [],
    nowords: false,
    loginShow: false,
    page: 1,
    size: 10,
    hasMore: true
  },

  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const user = App.user || {};
    if (user.uid && user.token && user.openid) {
      this.queryWords();
      this.setData({ loginShow: false });
    } else {
      this.setData({ loginShow: true });
    }
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        });
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的单词本'
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasMore){return;}
    this.setData({
      page: this.data.page + 1
    });
    this.queryWords();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const user = (App.user || {});
    const sign = `uid=${user.uid}&openid=${user.openid}&token=${user.token}`;
    return {
      title: '记单词不用背，结合文章学习so easy~',
      path: 'pages/wordsnote/index',
      imageUrl: '../../images/sl.png'
    };
  },

  onBindUserInfo(evt) {
    const userInfo = (evt.detail || {});
    this.setData({ loginShow: false });
    this.queryWords();
  },

  navToDetail(evt){
    const item = evt.currentTarget.dataset.v || {};
    wx.navigateTo({
      url: '../../pages/learn/index?id=' + item.contentid,
    });
  },

  queryWords(){
    if (!this.data.hasMore){return;}
    wx.showLoading({ title: '正在查询...' });
    Utils.request(Config.service.wcollects, {
      page: this.data.page,
      size: this.data.size
    }, (data) => {
      wx.hideLoading();
      let hasMore = true;
      if(data.length < this.data.size){
        hasMore = false;
      }

      const len = data.length;
      const tmpwords1 = [], tmpwords2 = [];
      for(let i = 0; i < len; i++){
        const raw = data[i];
        if(i % 2){
          tmpwords2.push({
            word: raw.word,
            contentid: raw.contentid,
            date: (raw.created_at || '').substr(0, 10),
            rand: parseInt(Math.random() * 6) + 1
          })
        }else{
          tmpwords1.push({
            word: raw.word,
            contentid: raw.contentid,
            date: (raw.created_at || '').substr(0, 10),
            rand: parseInt(Math.random() * 4) + 1
          })
        }
      }

      this.setData({
        hasMore,
        nowords: (len === 0),
        words1: this.data.words1.concat(tmpwords1),
        words2: this.data.words2.concat(tmpwords2)
      })
    });
  },

  wordtap(evt){
    const word = evt.currentTarget.dataset.v;
    if(!word){return;}
    wx.showLoading({ title: '正在查词...' });

    let promises = Promise.resolve(this.data.cache[word]);

    if (!this.data.cache[word]) {
      promises = new Promise((resolve) => {
        Utils.request(Config.service.translate, {
          word
        }, resolve);
      });
    }

    promises.then((data) => {
      const cache = this.data.cache;
      cache[word] = data;
      this.setData({ cache });

      let phonetic = (data.basic || {})['us-phonetic'];
      let explains = (data.basic || {}).explains || [];

      if (explains.length <= 0) {
        explains.push(data.translation || []);
      }

      if (phonetic) {
        explains = [`美音: [${phonetic}]`].concat(explains);
      }

      wx.hideLoading();
      if (explains.length > 0) {
        const modalConfig = {
          title: `[${word}]`,
          content: explains.join('\n'),
          cancelText: '关闭',
          showCancel: false
        };

        wx.showModal(modalConfig);
      } else {
        wx.showToast({ title: '没有该翻译文本', icon: 'none' });
      }
    });
  }
})