const App = getApp();
const Dict = require('../../behaviors/dict');
const Config = require('../../config');

Component({
  behaviors: [Dict],
  externalClasses: ['out-cls'],
  properties: {
    source: {
      type: Object,
      value: {}
    }
  },
  data: {
  },
  ready(){
  },
  methods: {
    wordtap(evt){
      const word = evt.currentTarget.dataset.v;
      if(!word){return;}
      this.translate(word);
    }
  }
})