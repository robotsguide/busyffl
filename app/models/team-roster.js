import Ember from 'ember';
import DS from 'ember-data';
import { Model } from 'ember-pouch';

const kPositionSymbol = {
  10: "QB",
  20: "RB1",
  30: "RB2",
  40: "WR1",
  50: "WR2",
  60: "TE",
  70: "FLEX",
  80: "K",
  90: "DST",
};

export default Model.extend({
  teamId: DS.attr('string'),
  playerId: DS.attr('string'),
  rosterPosition: DS.attr('number'),
  markedForDrop: DS.attr('boolean'),

  player: null,

  playerName: Ember.computed('player.name', function() {
    return this.get('player.name') || 'Empty';
  }),

  effectiveCost: Ember.computed('player.cost', 'markedForDrop', function() {
    if(!this.get('markedForDrop')) {
      return this.get('player.cost') || 0;
    }
    return 0;
  }),

  actualCost: Ember.computed('player.cost', function() {
    return this.get('player.cost') || 0;
  }),

  positionSymbol: Ember.computed('rosterPosition', function() {
    return kPositionSymbol[this.get('rosterPosition')] || "Bench";
  }),
});
