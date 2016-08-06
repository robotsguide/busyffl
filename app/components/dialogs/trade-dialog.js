import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service('store'),

  players: null,
  teams: null,

  selsectedTeam: null,

  showTeams: true,

  init() {
    this._super(...arguments);

    this.loadTeams();
  },

  loadTeams() {
    this.get('store').findAll('team').then(teams => {
      this.set('teams', teams);
    });
  },

  actions: {
    closeAction() {
      this.sendAction('onClose');
    },

    pickTeam(team) {
      this.set('selectedTeam', team);
    },
  }
});
