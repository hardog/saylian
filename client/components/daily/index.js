const App = getApp();
const Dict = require('../../behaviors/dict');
const Config = require('../../config');
const Utils = require('../../utils');

Component({
  behaviors: [Dict],
  properties: {
    source: {
      type: Object, // String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {},
      observer: function(nv){
        const contents = (nv.sentence || '').split(' ');
        this.setData({
          words: contents
        });
      }
    }
  },
  data: {
    prefix: Config.cosPrefix,
    words: '',
    icon: '../../images/like.png'
  },
  ready(){
  },
  methods: {
    like(){
      let meta = JSON.parse(this.data.source.meta || '{}');
      meta.like = (meta.like || 0) + 1;
      const metaStr = JSON.stringify(meta);
      const source = this.data.source;
      source.meta = metaStr;
      
      Utils.request(Config.service.updateDailyLike, {
        id: this.data.source.id
      }, (data) => {
        this.setData({
          icon: '../../images/liked.png',
          source
        })
      }, 'POST');
    },
    goRead(){
      wx.navigateTo({
        url: '../../pages/ranges/index?id=' + this.data.source.id,
      });
    },

    wordtaped(evt){
      let word = (evt.currentTarget.dataset.v || '');
      if(!word){return;}
      this.translate(word);
    }
  }
})