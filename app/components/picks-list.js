import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['v-picks-list'],

  model: null,

  actions: {
    selectPick(pick) {
      pick.set('selected', !pick.get('selected'));
      this.sendAction('onSelect', pick);
    }
  }
});
