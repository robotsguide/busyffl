import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
//import setRoster from 'busyffl/utils/set-roster';
import loadAll from 'busyffl/utils/load-all';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model() {
    return loadAll(this.store).then(data => {
      return this.store.findAll('trade-request').then(trades => {
        return this.getTradeData(trades, data);
      });
    });
  },

  getTradeData(trades, data) {
    trades.forEach(item => {
      const toPlayer = item.get('toPlayer').split(',');
      const fromPlayer = item.get('fromPlayer').split(',');
      const toPick = item.get('toPick').split(',');
      const fromPick = item.get('fromPick').split(',');


      const fromTeam = data.teams.findBy('id', item.get('fromTeamId'));
      const toTeam = data.teams.findBy('id', item.get('toTeamId'));

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
