const App = getApp();
const Config = require('../../config');
// pages/home/index.js
Page({
  
  data: {
    height: 1206,
    userInfo: {},
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
    if (this.data.showed && !this.data.loginShow) { return; }

    const user = App.user || {};
    if (!user.uid || !user.token || !user.openid) {
      this.setData({ loginShow: true, showed: true });
    } else {
      this.setData({ 
        userInfo: user,
        loginShow: false,
        showed: true
      });
    }

    wx.setNavigationBarTitle({
      title: '我的'
    });
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

    this.setData({
      userInfo: userInfo,
      loginShow: false
    });
  },


  goFeedback(){
    wx.navigateTo({
      url: '../../pages/feedback/index',
    });
  },
  goMyWordsNote(){
    wx.navigateTo({
      url: '../../pages/wordsnote/index',
    });
  },
  goFeatures() {
    wx.navigateTo({
      url: '../../pages/features/index',
    });
  },

  goResList(){
    wx.navigateTo({
      url: '../../pages/resources/index',
    });
  }
})