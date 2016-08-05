import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('player').then(players => {
      return Ember.RSVP.hash({
        QB: players.filterBy('type', 10).filterBy('rosterId', null).sortBy('cost').reverse(),
        RB: players.filterBy('type', 20).filterBy('rosterId', null).sortBy('cost').reverse(),
        WR: players.filterBy('type', 30).filterBy('rosterId', null).sortBy('cost').reverse(),
        TE: players.filterBy('type', 40).filterBy('rosterId', null).sortBy('cost').reverse(),
        K: players.filterBy('type', 50).filterBy('rosterId', null).sortBy('cost').reverse(),
        DST: players.filterBy('type', 60).filterBy('rosterId', null).sortBy('cost').reverse(),
      });
    });
  }
});
