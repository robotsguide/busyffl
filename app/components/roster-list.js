import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['v-roster-list'],

  model: null,

  selection: true,

  actions: {
    selectPlayer(roster) {
      if (this.get('selection') && !Ember.isNone(roster.get('playerId'))) {
        roster.set('selected', !roster.get('selected'));
        this.sendAction('onSelect', roster);
      }
    }
  }
});
