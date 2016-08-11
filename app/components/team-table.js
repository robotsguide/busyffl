import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['v-team-table'],

  model: null,

  owner: false,

  showDropDialog: false,
  showTradeDialog: false,

  player: null,

  actions: {
    trade(player) {
      this.set('player', player);
      this.set('showTradeDialog', true);
    },

    cancelTrade() {
      this.set('showTradeDialog', false);
      this.set('player', null);
    },

    drop(player) {
      player.set('markedForDrop', true);
      player.save();
    },

    undrop(player) {
      player.set('markedForDrop', false);
      player.save();
    },

    cancelDrop() {
      this.set('showDropDialog', false);
      this.set('player', null);
    },

    dropPlayer() {
      const roster = this.get('model.team.roster');
      const player = this.get('player');

      if (roster.get('quarterBackId') === player.id) {
        roster.set('quarterBackId', null);
      }
      else if (roster.get('runningBack1Id') === player.id) {
        roster.set('runningBack1Id', null);
      }
      else if (roster.get('runningBack2Id') === player.id) {
        roster.set('runningBack2Id', null);
      }
      else if (roster.get('wideReceiver1Id') === player.id) {
        roster.set('wideReceiver1Id', null);
      }
      else if (roster.get('wideReceiver2Id') === player.id) {
        roster.set('wideReceiver2Id', null);
      }
      else if (roster.get('tightEndId') === player.id) {
        roster.set('tightEndId', null);
      }
      else if (roster.get('flexId') === player.id) {
        roster.set('flexId', null);
      }
      else if (roster.get('kickerId') === player.id) {
        roster.set('kickerId', null);
      }
      else if (roster.get('defenseId') === player.id) {
        roster.set('defenseId', null);
      }
      else if (roster.get('bench1Id') === player.id) {
        roster.set('bench1Id', null);
      }
      else if (roster.get('bench2Id') === player.id) {
        roster.set('bench2Id', null);
      }
      else if (roster.get('bench3Id') === player.id) {
        roster.set('bench3Id', null);
      }
      else if (roster.get('bench4Id') === player.id) {
        roster.set('bench4Id', null);
      }
      else if (roster.get('bench5Id') === player.id) {
        roster.set('bench5Id', null);
      }

      player.set('rosterId', null);
      roster.save().then(() => {
        player.save().then(() => {
          this.set('player', null);
          this.set('showDropDialog', false);
        });
      });
    }
  }
});
