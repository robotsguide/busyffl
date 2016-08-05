import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.findAll('team').then(models => {
      return this.store.findAll('roster').then(rosters => {
        return this.store.findAll('player').then(players => {
          models.forEach((team) => {
            const ros = rosters.findBy('teamId', team.get('id'));
            this.setRoster(ros, players);
            team.set('roster', ros);
          });

          return models.sortBy('round1');
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
