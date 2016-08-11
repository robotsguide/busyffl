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
  bench6: null,
  bench7: null,
  bench8: null,
  bench9: null,
  bench10: null,
  bench11: null,
  bench12: null,
  bench13: null,
  bench14: null,

  salaryTotal: Ember.computed('quarterBack.effectiveCost', 'runningBack1.effectiveCost', 'runningBack2.effectiveCost', 'wideReceiver1.effectiveCost', 'wideReceiver2.effectiveCost',
                              'tightEnd.effectiveCost', 'flex.effectiveCost', 'kicker.effectiveCost', 'defense.effectiveCost', 'bench1.effectiveCost', 'bench2.effectiveCost',
                              'bench3.effectiveCost', 'bench4.effectiveCost', 'bench5.effectiveCost', 'bench6.effectiveCost', 'bench7.effectiveCost', 'bench8.effectiveCost',
                              'bench9.effectiveCost', 'bench10.effectiveCost', 'bench11.effectiveCost', 'bench12.effectiveCost', 'bench12.effectiveCost', 'bench13.effectiveCost',
                              'bench14.effectiveCost', function()
  {
    return (this.get('quarterBack.effectiveCost') || 0) + (this.get('runningBack1.effectiveCost') || 0) + (this.get('runningBack2.effectiveCost') || 0) + (this.get('wideReceiver1.effectiveCost') || 0) +
      (this.get('wideReceiver2.effectiveCost') || 0) + (this.get('tightEnd.effectiveCost') || 0) + (this.get('flex.effectiveCost') || 0) + (this.get('kicker.effectiveCost') || 0) + (this.get('defense.effectiveCost') || 0) +
      (this.get('bench1.effectiveCost') || 0) + (this.get('bench2.effectiveCost') || 0) + (this.get('bench3.effectiveCost') || 0) + (this.get('bench4.effectiveCost') || 0) + (this.get('bench5.effectiveCost') || 0) +
      (this.get('bench6.effectiveCost') || 0) + (this.get('bench7.effectiveCost') || 0) + (this.get('bench8.effectiveCost') || 0) + (this.get('bench9.effectiveCost') || 0) + (this.get('bench10.effectiveCost') || 0) +
      (this.get('bench11.effectiveCost') || 0) + (this.get('bench12.effectiveCost') || 0) + (this.get('bench13.effectiveCost') || 0) + (this.get('bench14.effectiveCost') || 0);
  })
});
