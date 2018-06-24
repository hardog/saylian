const Config = require('../../config');

Component({
  properties: {
    source: {
      type: Object, // String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {},
      observer: function(nv){
        if(nv.id){
          this.setData({
            path: nv.path
          });
        }
      }
    },
    size: {
      type: Number,
      value: 60
    }
  },
  data: {
    icon: {
      start: '../../images/play.png',
      pause: '../../images/pause.png',
    },
    prefix: Config.cosPrefix,
    path: '',
    start: false
  },
  ready(){
    const ctx = wx.createInnerAudioContext();
    ctx.onEnded(() => {
      this.setData({
        start: !this.data.start
      });
    });
    ctx.onStop(() => {
      this.setData({
        start: !this.data.start
      });
    });
    this.setData({
      audioCtx: ctx
    });
  },
  methods: {
    play(){
      this.data.audioCtx.src = `${this.data.prefix}${this.data.path}`;
      if (this.data.start){
        this.data.audioCtx.pause();
      }else{
        this.data.audioCtx.play();
      }
      
      this.setData({
        start: !this.data.start
      });
    }
  }
})