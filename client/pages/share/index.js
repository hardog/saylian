const Config = require('../../config');
const Utils = require('../../utils');
const App = getApp();
// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vid: '',
    title: '',
    poster: '',
    height: 1206,
    showBack: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      vid: options.vid,
      title: options.title,
      poster: options.poster,
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这个怎么能错过？#' + this.data.title + '#赶快来围观～',
      path: 'pages/share/index?vid='+this.data.vid+'&title='+this.data.title+'&poster='+this.data.poster+'&from=share',
      imageUrl: this.data.poster || '../../images/sl.png'
    };
  },

  backHome(){
    wx.switchTab({
      url: '/pages/home/index'
    })
  }
})