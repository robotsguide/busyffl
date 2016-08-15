import Ember from 'ember';

export default Ember.Controller.extend({
  openRoster: false,
  openPosition: false,
  player: null,
  team: null,

  actions: {
    assignRoster(player) {
      return player;
    },

    //    console.log(player);
    //    this.set('openRoster', true);
    //    this.set('player', player);
    //},

  //  choosePosition(team) {
  //    const roster = this.get('model.rosters').findBy('teamId', team.id);

  //    team.set('roster', roster);
  //    this.set('team', team);
  //    this.set('openPosition', true);
  //  },

  //  assign(position) {
  //    console.log(position, this.get('team.roster'), this.get('player'));

  //    this.set(`team.roster.${position}Id`, this.get('player.id'));
  //    this.set('player.rosterId', this.get('team.roster.id'));

  //    Ember.RSVP.hash({
  //      roster: this.get('team.roster').save(),
  //      player: this.get('player').save()
  //    }).then(data => {
  //      this.set('team', null);
  //      this.set('player', null);
  //      this.set('openPosition', false);
  //      this.set('openRoster', false);
  //    });
  //  }
  },
});
