import Ember from 'ember';

const kClosedRosterPos = [10, 20, 30, 40, 50, 60, 80, 90];

export default Ember.Component.extend({
  classNames: ['v-team-table'],

  store: Ember.inject.service('store'),
  model: null,

  owner: false,

  showDropDialog: false,
  showTradeDialog: false,

  moveState: null,

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

  actions: {
    move(roster) {
      const movePos = roster.get('player.type');
      this.get('model.team.teamRosters').forEach(ros => {
        const pos = ros.get('rosterPosition');
        if (roster.id === ros.id) {
          ros.set('canPlace', false);
        } else if (kClosedRosterPos.indexOf(pos) === -1) {
          ros.set('canPlace', true);
        } else if ((movePos === 10 && pos === 10) || (movePos === 20 && (pos === 20 || pos === 30)) ||
                  (movePos === 30 && (pos === 40 || pos === 50)) || (movePos === 40 && pos === 60) ||
                  (movePos === 50 && pos === 80) || (movePos === 60 && pos === 90)) {
          ros.set('canPlace', true);
        } else {
          ros.set('canPlace', false);
        }
      });

      this.set('moveState', roster);
    },

    moveTo(roster) {
      if (!Ember.isNone(roster)) {
        const promise = [];
        if (!Ember.isNone(roster.get('player'))) {
          let newState = this.findEmptyRosterSpot(this.get('model.team'));
          if (Ember.isNone(newState)) {
            const pos = this.getOpenPosition(this.get('model.team.teamRosters'));
            newState = this.get('store').createRecord('team-roster', {
              teamId: this.get('model.team.id'),
              rosterPosition: pos,
            });
          }

          newState.set('playerId', roster.get('playerId'));
          newState.set('markedForDrop', roster.get('markedForDrop'));

          promise.push(newState.save());
        }

        roster.set('playerId', this.get('moveState.playerId'));
        roster.set('markedForDrop', this.get('moveState.markedForDrop'));

        promise.push(roster.save());
        if(this.get('moveState.rosterPosition') >= 105) {
          promise.push(this.get('moveState').destroyRecord());
        } else {
          this.set('moveState.playerId', null);
          promise.push(this.get('moveState').save());
        }

        Ember.RSVP.all(promise).then(() => {
          this.set('moveState', null);
          window.location = window.location.pathname;
        });
      }
    },

    cancelMove() {
      this.get('model.team.teamRosters').forEach(ros => {
        ros.set('canPlace', false);
      });

      this.set('moveState', null);
    },

    trade() {
      this.set('showTradeDialog', true);
    },

    cancelTrade() {
      this.set('showTradeDialog', false);
    },

    drop(player) {
      player.set('markedForDrop', true);
      player.save();
    },

    undrop(player) {
      player.set('markedForDrop', false);
      player.save();
    }
  }
});
