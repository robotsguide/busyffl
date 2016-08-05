import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('player').then(players => {
      return Ember.RSVP.hash({
        QB: players.filterBy('type', 10).sortBy('cost').reverse(),
        RB: players.filterBy('type', 20).sortBy('cost').reverse(),
        WR: players.filterBy('type', 30).sortBy('cost').reverse(),
        TE: players.filterBy('type', 40).sortBy('cost').reverse(),
        K: players.filterBy('type', 50).sortBy('cost').reverse(),
        DST: players.filterBy('type', 60).sortBy('cost').reverse(),
        teams: this.store.findAll('team'),
        rosters: this.store.findAll('roster')
      });
    });
  }
});
