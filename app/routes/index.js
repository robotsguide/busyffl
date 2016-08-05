import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

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
            this.setRoster(roster, players);
            return member;
          });
        });
      });
    });
  },

  setRoster(roster, players) {
    roster.set('quarterBack', players.findBy('id', roster.get('quarterBackId')));
    roster.set('runningBack1', players.findBy('id', roster.get('runningBack1Id')));
    roster.set('runningBack2', players.findBy('id', roster.get('runningBack2Id')));
    roster.set('wideReceiver1', players.findBy('id', roster.get('wideReceiver1Id')));
    roster.set('wideReceiver2', players.findBy('id', roster.get('wideReceiver2Id')));
    roster.set('tightEnd', players.findBy('id', roster.get('tightEndId')));
    roster.set('flex', players.findBy('id', roster.get('flexId')));
    roster.set('kicker', players.findBy('id', roster.get('kickerId')));
    roster.set('defense', players.findBy('id', roster.get('defenseId')));
    roster.set('bench1', players.findBy('id', roster.get('bench1Id')));
    roster.set('bench2', players.findBy('id', roster.get('bench2Id')));
    roster.set('bench3', players.findBy('id', roster.get('bench3Id')));
    roster.set('bench4', players.findBy('id', roster.get('bench4Id')));
    roster.set('bench5', players.findBy('id', roster.get('bench5Id')));
  }
});