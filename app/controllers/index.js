import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({

  findEmptyRosterSpot(team) {
    let roster;
    team.get('teamRosters').forEach(ros => {
      if (ros.get('rosterPosition') >= 100) {
        if (Ember.isNone(ros.get('playerId'))) {
          roster = ros;
        }
      }
    });

    return roster;
  },

  addToRoster(fromRoster, toTeam) {
    const player = fromRoster.get('player');
    let newRoster = this.findEmptyRosterSpot(toTeam);
    if(Ember.isNone(newRoster)) {
      newRoster = this.store.createRecord('team-roster', {
        teamId: toTeam.id,
        rosterPosition: (toTeam.get('teamRosters').sortBy('rosterPosition').reverse().objectAt(0).get('rosterPosition') + 1)
      });
    }

    newRoster.set('playerId', player.id);
    newRoster.set('markedForDrop', false);

    const nullRoster = toTeam.get('teamRosters').filterBy('rosterPosition', null);
    nullRoster.forEach(ros => ros.destroyRecord());

    if (fromRoster.get('rosterPosition') >= 100) {
      fromRoster.destroyRecord();
    } else {
      fromRoster.set('playerId', null);
      fromRoster.save();
    }

    return newRoster.save().then(ros => {
      toTeam.get('teamRosters').pushObject(ros);
      return ros;
    });
  },

  actions: {
    acceptTrade(trade) {
      const toTeam = trade.get('toTeam');
      const fromTeam = trade.get('fromTeam');

      trade.set('acceptedOn', moment().unix());

      trade.get('fromPickModels').forEach(pick => {
        this.store.createRecord('draft-pick', {
          teamId: toTeam.id,
          roundNumber: pick.get('roundNumber'),
          pickNumber: pick.get('pickNumber')
        }).save();

        pick.destroyRecord();
      });

      trade.get('toPickModels').forEach(pick => {
        this.store.createRecord('draft-pick', {
          teamId: fromTeam.id,
          roundNumber: pick.get('roundNumber'),
          pickNumber: pick.get('pickNumber')
        }).save();

        pick.destroyRecord();
      });

      Ember.RSVP.hash({
        rosters: this.store.findAll('team-roster'),
        players: this.store.findAll('player')
      }).then(data => {
        const promise = [];
        let toTeamRoster = data.rosters.filterBy('teamId', toTeam.id);
        toTeam.set('teamRosters', toTeamRoster);

        let fromTeamRoster = data.rosters.filterBy('teamId', fromTeam.id);
        fromTeam.set('teamRosters', fromTeamRoster);

        trade.get('fromPlayerModels').forEach(ros => {
          promise.push(this.addToRoster(ros, toTeam));
        });

        trade.get('toPlayerModels').forEach(ros => {
          promise.push(this.addToRoster(ros, fromTeam));
        });

        Ember.RSVP.all(promise).then(data2 => {
          const promise2 = [];
          data2.forEach(roster => {
            const player = data.players.findBy('id', roster.get('playerId'));
            player.set('rosterId', roster.id);
            promise2.push(player.save());
          });

          Ember.RSVP.all(promise2).then(() => {
            trade.save().then(() => window.location = '/');
          });
        });
      });
    },

    declineTrade(trade) {
      trade.set('rejectedOn', moment().unix());
      trade.save().then(() => {
        window.location = '/';
      });
    }
  },
});
