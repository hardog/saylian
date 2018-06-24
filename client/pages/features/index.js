const App = getApp();

Page({
  
  data: {
    showBack: false
  },

  onLoad: function (options) {
    this.setData({
      showBack: (options.from === 'share')
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { 
    
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
      title: '说练英语功能列表'
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
    return {
      title: '这么多功能，还不够学英语？',
      path: 'pages/features/index?from=share',
      imageUrl: '../../images/sl.png'
    };
  },

  backHome(){
    wx.switchTab({
      url: '/pages/home/index'
    })
  }
})