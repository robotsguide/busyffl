import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import setRoster from 'busyffl/utils/set-roster';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    const auth = this.get('session.session.content.authenticated');
    return this.store.findAll('member').then(members => {
      const member = members.findBy('username', auth.username);
      return this.store.findAll('team').then(teams => {
        const team = teams.findBy('ownerId', member.id);
        return this.store.findAll('roster').then(rosters => {
          const roster = rosters.findBy('teamId', team.id);

          team.set('roster', roster);
          member.set('team', team);

          return this.store.findAll('player').then(players => {
            setRoster(roster, players);
            return member;
          });
        });
      });
    });
  }
});
