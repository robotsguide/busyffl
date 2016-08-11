import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import setRoster from 'busyffl/utils/set-roster';
import loadAll from 'busyffl/utils/load-all';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(param) {
    return loadAll(this.store).then(data => {
      const member = data.members.findBy('id', param.id);
      const team = data.teams.findBy('ownerId', member.id);

      const picks = data.draftPicks.filterBy('teamId', team.id).sortBy('roundNumber');
      const roster = data.teamRosters.filterBy('teamId', team.id).sortBy('rosterPosition');

      setRoster(roster, data.players);

      team.set('teamRosters', roster);
      team.set('draftPicks', picks);
      member.set('team', team);

      return member;
    });
  }
});
