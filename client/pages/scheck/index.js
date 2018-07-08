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
    selectOrders: [],
    userSelectOrders: [],
    rightOrders: [],
    sentences: [],
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
    wx.setNavigationBarTitle({ title: '通关测验' });
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

  bindPickerChange(evt){
    const index = evt.currentTarget.dataset.v;
    const select = parseInt(evt.detail.value, 10) + 1;

    const tmp = this.data.userSelectOrders || [];
    tmp[index] = select;

    const sentences = this.data.sentences;
    sentences[index] = Object.assign(sentences[index], {
      select: select
    });

    this.setData({
      sentences: sentences,
      userSelectOrders: tmp
    });
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
      
      let contents = (learn.content || '').split('|');
      const len = contents.length;

      if(len < 4){
        contents = contents.slice(0, 4);
      }else{
        const rand = Math.round(Math.random() * (len - 4));
        contents = contents.slice(rand, rand+4);
      }
      
      const tmp = [];
      for (let i = 0; i < contents.length; i ++){
        tmp.push(i+1);
      }

      const rightOrders = this.shuffle(Object.assign([], tmp));
      this.setData({
        selectOrders: tmp,
        rightOrders: rightOrders,
        sentences: this.getShuffleArr(contents, rightOrders)
      });
    });
  },

  getShuffleArr(sentences, rightOrder){
    const len = sentences.length;
    const tmp = [];

    for(let i = 0; i < len; i ++){
      tmp.push({
        select: 0,
        sentence: sentences[rightOrder[i] - 1]
      });
    }

    return tmp;
  },

  shuffle(arr){
    return arr.sort(function (x, y) {
      return Math.random() > 0.5 ? -1 : 1;
    });
  },

  check(){
    const userSelectOrders = this.data.userSelectOrders;
    const rightOrders = this.data.rightOrders;
    
    if (rightOrders.join(',') != userSelectOrders.join(',')){
      return wx.showToast({title: '句子顺序排列错误，请重新作答', icon: 'none'});
    }

    Utils.request(Config.service.endTask, {
      contentid: this.data.id
    },
    (data) => {
      wx.showModal({
        content: '恭喜你，顺利过关~',
        confirmText: '确定',
        showCancel: false,
        success: (res) => {
          wx.navigateBack({delta: 1});
        }
      })
    }, 'POST');
  }
})