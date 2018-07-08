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
    words: [],
    contents: {},
    prefix: Config.cosPrefix,
    loginShow: false,
    learn: {},
    startTime: 0,
    height: 1206,
    justFilm: false,
    showBack: false,
    comments: [],
    hasMore: true,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      justFilm: !!options.film,
      showBack: (options.from === 'share')
    });

    const user = App.user || {};
    if (user.uid && user.token && user.openid) {
      this.queryArticle();
      this.queryComments();
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ startTime: Date.now() });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const endTime = Date.now();
    const learned = (endTime - this.data.startTime);

    if (learned >= 10000) {
      this.updateTask(learned);
    }
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
    this.loadMoreComment();
  },

  loadMoreComment(){
    if (this.data.hasMore) {
      this.setData({
        page: this.data.page + 1
      });
      this.queryComments();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这篇文章你肯定听不懂，不信就来试试～',
      path: 'pages/learn/index?id='+this.data.id+'&from=share',
      imageUrl: '../../images/sl.png'
    };
  },

  onBindUserInfo(evt) {
    const userInfo = (evt.detail || {});
    this.setData({ loginShow: false });
    this.queryArticle();
    this.queryComments();
  },

  backHome(){
    wx.switchTab({
      url: '/pages/home/index'
    })
  },

  // 更新任务学习时间
  updateTask(time){
    Utils.request(Config.service.updateTaskTime, {
      contentid: this.data.id,
      time: parseInt(time/1000, 10)
    },
    (data) => {}, 'POST');
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
      wx.setNavigationBarTitle({ title: learn.title || '' });
      this.setData({
        learn,
        words: this.pluck(d.retWords, 'word'),
        contents: (learn.content || '').split('|')
      });
    });
  },

  pluck(arr, key){
    const words = [];
    const len = arr.length;
    for(let i = 0; i < len; i++){
      words.push(arr[i][key]);
    }
    return words;
  },

  updateComments(evt){
    const detail = evt.detail || {};
    const comments = [{
      content: detail.content,
      avator: detail.avator
    }].concat(this.data.comments);
    this.setData({ comments });
  },
  queryComments() {
    if (!this.data.id) { return; }
    Utils.request(Config.service.comments, {
      page: this.data.page,
      size: this.data.size,
      contentid: this.data.id
    }, (data) => {
      let hasMore = true;
      if (data.length < this.data.size) {
        hasMore = false;
      }
      const comments = this.data.comments.concat(data);
      this.setData({ comments, hasMore });
    });
  }
})