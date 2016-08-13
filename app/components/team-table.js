import Ember from 'ember';
import moment from 'moment';

const kClosedRosterPos = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const startTradeTime = 1471219200;
const endTradeTime = 1472428799;

export default Ember.Component.extend({
  classNames: ['v-team-table'],

  store: Ember.inject.service('store'),
  model: null,

  owner: false,

  showDropDialog: false,
  showTradeDialog: false,

  moveState: null,

  init() {
    this._super();

    this.runTimer();
  },

  runTimer() {
    this.set('time', moment().unix());

    setTimeout(() => {
      this.runTimer();
    }, 1000);
  },

  now: Ember.computed('time', function() {
    return moment().add(moment().utcOffset(), 'minute').unix();
  }),

  timeTilTrade: Ember.computed('now', function() {
    return moment.utc(this.get('now')*1000).to(startTradeTime*1000);
  }),

  startTradeDate: Ember.computed(function() {
    return moment(startTradeTime*1000).subtract(moment().utcOffset(), 'minute').format('[The] Do MMM. [@]hh:mm A');
  }),

  endTradeDate: Ember.computed(function() {
    return moment(endTradeTime*1000).subtract(moment().utcOffset(), 'minute').format('[The] Do MMM. [@]hh:mm A');
  }),

  canMakeTrades: Ember.computed('now', function() {
    return (this.get('now') > startTradeTime && this.get('now') < endTradeTime);
  }),

  isBeforeTrade: Ember.computed('now', function() {
    return (this.get('now') < startTradeTime);
  }),

  tradeTitleString: Ember.computed(function() {
    if (this.get('isBeforeTrade')) {
      return `Trades are disabled until ${this.get('startTradeDate')}`;
    } else if (this.get('canMakeTrades')) {
      return `Trades are available until ${this.get('endTradeDate')}`;
    } else {
      return 'Trades are disabled';
    }
  }),

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

   bench.forEach(item => {
     if(item.get('playerId') && position === item.get('rosterPosition')) {
       position = position + 1;
     }
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
        } else if ((movePos === 10 && pos === 10) || (movePos === 20 && (pos === 20 || pos === 30 || pos === 70)) ||
                  (movePos === 30 && (pos === 40 || pos === 50 || pos === 70)) || (movePos === 40 && (pos === 60 || pos === 70)) ||
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
      if(this.get('canMakeTrades')) {
        this.set('showTradeDialog', true);
      }
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
