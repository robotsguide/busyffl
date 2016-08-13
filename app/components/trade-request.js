import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['v-trade-request'],

  store: Ember.inject.service('store'),
  model: null,

  players: null,
  disabled: false,

  hasFromPlayers: Ember.computed('model.fromPlayerModels.[]', 'model.fromPickModels.[]', function() {
    return (this.get('model.fromPlayerModels.length') > 0 || this.get('model.fromPickModels.length') > 0);
  }),

  hasToPlayers: Ember.computed('model.toPlayerModels.[]', 'model.toPickModels.[]', function() {
    return (this.get('model.toPlayerModels.length') > 0 || this.get('model.toPickModels.length') > 0);
  }),

  findEmptyRosterSpot(rosters) {
    let roster;
    rosters.forEach(ros => {
      if (ros.get('rosterPosition') >= 100) {
        if (Ember.isNone(ros.get('playerId')) && Ember.isNone(roster)) {
          roster = ros;
        }
      }
    });

    return roster;
  },

  getOpenPosition(roster) {
   let position = 100;
   const bench = roster.filter(item => {
     return item.get('rosterPosition') >= 100;
   });

   let last = 0;
   bench.forEach(item => {
     if(last === item.get('rosterPosition')) {
       item.set('rosterPosition', last+1);
       item.save();
     }

     if(item.get('playerId') && position === item.get('rosterPosition')) {
       position = position + 1;
     }

     last = item.get('rosterPosition');
   });

   return position;
  },

  addToRoster(player, team) {
    // get a current open roster spot or create a new one.
    let newRoster = this.findEmptyRosterSpot(team.get('teamRosters'));
    if(Ember.isNone(newRoster)) {
      const pos = this.getOpenPosition(team.get('teamRosters'));
      newRoster = this.get('store').createRecord('team-roster', {
        teamId: team.id,
        rosterPosition: pos
      });
    }

    // set player id on roster
    newRoster.set('playerId', player.id);
    newRoster.set('markedForDrop', false);

    // save the roster
    return newRoster.save().then(ros => {
      // set the players roster id
      player.set('rosterId', ros.id);

      // save the player
      return player.save().then(pl => {
        // add player and roster
        ros.set('player', pl);
        team.get('teamRosters').pushObject(ros);

        // retrun roster
        return ros;
      });
    });
  },

  movePlayerRosters(players, team) {
    const rosterPromise = [];
    players.forEach(player => {
      const ros = this.get('rosters').findBy('playerId', player.id);

      // add to new team roster
      rosterPromise.push(this.addToRoster(player, team));

      if(!Ember.isNone(ros)) {
        // remove old roster
        if (ros.get('rosterPosition') >= 105) {
          rosterPromise.push(ros.destroyRecord());
        } else {
          ros.set('playerId', null);
          rosterPromise.push(ros.save());
        }
      }
    });

    return Ember.RSVP.all(rosterPromise);
  },

  moveDraftPicks(picks, teamId) {
    const picksPromise = [];
    picks.forEach(pick => {
      pick.set('teamId', teamId);
      picksPromise.push(pick.save());
    });

    return Ember.RSVP.all(picksPromise);
  },

  getTeamData(trade) {
    return Ember.RSVP.hash({
      toTeam: this.get('store').findRecord('team', trade.get('toTeamId')),
      fromTeam: this.get('store').findRecord('team', trade.get('fromTeamId')),
      rosters: this.get('store').findAll('team-roster'),
      players: this.get('store').findAll('player')
    }).then(data => {
      this.set('players', data.players);
      this.set('rosters', data.rosters);

      return {
        toTeam: this.getTeamRoster(data.toTeam, data.rosters, data.players),
        fromTeam: this.getTeamRoster(data.fromTeam, data.rosters, data.players)
      };
    });
  },

  getTeamRoster(team, rosters, players) {
    const teamRosters = rosters.filterBy('teamId', team.id);
    teamRosters.forEach(roster => {
      const player = players.findBy('id', roster.playerId);
      roster.set('player', player);
    });

    // cleanup bad roster positions
    const nullRoster = teamRosters.filterBy('rosterPosition', null);
    nullRoster.forEach(ros => ros.destroyRecord());

    team.set('teamRosters', teamRosters);
    return team;
  },

  saveTradeRequest(trade) {
    // load data
    return this.getTeamData(trade).then(data => {
      // set the acceptedOn data to now.
      trade.set('acceptedOn', moment().unix());

      // move picks: fromTeam -> toTeam
      return this.moveDraftPicks(trade.get('fromPickModels'), data.toTeam.id).then(() => {

        // move picks: toTeam -> fromTeam
        return this.moveDraftPicks(trade.get('toPickModels'), data.fromTeam.id).then(() => {

          // move trades: fromTeam -> toTeam
          return this.movePlayerRosters(trade.get('fromPlayerModels'), data.toTeam).then(() => {

            // move trade: toTeam -> fromTeam
            return this.movePlayerRosters(trade.get('toPlayerModels'), data.fromTeam).then(() => {
              return trade.save();
            });
          });
        });
      });
    });
  },

  actions: {
    acceptTrade(trade) {
      // start saving message
      this.set('isSaving', true);

      // look for changes in trade before submitting.
      this.get('store').findRecord('trade-request', trade.id).then(tr => {

        // make sure trade is still available.
        if (Ember.isNone(tr.get('rejectedOn'))) {
          // save trades
          this.saveTradeRequest(trade).then(() => {

            // stop loading message
            this.set('isSaving', false);

            // refresh page
            window.location = '/';
          });
        } else {
          // refresh page
          window.location = '/';
        }
      });
    },

    declineTrade(trade) {

      // look for changes in trade before submitting.
      this.get('store').findRecord('trade-request', trade.id).then(tr => {

        // make sure trade is still available.
        if (Ember.isNone(tr.get('rejectedOn')) && Ember.isNone(tr.get('acceptedOn'))) {
          trade.set('rejectedOn', moment().unix());
          trade.save().then(() => {
            window.location = '/';
          });
        } else {
          window.location = '/';
        }
      });
    }
  }
});
