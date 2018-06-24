const Config = require('../../config');
const Utils = require('../../utils');

// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 1206,
    content: ''
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
    wx.setNavigationBarTitle({
      title: '反馈'
    })
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

  confirm(evt){
    this.setData({
      content: evt.detail.value
    });
  },
  submit(){
    if(!this.data.content){
      return wx.showToast({title: '还没有填写反馈内容哦', icon: 'none'});
    }

    Utils.request(Config.service.feedback, {
      content: this.data.content
    }, (data) => {
      this.setData({content: ''});
      wx.showToast({ title: '提交成功', icon: 'none' });
    }, 'POST');
  }
})