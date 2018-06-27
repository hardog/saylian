const Config = require('../../config');
const Utils = require('../../utils');
const App = getApp();
// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    selectedWords: [],
    userFillWords: [],
    wrongIndex: [],
    words: [],
    loginShow: false,
    height: 1206,
    showBack: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      showBack: (options.from === 'share')
    });

    const user = App.user || {};
    if (user.uid && user.token && user.openid) {
      this.queryArticle();
      this.setData({ loginShow: false });
    } else {
      this.setData({ loginShow: true });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  onBindUserInfo(evt) {
    const userInfo = (evt.detail || {});
    this.setData({ loginShow: false });
  },

  backHome(){
    wx.switchTab({
      url: '/pages/home/index'
    })
  },

  queryArticle(){
    wx.showLoading({
      title: '正在查询...'
    });

    Utils.request(Config.service.queryByContentsId, {
      id: this.data.id
    }, (d) => {
      wx.hideLoading();
      const learn = (d.retQuery || [])[0] || {};
      const contents = (learn.content || '').replace(/\|/g, ' ').split('.');
      this.randomGetFourWords(contents);
    });
  },

  randomGetFourWords(contents){
    const maxLen = contents.length || 0;
    const startIndex = Math.random() * (maxLen - 3);
    const selectedSentence = contents.slice(startIndex, startIndex+3);
    const selectedWords = [];
    const words = selectedSentence.join('. ').split(' ');
    const wordsMaxLen = parseInt(Math.random() * words.length, 10);
    const randIndexs = [
      parseInt(Math.random() * words.length, 10),
      parseInt(Math.random() * words.length, 10),
      parseInt(Math.random() * words.length, 10),
      parseInt(Math.random() * words.length, 10)
    ];

    let incre = 0;
    const tmp = [];
    for (let i = 0; i < words.length; i++){
      const word = (words[i] || '').replace(/\.|,/g, '').trim();
      if (randIndexs.indexOf(i) !== -1 && word){
        selectedWords.push(word);
        tmp.push({
          real: word,
          width: word.length * 12,
          index: incre++
        });
      }else{
        tmp.push({ word });
      }
    }
    this.setData({
      words: tmp,
      selectedWords
    });
  },

  wordinput(evt){
    const item = evt.currentTarget.dataset.v || {};
    const fillWords = this.data.userFillWords;
    const wrongIndex = this.data.wrongIndex;

    fillWords[item.index] = evt.detail.value;

    if (evt.detail.value === item.real){
      wrongIndex[item.index] = true;
    }else{
      wrongIndex[item.index] = false;
    }
    
    this.setData({
      wrongIndex,
      userFillWords: fillWords
    });
  },

  check(){
    const checkIndex = this.data.wrongIndex;
    const len = checkIndex.length;

    for(let i = 0; i < len; i++){
      if (!checkIndex[i]){
        return wx.showToast({title: `第${i+1}项填写错误`, icon: 'none'});
      }
    }

    Utils.request(Config.service.endTask, {
      contentid: this.data.id
    },
    (data) => {
      wx.showModal({
        content: '恭喜你，学习效果检验通过完成学习～',
        confirmText: '确定',
        showCancel: false,
        success: (res) => {
          wx.navigateTo({
            url: '../../pages/learn/index?id=' + this.data.id
          });
        }
      })
    }, 'POST');
  }
})