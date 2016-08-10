import Ember from 'ember';
import setRoster from 'busyffl/utils/set-roster';

export default Ember.Component.extend({

  session: Ember.inject.service('session'),
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
      const myTeam = teams.findBy('ownerId', this.get('session.session.authenticated.id'));
      teams.removeObject(myTeam);

      this.set('teams', teams);
    });
  },

  loadRoster(team) {
    this.get('store').findAll('roster').then(rosters => {
      const roster = rosters.findBy('teamId', team.id);
      this.get('store').findAll('player').then(players => {
        setRoster(roster, players);
        team.set('roster', roster);
        this.set('tradePlayers', []);
      });
    });
  },

  actions: {
    closeAction() {
      this.sendAction('onClose');
    },

    pickTeam(team) {
      this.set('selectedTeam', team);
      this.loadRoster(team);
    },

    selectPlayer(position) {
      console.log('position', position);
      if (!Ember.isNone(this.get(`selectedTeam.roster.${position}`))) {
        this.get('tradePlayers').push(this.get(`selectedTeam.roster.${position}Id`));
        this.get('selectedTeam.roster').set(`${position}Selected`, !this.get(`selectedTeam.roster.${position}Selected`));
      }
    },

    cancelSelectedTeam() {
      this.set('selectedTeam.roster.quarterBackSelected', false);
      this.set('selectedTeam.roster.runningBack1Selected', false);
      this.set('selectedTeam.roster.runningBack2Selected', false);
      this.set('selectedTeam.roster.wideReceiver1Selected', false);
      this.set('selectedTeam.roster.wideReceiver2Selected', false);
      this.set('selectedTeam.roster.tightEndSelected', false);
      this.set('selectedTeam.roster.flexSelected', false);
      this.set('selectedTeam.roster.kickerSelected', false);
      this.set('selectedTeam.roster.defenseSelected', false);
      this.set('selectedTeam.roster.bench1Selected', false);
      this.set('selectedTeam.roster.bench2Selected', false);
      this.set('selectedTeam.roster.bench3Selected', false);
      this.set('selectedTeam.roster.bench4Selected', false);
      this.set('selectedTeam.roster.bench5Selected', false);
      this.set('selectedTeam', null);
    }
  }
});
