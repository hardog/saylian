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
    tabs: ['跟着学', '短片学习', '精读短文', '随便看看'],
    items: [[],[],[],[]],
    types: [3, 2, 1, 4],
    page: [1, 1, 1, 1],
    hasMore: [true, true, true, true],
    loaded: {},
    size: 10,
    current: 0,
    userInfo: {},
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

  reachBottom(){
    const page = this.data.page;
    page[this.data.current] += 1;
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
      this.query(3);
    }

    wx.setNavigationBarTitle({
      title: '内容类别'
    });
  },

  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (evt) {
    let shareTitle, path;

    if (evt.from === 'button') {
      let target = evt.target.dataset.v || {};
      shareTitle = '我正在学习#'+target.title + '#快来一起学习吧！';
console.log('target:', target)
      if(target.type == 1){
        path = 'pages/learn/index?id=' + target.id + '&from=share';
      }else if(target.learn !== undefined){
        path = 'pages/group/index?from=share&groupid=' + target.id;
      }else{
        path = 'pages/share/index?from=share&vid=' + (target.vid || target.path) + '&title=' + target.title + '&poster=' + target.poster;
      }
    }

    return {
      title: shareTitle || '学习精美短文视频，助力英语学习更上一层楼',
      path: path || 'pages/category/index',
      imageUrl: App.user.avatarUrl || '../../images/sl.png'
    };
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

  onTabTap(evt){
    this.setData({ flShow: false });
    if (this.data.loginShow){return;}
    const current = parseInt(evt.currentTarget.dataset.index, 10);
    this.setData({ current });

    const data = this.data.items[current];
    if (data.length <= 0) {
      this.query();
    }
  },
  onSwipeChange(evt){
    this.setData({ flShow: false });
    const current = evt.detail.current;
    this.setData({ current });
    const data = this.data.items[current];
    if (data.length <= 0){
      this.query();
    }
  },

  query(type){
    const mark = `${this.data.current}${this.data.page[this.data.current]}`;
    if (!this.data.hasMore[this.data.current] || this.data.loaded[mark]){return;}
    const loaded = this.data.loaded;
    loaded[mark] = true;
    this.setData({ loaded });
    wx.showLoading({ title: '正在查询...' });

    Utils.request(Config.service.listByType, {
      type: type || this.data.types[this.data.current],
      page: this.data.page[this.data.current],
      size: this.data.size
    },
    (data) => {
      const len = data.length;
      const hasMore = this.data.hasMore;

      wx.hideLoading();
      if(len < this.data.size) {
        hasMore[this.data.current] = false;
      }

      const items = this.data.items;
      items[this.data.current] = items[this.data.current].concat(data);
      this.setData({ hasMore, items })
    });
  }
})