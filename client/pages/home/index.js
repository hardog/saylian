const App = getApp();
const Config = require('../../config');
const Utils = require('../../utils');
// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prefix: Config.cosPrefix,
    daily: {},
    task: {},
    dayAgoWords: [],
    fl: {
      show: false
    },
    height: 1206,
    flShow: false,
    currentPath: '',
    loginShow: false,
    showed: false
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
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    if (this.data.showed && !this.data.loginShow) { 
      this.queryDayAgoWords();
      this.queryContents();
      this.queryDaily();
      return; 
    }

    const user = App.user || {};
    if (user.uid && user.token && user.openid) {
      this.queryDayAgoWords();
      this.queryContents();
      this.queryDaily();
      this.setData({ loginShow: false, showed: true });
    } else {
      this.setData({ loginShow: true, showed: true });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (evt) {
    let shareTitle, path;

    if(evt.from === 'button'){
      let target = evt.target.dataset.v || {};
      shareTitle = '这你都听不懂？#' + target.title + '#';

      if (target.type == 1) {
        path = 'pages/learn/index?id=' + target.id + '&from=share';
      } else {
        path = 'pages/share/index?from=share&vid=' + (target.vid || target.path) + '&title=' + target.title + '&poster=' + target.poster;
      }
    }
    return {
      title: shareTitle || '为你打造的专属英语学习帮手，快来学习吧～',
      path: path || 'pages/home/index',
      imageUrl: App.user.avatarUrl || '../../images/sl.png'
    };
  },

  touchShare(evt){
    this.setData({
      share: evt.detail
    });
  },

  fullscreenHide() {
    this.setData({ flShow: false });
  },

  hackvShow(evt) {
    this.setData({
      flShow: true,
      currentPath: evt.detail
    });
  },

  onBindUserInfo(evt) {
    const userInfo = (evt.detail || {});
    this.setData({ loginShow: false });
    this.queryDayAgoWords();
    this.queryContents();
    this.queryDaily();
  },

  queryContents(page){
    wx.showLoading({ title: '正在查询...' });

    Utils.request(Config.service.list, {},
      (data) => {
        wx.hideLoading();
        const task = data[0] || {};
        task.id = task.contentid;
        if (task){
          this.setData({ task });
        }
    });
  },

  queryDayAgoWords(){
    Utils.request(Config.service.words, 
    {}, (data) => {
      if(data.length <= 1 && !(data[0] || {}).word){return;}
      this.setData({dayAgoWords: data});
    });
  },

  queryDaily() {
    Utils.request(Config.service.daily,
      {}, (d) => {
        const data = d.ret;
        if (data[0]){
          this.setData({ daily: data[0] });
        }
      });
  },

  goFeatures(){
    wx.navigateTo({
      url: '../../pages/features/index',
    });
  }
})