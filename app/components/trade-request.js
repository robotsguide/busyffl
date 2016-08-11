import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['v-trade-request'],

  store: Ember.inject.service('store'),
  model: null,

  players: null,

  findEmptyRosterSpot(team) {
    let roster;
    team.get('teamRosters').forEach(ros => {
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

  addToRoster(roster, team) {
    // get roster player
    const player = this.get('players').findBy('id', roster.get('playerId'));

    // get a current open roster spot or create a new one.
    let newRoster = this.findEmptyRosterSpot(team);
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
      player.set('rosterId', roster.id);

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

  movePlayerRosters(rosters, team) {
    const rosterPromise = [];
    rosters.forEach(ros => {
      // add to new team roster
      rosterPromise.push(this.addToRoster(ros, team));

      // remove old roster
      if (ros.get('rosterPosition') >= 105) {
        rosterPromise.push(ros.destroyRecord());
      } else {
        ros.set('playerId', null);
        rosterPromise.push(ros.save());
      }
    });

    return Ember.RSVP.all(rosterPromise);
  },

  moveDraftPicks(picks, teamId) {
    const picksPromise = [];
    picks.forEach(pick => {
      const newPick = this.get('store').createRecord('draft-pick', {
        teamId: teamId,
        roundNumber: pick.get('roundNumber'),
        pickNumber: pick.get('pickNumber')
      });

      picksPromise.push(newPick.save());
      picksPromise.push(pick.destroyRecord());
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
      const toTeamPicks = this.moveDraftPicks(trade.get('fromPickModels'), data.toTeam.id);

      // move picks: toTeam -> fromTeam
      const fromTeamPicks = this.moveDraftPicks(trade.get('toPickModels'), data.fromTeam.id);

      // move trades: fromTeam -> toTeam
      const toTeamTrades = this.movePlayerRosters(trade.get('fromPlayerModels'), data.toTeam);

      // move trade: toTeam -> fromTeam
      const fromTeamTrades = this.movePlayerRosters(trade.get('toPlayerModels'), data.fromTeam);

      // wait for all trades to complete
      return Ember.RSVP.hash({toTeamPicks, fromTeamPicks, toTeamTrades, fromTeamTrades}).then(() => {
        // save the trade
        return trade.save();
      });
    });
  },

  actions: {
    acceptTrade(trade) {
      // start saving message
      this.set('isSaving', true);

      // save trades
      this.saveTradeRequest(trade).then(() => {

        // stop loading message
        this.set('isSaving', false);

        // refresh page
        window.location = '/';
      });
    },

    declineTrade(trade) {
      trade.set('rejectedOn', moment().unix());
      trade.save().then(() => {
        window.location = '/';
      });
    }
  }
});
