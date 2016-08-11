import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import setRoster from 'busyffl/utils/set-roster';
import loadAll from 'busyffl/utils/load-all';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return loadAll(this.store).then(data => {
      data.teams.forEach((team) => {
         const ros = data.teamRosters.filterBy('teamId', team.get('id')).sortBy('rosterPosition');
         setRoster(ros, data.players);
         team.set('teamRosters', ros);
       });

      return data.teams.sortBy('name');
    });
  },

  actions: {
    openTeam(team) {
      this.transitionTo('teams.team', team);
    }
  }
});
