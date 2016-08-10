import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['v-roster-list'],

  model: null,

  actions: {
    selectPlayer(player) {
      this.sendAction('onSelect', player);
    }
  }
});
