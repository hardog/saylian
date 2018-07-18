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
    height: 1206,
    daily: {},
    follows: [],
    curUserFollowed: 0,
    words: '',
    readingText: '',
    voiceFilePath: '',
    audioCtx: null,
    isListening: false,
    recordManager: null,
    timeHandle: null,
    count: 0,
    showBack: false,
    hasMore: true,
    loginShow: false,
    thumb: {
      like: '../../images/thumbsup.png',
      liked: '../../images/thumbsuped.png'
    },
    page: 1,
    size: 10
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
      this.queryDaily();
      this.queryFollows();
      this.setData({ loginShow: false});
    } else {
      this.setData({ loginShow: true});
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const recordManager = wx.getRecorderManager();
    const audioCtx = wx.createInnerAudioContext();
    
    audioCtx.onEnded(() => {
      this.setData({ isListening: false });
    });
    audioCtx.onStop(() => {
      this.setData({ isListening: false });
    });
    recordManager.onStop((file) => {
      this.data.audioCtx.src = file.tempFilePath;
      this.setData({ voiceFilePath: file.tempFilePath });
    });
    this.setData({ recordManager, audioCtx });

    wx.setNavigationBarTitle({
      title: '每日听力'
    });
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
    if (this.data.hasMore){
      this.setData({
        page: this.data.page + 1
      });
      this.queryFollows();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '敢不敢跟我比比谁的发音更棒～',
      path: 'pages/ranges/index?id='+this.data.id+'&from=share',
      imageUrl: '../../images/sl.png'
    };
  },

  backHome(){
    wx.switchTab({
      url: '/pages/home/index'
    })
  },

  onBindUserInfo(evt) {
    const userInfo = (evt.detail || {});
    this.setData({ loginShow: false });
    this.queryArticle();
    this.queryComments();
  },

  queryDaily(){
    Utils.request(Config.service.daily, {
      dailyid: this.data.id
    }, 
    (d) => {
      const data = d.ret
      const followed = (d.retFollow[0] || {}).count || 0;

      const daily = data[0] || {};
      const words = (daily.sentence || '').split(' ');
      this.setData({ daily, words, curUserFollowed: followed });
    });
  },

  thumbs(evt){
    const item = evt.currentTarget.dataset.v || {};

    if(item.thumbed){return;}
    item.like += 1;
    item.thumbed = true; 

    Utils.request(Config.service.updateFollowLike, {
      id: item.id
    },
    (data) => {
      const follows = this.data.follows;
      follows[item.index] = item;

      this.setData({ follows });
    }, 'POST');
  },

  queryFollows(reset) {
    if (!this.data.id) { return; }
    Utils.request(Config.service.follows, {
      page: this.data.page,
      size: this.data.size,
      dailyid: this.data.id
    }, (data) => {
      let hasMore = true;
      if (data.length < this.data.size) {
        hasMore = false;
      }

      let follows = [];
      if (reset){
        follows = this.parseUserInfo(data);
      }else{
        follows = this.data.follows.concat(this.parseUserInfo(data));
      }
      this.setData({ follows, hasMore });
    });
  },

  parseUserInfo(follows){
    const len = follows.length;
    const tmps = [];
    
    for(let i = 0; i < len; i++){
      const raw = follows[i];
      const user = JSON.parse(raw.user_info);
      tmps.push(Object.assign(raw, {
        index: i,
        thumbed: false,
        nick: user.nickName,
        avator: user.avatarUrl
      }));
    }

    return tmps;
  },

  followRead(){
    if (this.data.readingText){
      this.data.timeHandle && clearInterval(this.data.timeHandle);
      this.data.recordManager.stop();
      this.setData({ readingText: '' });
    }else{
      this.setData({ readingText: '.' });
      this.startTick();
    }
  },

  startTick(){
    this.data.recordManager.start({ format: 'mp3' });
    const timeHandle = setInterval(() => {
      const count = this.data.count + 1;

      if(count >= 60){
        this.data.timeHandle && clearInterval(this.data.timeHandle);
        this.data.recordManager.stop();
        this.setData({ readingText: '', count: 0 });
        return;
      }
      
      switch (this.data.readingText.length){
        case 0:
          this.setData({ readingText: '.', count });
          break;
        case 1:
          this.setData({ readingText: '..', count });
          break;
        case 2:
          this.setData({ readingText: '...', count });
          break;
        case 3:
          this.setData({ readingText: '....', count });
          break;
        case 4:
          this.setData({ readingText: '.', count });
          break;
      }
    }, 1000)
    this.setData({ timeHandle });
  },

  listen(){
    if (this.data.readingText) {
      this.data.timeHandle && clearInterval(this.data.timeHandle);
      this.data.recordManager.stop();
      this.setData({ readingText: '' });
    }

    if(this.data.isListening){
      this.data.audioCtx.stop();
    }else{
      this.data.audioCtx.play();
    }
    this.setData({ isListening: !this.data.isListening });
  },

  submit(){
    wx.uploadFile({
      url: Config.service.addFollow,
      filePath: this.data.voiceFilePath,
      name: 'follow',
      header: {
        sltoken: (App.user || {}).token,
        sluid: (App.user || {}).uid,
        slopenid: (App.user || {}).openid 
      },
      formData: {
        dailyid: this.data.id
      },
      success: (ret) => {
        const d = JSON.parse(ret.data);
        if (d.status === 'success' && d.data.retInsert[0]){
          wx.showToast({title: '提交成功', icon: 'none'});
          this.queryFollows(true);
          this.setData({ curUserFollowed: 1 });
        }else{
          wx.showToast({ title: '抱歉失败了，稍后再试哦~', icon: 'none' });
        }
      }
    })
  }
})