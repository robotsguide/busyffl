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
  bench6Id: DS.attr('string'),
  bench7Id: DS.attr('string'),
  bench8Id: DS.attr('string'),
  bench9Id: DS.attr('string'),
  bench10Id: DS.attr('string'),
  bench11Id: DS.attr('string'),
  bench12Id: DS.attr('string'),
  bench13Id: DS.attr('string'),
  bench14Id: DS.attr('string'),

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
  bench6: null,
  bench7: null,
  bench8: null,
  bench9: null,
  bench10: null,
  bench11: null,
  bench12: null,
  bench13: null,
  bench14: null,

  salaryTotal: Ember.computed('quarterBackId', 'runningBack1Id', 'runningBack2Id', 'wideReceiver1Id', 'wideReceiver2Id', 'tightEndId', 'flexId', 'kickerId', 'defenseId', 'bench1Id', 'bench2Id', 'bench3Id', 'bench4Id', 'bench5Id', function() {
    return (this.get('quarterBack.cost') || 0) + (this.get('runningBack1.cost') || 0) + (this.get('runningBack2.cost') || 0) + (this.get('wideReceiver1.cost') || 0) +
      (this.get('wideReceiver2.cost') || 0) + (this.get('tightEnd.cost') || 0) + (this.get('flex.cost') || 0) + (this.get('kicker.cost') || 0) + (this.get('defense.cost') || 0) +
      (this.get('bench1.cost') || 0) + (this.get('bench2.cost') || 0) + (this.get('bench3.cost') || 0) + (this.get('bench4.cost') || 0) + (this.get('bench5.cost') || 0) +
      (this.get('bench6.cost') || 0) + (this.get('bench7.cost') || 0) + (this.get('bench8.cost') || 0) + (this.get('bench9.cost') || 0) + (this.get('bench10.cost') || 0) +
      (this.get('bench11.cost') || 0) + (this.get('bench12.cost') || 0) + (this.get('bench13.cost') || 0) + (this.get('bench14.cost') || 0);
  })
});
