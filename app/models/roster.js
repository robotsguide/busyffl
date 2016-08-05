import Ember from 'ember';
import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  teamId: DS.attr('string'),
  quarterBackId: DS.attr('string'),
  runningBack1Id: DS.attr('string'),
  runningBack2Id: DS.attr('string'),
  wideReceiver1Id: DS.attr('string'),
  wideReceiver2Id: DS.attr('string'),
  tightEndId: DS.attr('string'),
  flexId: DS.attr('string'),
  kickerId: DS.attr('string'),
  defenseId: DS.attr('string'),
  bench1Id: DS.attr('string'),
  bench2Id: DS.attr('string'),
  bench3Id: DS.attr('string'),
  bench4Id: DS.attr('string'),
  bench5Id: DS.attr('string'),

  quarterBack: null,
  runningBack1: null,
  runningBack2: null,
  wideReceiver1: null,
  wideReceiver2: null,
  tightEnd: null,
  flex: null,
  kicker: null,
  defense: null,
  bench1: null,
  bench2: null,
  bench3: null,
  bench4: null,
  bench5: null,

  salaryTotal: Ember.computed('quarterBackId', 'runningBack1Id', 'runningBack2Id', 'wideReceiver1Id', 'wideReceiver2Id', 'tightEndId', 'flexId', 'kickerId', 'defenseId', 'bench1Id', 'bench2Id', 'bench3Id', 'bench4Id', 'bench5Id', function() {
    return (this.get('quarterBack.cost') || 0) + (this.get('runningBack1.cost') || 0) + (this.get('runningBack2.cost') || 0) + (this.get('wideReceiver1.cost') || 0) +
      (this.get('wideReceiver2.cost') || 0) + (this.get('tightEnd.cost') || 0) + (this.get('flex.cost') || 0) + (this.get('kicker.cost') || 0) + (this.get('defense.cost') || 0) +
      (this.get('bench1.cost') || 0) + (this.get('bench2.cost') || 0) + (this.get('bench3.cost') || 0) + (this.get('bench4.cost') || 0) + (this.get('bench5.cost') || 0);
  })
});
