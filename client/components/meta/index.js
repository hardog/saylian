const App = getApp();
const Tool = require('../../behaviors/tool');
const Config = require('../../config');
const Utils = require('../../utils');

Component({
  behaviors: [Tool],
  properties: {
    source: {
      type: Object, 
      value: {},
      observer: function(nv){
        if (!nv){ return; }
        let meta = nv.meta || {};
        if (typeof meta === 'string'){
          meta = JSON.parse(meta);
        }

        const items = this.data.items;
        for (let i = 0; i < items.length; i++){
          items[i] = Object.assign(items[i], {
            count: meta[items[i].title] || 0
          });
        }
        this.setData({ items });
      }
    },
    disable: {
      type: Array,
      value: [],
      observer: function(nv){
        if(nv.length <= 0){return;}
        const len = nv.length;
        const items = this.data.items;
        for (let i = 0; i < items.length; i++) {
          const raw = items[i];
          if(nv.indexOf(raw.title) !== -1){
            items[i] = Object.assign(raw, {
              active: false
            });
          }
        }
        this.setData({ items });
      }
    },
    ctype: {
      type: String,
      value: false
    }
  },
  data: {
    items: [
      { title: 'study', icon: '../../images/study.png', tapedIcon: '', count: 0, active: true, index: 0},
      { title: 'watch', icon: '../../images/read.png', tapedIcon: '', count: 0, active: true, index: 1}, 
      { title: 'comment', icon: '../../images/comment.png', tapedIcon: '', count: 0, active: true, index: 2}, 
      { title: 'like', icon: '../../images/like-gray.png', tapedIcon: '../../images/liked.png', count: 0, active: true, index: 3}
    ]
  },
  ready(){
  },
  methods: {
    taped(evt){
      const item = evt.currentTarget.dataset.v || {};
      if (!this.data.ctype || !this.data.source.id || item.taped){
        return;
      }
      
      if(item.title === 'like'){
        this.tick(this.data.source.id, this.data.ctype, 'like');
        const items = this.data.items;
        item.taped = true;
        item.count += 1;
        items[item.index] = item;
        this.setData({ items });
      }
    }
  }
})