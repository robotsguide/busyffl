import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import setRoster from 'busyffl/utils/set-roster';
import loadAll from 'busyffl/utils/load-all';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    const auth = this.get('session.session.content.authenticated');
    return loadAll(this.store).then(data => {
      const member = data.members.findBy('username', auth.username);
      const team = data.teams.findBy('ownerId', member.id);
      const picks = data.draftPicks.filterBy('teamId', team.id).sortBy('roundNumber');
      const roster = data.teamRosters.filterBy('teamId', team.id).sortBy('rosterPosition');

      setRoster(roster, data.players);

      team.set('teamRosters', roster);
      team.set('draftPicks', picks);

      member.set('team', team);

      return Ember.RSVP.hash({
        member: member,
        trades: this.store.findAll('trade-request')
      }).then(models => {
        let requests = models.trades.filterBy('rejectedOn', null);
        requests = requests.filterBy('acceptedOn', null);
        //requests = requests.filterBy('toTeamId', team.id);

        return {member: models.member, trades: this.getTradeData(team, requests, data)};
      });
    });
  },

  getTradeData(team, trades, data) {
    trades.forEach(item => {
      const toPlayer = item.get('toPlayer').split(',');
      const fromPlayer = item.get('fromPlayer').split(',');
      const toPick = item.get('toPick').split(',');
      const fromPick = item.get('fromPick').split(',');

      const fromTeam = data.teams.findBy('id', item.get('fromTeamId'));
      const toTeam = data.teams.findBy('id', item.get('toTeamId'));

      if(team.id === toTeam.id) {
        item.set('isRequested', true);
      }

      item.set('fromTeam', fromTeam);
      item.set('toTeam', toTeam);

      const fromPlayerArray = [];
      fromPlayer.forEach(id => {
        const player = data.players.findBy('id', id);
        fromPlayerArray.pushObject(player);
      });

      const toPlayerArray = [];
      toPlayer.forEach(id => {
        const player = data.players.findBy('id', id);
        toPlayerArray.pushObject(player);
      });

      const fromPickArray = [];
      fromPick.forEach(id => {
        const pick = data.draftPicks.findBy('id', id);
        if(!Ember.isNone(pick)) {
          fromPickArray.pushObject(pick);
        }
      });

      const toPickArray = [];
      toPick.forEach(id => {
        const pick = data.draftPicks.findBy('id', id);
        if(!Ember.isNone(pick)) {
          toPickArray.pushObject(pick);
        }
      });

      item.set('fromPlayerModels', fromPlayerArray);
      item.set('toPlayerModels', toPlayerArray);
      item.set('fromPickModels', fromPickArray);
      item.set('toPickModels', toPickArray);
    });

    return trades;
  }
});
