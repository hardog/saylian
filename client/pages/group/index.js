const App = getApp();
const Utils = require('../../utils');
const Config = require('../../config');
const txvContext = requirePlugin("tencentvideo");

// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prefix: Config.cosPrefix,
    height: 1206,
    scrolly: true,
    groupid: '',
    learn: false,
    items: [],
    page: 1,
    size: 10,
    hasMore: true,
    userInfo: {},
    flShow: false,
    currentPath: '',
    loginShow: false,
    showed: false,
    showBack: false,
    defaultTitle: '分组学习'
  },

  onLoad: function (options) {
    this.setData({
      groupid: options.groupid,
      defaultTitle: options.title,
      learn: (options.learn == undefined || options.learn == 0 ? 0 : 1),
      showBack: (options.from === 'share')
    });

    wx.setNavigationBarTitle({
      title: options.title
    });
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

  reachBottom(){
    if(!this.data.hasMore){return;}
    const page = this.data.page + 1;
    this.setData({ page });
    this.query();
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    if (this.data.showed && !this.data.loginShow){return;}
    
    const user = App.user || {};
    if (!user.uid || !user.token || !user.openid) {
      this.setData({ 
        loginShow: true,
        showed: true
      });
    }else{
      this.setData({ 
        userInfo: user,
        showed: true,
        loginShow: false
      });
      this.query();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (evt) {
    let shareTitle, path;
    
    if (evt.from === 'button') {
      let target = evt.target.dataset.v || {};
      shareTitle = '我正在学习#' + target.title + '#快来一起学习吧！';
      path = 'pages/share/index?from=share&vid=' + (target.vid || target.path) + '&title=' + target.title + '&poster=' + target.poster;
    }
    
    return {
      title: shareTitle || this.data.defaultTitle,
      path: path || 'pages/group/index?groupid=' + this.data.groupid,
      imageUrl: App.user.avatarUrl || '../../images/sl.png'
    };
  },

  backHome() {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },

  fullscreenHide() {
    this.setData({ flShow: false });
  },

  hackvShow(evt){
    this.setData({
      flShow: true,
      currentPath: evt.detail
    });
  },

  onBindUserInfo(evt) {
    const userInfo = (evt.detail || {});

    this.setData({
      userInfo: userInfo,
      loginShow: false
    });
    this.query();
  },

  query(){
    if (!this.data.hasMore){return;}
    wx.showLoading({ title: '正在查询...' });

    Utils.request(Config.service.listByGroupid, {
      groupid: this.data.groupid,
      learn: this.data.learn,
      page: this.data.page,
      size: this.data.size
    },
    (data) => {
      const len = data.length;
      let hasMore = this.data.hasMore;

      wx.hideLoading();
      if(len < this.data.size) {
        hasMore = false;
      }

      this.setData({ hasMore, items: data })
    });
  }
})